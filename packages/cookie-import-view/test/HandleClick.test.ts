/* eslint-disable jest/no-restricted-jest-methods */
import { beforeEach, expect, jest, test } from '@jest/globals'
import type { CookieImportViewState } from '../src/parts/CookieImportViewState/CookieImportViewState.ts'

const getCookies = jest.fn<() => Promise<readonly any[]>>()
const addCookies = jest.fn<(cookies: readonly any[]) => Promise<{ readonly added: number; readonly failed: number }>>()

jest.unstable_mockModule('../src/parts/CookieImportProcess/CookieImportProcess.ts', () => ({ getCookies }))
jest.unstable_mockModule('../src/parts/MainProcess/MainProcess.ts', () => ({ addCookies }))

const { handleClick } = await import('../src/parts/HandleClick/HandleClick.ts')

const state: CookieImportViewState = {
  announcement: '',
  announcementVersion: 0,
  height: 600,
  loaded: true,
  uid: 1,
  uri: 'cookie-import-view:///',
  width: 800,
  x: 0,
  y: 0,
}

beforeEach(() => {
  jest.resetAllMocks()
})

test('keeps the choose profile action as a placeholder', async () => {
  await expect(handleClick(state, 'choose-profile')).resolves.toEqual({
    ...state,
    announcement: 'Not implemented',
    announcementVersion: 1,
  })
})

test('reads Firefox cookies in the process and adds them in the main process', async () => {
  const cookies = [{ name: 'session' }]
  getCookies.mockResolvedValue(cookies)
  addCookies.mockResolvedValue({ added: 1, failed: 0 })

  await expect(handleClick(state, 'import-cookies')).resolves.toEqual({
    ...state,
    announcement: 'Imported 1 cookies.',
    announcementVersion: 1,
  })
  expect(addCookies).toHaveBeenCalledWith(cookies)
})

test('reports partial imports', async () => {
  getCookies.mockResolvedValue([{ name: 'one' }, { name: 'two' }])
  addCookies.mockResolvedValue({ added: 1, failed: 1 })

  const result = await handleClick(state, 'import-cookies')
  expect(result.announcement).toBe('Imported 1 cookies. 1 cookies could not be imported.')
})

test('reports import errors', async () => {
  getCookies.mockRejectedValue(new Error('Firefox was not found'))

  const result = await handleClick(state, 'import-cookies')
  expect(result.announcement).toBe('Failed to import Firefox cookies: Firefox was not found')
  expect(addCookies).not.toHaveBeenCalled()
})
