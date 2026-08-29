/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(method: string) => Promise<any>>()
const invokeAndTransfer = jest.fn<(...args: readonly any[]) => Promise<void>>()
const state: { send: ((port: MessagePort) => Promise<void>) | undefined } = { send: undefined }
const create = jest.fn(async (options: any) => {
  const { send } = options
  state.send = send
  return { invoke }
})

jest.unstable_mockModule('@lvce-editor/rpc', () => ({ LazyTransferMessagePortRpcParent: { create } }))
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ RendererWorker: { invokeAndTransfer } }))

const CookieImportProcess = await import('../src/parts/CookieImportProcess/CookieImportProcess.ts')

test('gets Firefox cookies over a lazily transferred process port', async () => {
  const cookies = [{ name: 'session' }]
  invoke.mockResolvedValue(cookies)

  await expect(CookieImportProcess.getCookies()).resolves.toBe(cookies)
  expect(invoke).toHaveBeenCalledWith('FirefoxCookieImport.getCookies')

  const port = {} as MessagePort
  const { send } = state
  await send?.(port)
  expect(invokeAndTransfer).toHaveBeenCalledWith(
    'SendMessagePortToElectron.sendMessagePortToElectron',
    port,
    'HandleMessagePortForCookieImportProcess.handleMessagePortForCookieImportProcess',
  )
})
