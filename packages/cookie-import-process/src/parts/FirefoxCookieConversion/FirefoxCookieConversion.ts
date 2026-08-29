import type { Cookie } from '../Cookie/Cookie.ts'
import type { FirefoxCookieRow } from '../FirefoxCookieDatabase/FirefoxCookieDatabase.ts'

const getSameSite = (sameSite: number): Cookie['sameSite'] => {
  switch (sameSite) {
    case 0:
      return 'no_restriction'
    case 1:
      return 'lax'
    case 2:
      return 'strict'
    default:
      return 'unspecified'
  }
}

const getUrlHost = (host: string): string => (host.includes(':') && !host.startsWith('[') ? `[${host}]` : host)

export const convert = (row: FirefoxCookieRow, now: number = Date.now() / 1000): Cookie | undefined => {
  if (!row.host || row.originAttributes) {
    return undefined
  }
  const host = row.host.startsWith('.') ? row.host.slice(1) : row.host
  if (!host || !Number.isFinite(row.expiry) || row.expiry <= now) {
    return undefined
  }
  const secure = Boolean(row.isSecure)
  const cookie: Cookie = {
    expirationDate: row.expiry,
    httpOnly: Boolean(row.isHttpOnly),
    name: row.name,
    path: row.path || '/',
    sameSite: getSameSite(row.sameSite),
    secure,
    url: `${secure ? 'https' : 'http'}://${getUrlHost(host)}/`,
    value: row.value,
  }
  if (row.host.startsWith('.')) {
    return { ...cookie, domain: row.host }
  }
  return cookie
}
