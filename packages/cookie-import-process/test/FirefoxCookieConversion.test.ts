import { expect, test } from '@jest/globals'
import { convert } from '../src/parts/FirefoxCookieConversion/FirefoxCookieConversion.ts'

const row = {
  expiry: 200,
  host: '::1',
  isHttpOnly: 0,
  isSecure: 0,
  name: 'session',
  originAttributes: '',
  path: '',
  sameSite: 0,
  value: 'value',
}

test('converts IPv6 and same-site values', () => {
  expect(convert(row, 100)).toEqual({
    expirationDate: 200,
    httpOnly: false,
    name: 'session',
    path: '/',
    sameSite: 'no_restriction',
    secure: false,
    url: 'http://[::1]/',
    value: 'value',
  })
})

test('skips invalid hosts', () => {
  expect(convert({ ...row, host: '.' }, 100)).toBeUndefined()
})
