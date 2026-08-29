/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { afterEach, expect, test } from '@jest/globals'
import { mkdirSync, mkdtempSync, type PathLike, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as FirefoxCookieProfile from '../src/parts/FirefoxCookieProfile/FirefoxCookieProfile.ts'

const temporaryDirectories: string[] = []
const isSnapProfile = (path: PathLike): boolean => String(path).includes('/snap/firefox/')

const createTemporaryDirectory = (): string => {
  const directory = mkdtempSync(join(tmpdir(), 'firefox-cookie-profile-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { force: true, recursive: true })
  }
  temporaryDirectories.length = 0
})

test('resolves platform-specific Firefox directories', () => {
  expect(FirefoxCookieProfile.getFirefoxDataDirectoryForPlatform('win32', 'C:\\Users\\test', 'C:\\Data')).toBe('C:\\Data\\Mozilla\\Firefox')
  expect(FirefoxCookieProfile.getFirefoxDataDirectoryForPlatform('win32', 'C:\\Users\\test', undefined)).toBe(
    'C:\\Users\\test\\AppData\\Roaming\\Mozilla\\Firefox',
  )
  expect(FirefoxCookieProfile.getFirefoxDataDirectoryForPlatform('darwin', '/Users/test', undefined)).toBe(
    '/Users/test/Library/Application Support/Firefox',
  )
})

test('uses the first existing Linux Firefox profile root', () => {
  expect(FirefoxCookieProfile.getFirefoxDataDirectoryForPlatform('linux', '/home/test', undefined, isSnapProfile)).toBe(
    '/home/test/snap/firefox/common/.mozilla/firefox',
  )
})

test('falls back to the regular Linux Firefox profile root', () => {
  expect(FirefoxCookieProfile.getFirefoxDataDirectoryForPlatform('linux', '/home/test', undefined, () => false)).toBe('/home/test/.mozilla/firefox')
})

test('rejects a missing Firefox profile directory', () => {
  const directory = createTemporaryDirectory()
  expect(() => FirefoxCookieProfile.getCookieDatabasePath(directory)).toThrow(`Firefox profile data was not found at ${directory}`)
})

test('rejects profile metadata without profiles', () => {
  const directory = createTemporaryDirectory()
  writeFileSync(join(directory, 'profiles.ini'), '[General]\nStartWithLastProfile=1\n')
  expect(() => FirefoxCookieProfile.getCookieDatabasePath(directory)).toThrow('Firefox profile metadata does not contain a profile')
})

test('rejects a profile without a cookie database', () => {
  const directory = createTemporaryDirectory()
  writeFileSync(join(directory, 'profiles.ini'), '[Profile0]\nPath=Profiles/default\nDefault=1\n')
  expect(() => FirefoxCookieProfile.getCookieDatabasePath(directory)).toThrow('Firefox cookie database was not found for profile Profiles/default')
})

test('supports absolute Firefox profile paths', () => {
  const directory = createTemporaryDirectory()
  const profile = join(directory, 'absolute-profile')
  mkdirSync(profile)
  writeFileSync(join(profile, 'cookies.sqlite'), '')
  writeFileSync(join(directory, 'profiles.ini'), `[Profile0]\nIsRelative=0\nPath=${profile}\n`)
  expect(FirefoxCookieProfile.getCookieDatabasePath(directory)).toBe(join(profile, 'cookies.sqlite'))
})
