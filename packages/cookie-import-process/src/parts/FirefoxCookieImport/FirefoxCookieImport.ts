import type { Cookie } from '../Cookie/Cookie.ts'
import * as FirefoxCookieConversion from '../FirefoxCookieConversion/FirefoxCookieConversion.ts'
import * as FirefoxCookieDatabase from '../FirefoxCookieDatabase/FirefoxCookieDatabase.ts'
import * as FirefoxCookieProfile from '../FirefoxCookieProfile/FirefoxCookieProfile.ts'

export const getCookiesFromDirectory = (firefoxDataDirectory: string): readonly Cookie[] => {
  const databasePath = FirefoxCookieProfile.getCookieDatabasePath(firefoxDataDirectory)
  const rows = FirefoxCookieDatabase.readCookies(databasePath)
  const cookies: Cookie[] = []
  for (const row of rows) {
    const cookie = FirefoxCookieConversion.convert(row)
    if (cookie) {
      cookies.push(cookie)
    }
  }
  return cookies
}

export const getCookies = (): readonly Cookie[] => getCookiesFromDirectory(FirefoxCookieProfile.getFirefoxDataDirectory())
