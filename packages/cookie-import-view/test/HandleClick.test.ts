import { expect, test } from '@jest/globals'
import type { CookieImportViewState } from '../src/parts/CookieImportViewState/CookieImportViewState.ts'
import { handleClick } from '../src/parts/HandleClick/HandleClick.ts'

const state: CookieImportViewState = {
  announcementVersion: 0,
  height: 600,
  loaded: true,
  uid: 1,
  uri: 'cookie-import-view:///',
  width: 800,
  x: 0,
  y: 0,
}

test('marks an announcement for every placeholder action', () => {
  expect(handleClick(state).announcementVersion).toBe(1)
  expect(handleClick(handleClick(state)).announcementVersion).toBe(2)
})
