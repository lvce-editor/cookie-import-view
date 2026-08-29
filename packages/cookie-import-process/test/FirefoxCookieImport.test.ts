/* eslint-disable jest/no-restricted-jest-methods */
import { afterEach, expect, jest, test } from '@jest/globals'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const temporaryDirectories: string[] = []
const readCookies = jest.fn<(path: string) => readonly any[]>()

jest.unstable_mockModule('../src/parts/FirefoxCookieDatabase/FirefoxCookieDatabase.ts', () => ({ readCookies }))

const FirefoxCookieImport = await import('../src/parts/FirefoxCookieImport/FirefoxCookieImport.ts')

const createTemporaryDirectory = (): string => {
  const directory = mkdtempSync(join(tmpdir(), 'firefox-cookie-import-'))
  temporaryDirectories.push(directory)
  return directory
}

const createFirefoxProfile = (): string => {
  const firefoxDataDirectory = createTemporaryDirectory()
  writeFileSync(
    join(firefoxDataDirectory, 'profiles.ini'),
    [
      '[Profile0]',
      'Name=Default profile',
      'IsRelative=1',
      'Path=Profiles/default',
      'Default=1',
      '',
      '[Profile1]',
      'Name=Work',
      'IsRelative=1',
      'Path=Profiles/work',
      '',
      '[Install1234]',
      'Default=Profiles/work',
      'Locked=1',
    ].join('\n'),
  )
  mkdirSync(join(firefoxDataDirectory, 'Profiles', 'work'), { recursive: true })
  writeFileSync(join(firefoxDataDirectory, 'Profiles', 'work', 'cookies.sqlite'), '')
  return firefoxDataDirectory
}

const createCookie = (values: Readonly<Record<string, unknown>> = {}): any => ({
  expiry: Math.floor(Date.now() / 1000) + 3600,
  host: 'example.com',
  isHttpOnly: 0,
  isSecure: 0,
  name: 'session',
  originAttributes: '',
  path: '/',
  sameSite: 256,
  value: 'secret',
  ...values,
})

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { force: true, recursive: true })
  }
  temporaryDirectories.length = 0
  jest.resetAllMocks()
})

test('returns converted cookies from the active Firefox profile', () => {
  const firefoxDataDirectory = createFirefoxProfile()
  readCookies.mockReturnValue([
    createCookie({ host: '.example.com', isHttpOnly: 1, isSecure: 1, sameSite: 1 }),
    createCookie({ expiry: 1, name: 'expired' }),
    createCookie({ name: 'container', originAttributes: '^userContextId=1' }),
  ])

  expect(FirefoxCookieImport.getCookiesFromDirectory(firefoxDataDirectory)).toEqual([
    {
      domain: '.example.com',
      expirationDate: expect.any(Number),
      httpOnly: true,
      name: 'session',
      path: '/',
      sameSite: 'lax',
      secure: true,
      url: 'https://example.com/',
      value: 'secret',
    },
  ])
  expect(readCookies).toHaveBeenCalledWith(join(firefoxDataDirectory, 'Profiles', 'work', 'cookies.sqlite'))
})
