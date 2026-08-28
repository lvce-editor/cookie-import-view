import { expect, test } from '@jest/globals'
import * as CookieImportViewStrings from '../src/parts/CookieImportViewStrings/CookieImportViewStrings.ts'

test('returns cookie import view strings', () => {
  expect(CookieImportViewStrings.browser()).toBe('Browser')
  expect(CookieImportViewStrings.chooseFirefoxProfile()).toBe('Choose Firefox Profile…')
  expect(CookieImportViewStrings.copyWebsiteSignInCookies()).toBe('Copy website sign-in cookies from a Firefox profile into Simple Browser.')
  expect(CookieImportViewStrings.defaultProfile()).toBe('Default profile')
  expect(CookieImportViewStrings.firefox()).toBe('Firefox')
  expect(CookieImportViewStrings.firefoxProfile()).toBe('Firefox profile')
  expect(CookieImportViewStrings.importCookies()).toBe('Import Cookies')
  expect(CookieImportViewStrings.importFirefoxCookies()).toBe('Import Firefox Cookies')
  expect(CookieImportViewStrings.website()).toBe('Website')
})
