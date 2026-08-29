import type { Rpc } from '@lvce-editor/rpc'
import { expect, test } from '@jest/globals'
import type { CookieImportViewState } from '../src/parts/CookieImportViewState/CookieImportViewState.ts'
import * as CookieImportViewStates from '../src/parts/CookieImportViewStates/CookieImportViewStates.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

const createState = (announcementVersion: number): CookieImportViewState => ({
  announcement: 'Test announcement',
  announcementVersion,
  height: 600,
  loaded: true,
  uid: 42,
  uri: 'cookie-import-view:///',
  width: 800,
  x: 0,
  y: 0,
})

test('announces the latest action result', async () => {
  CookieImportViewStates.set(42, createState(0), createState(1))
  const commands = await render2(42, [1])
  expect(commands).toContainEqual(['Viewlet.ariaAnnounce', 'Test announcement'])
})

test('does not announce during a regular render', async () => {
  const state = createState(0)
  CookieImportViewStates.set(42, state, state)
  const commands = await render2(42, [1])
  expect(commands).not.toContainEqual(['Viewlet.ariaAnnounce', 'Test announcement'])
})

test('queues commands when connected to the renderer process', async () => {
  const invocations: any[] = []
  const mockRpc = {
    dispose: async () => {},
    invoke: async (method: string, ...params: readonly any[]) => {
      invocations.push([method, ...params])
      return 99
    },
    invokeAndTransfer: async () => {},
  } as unknown as Rpc
  RendererProcess.set(mockRpc)
  CookieImportViewStates.set(42, createState(0), createState(1))

  await expect(render2(42, [1])).resolves.toEqual([['Viewlet.commitPending', 42, 99]])
  expect(invocations).toHaveLength(1)
  expect(invocations[0][0]).toBe('Viewlet.queueCommands')
  expect(invocations[0][1]).toBe(42)
  expect(invocations[0][2]).toContainEqual(['Viewlet.ariaAnnounce', 'Test announcement'])
})
