/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'

const getCookieDatabasePath = jest.fn<(path: string) => string>(() => '/firefox/cookies.sqlite')
const getFirefoxDataDirectory = jest.fn(() => '/firefox')
const readCookies = jest.fn<(path: string) => readonly any[]>(() => [])

jest.unstable_mockModule('../src/parts/FirefoxCookieProfile/FirefoxCookieProfile.ts', () => ({
  getCookieDatabasePath,
  getFirefoxDataDirectory,
}))
jest.unstable_mockModule('../src/parts/FirefoxCookieDatabase/FirefoxCookieDatabase.ts', () => ({ readCookies }))

const FirefoxCookieImport = await import('../src/parts/FirefoxCookieImport/FirefoxCookieImport.ts')

test('gets cookies from the default Firefox directory', () => {
  expect(FirefoxCookieImport.getCookies()).toEqual([])
  expect(getCookieDatabasePath).toHaveBeenCalledWith('/firefox')
  expect(readCookies).toHaveBeenCalledWith('/firefox/cookies.sqlite')
})
