import type { CookieImportViewState } from '../CookieImportViewState/CookieImportViewState.ts'
import * as CookieImportViewStates from '../CookieImportViewStates/CookieImportViewStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number): void => {
  const state: CookieImportViewState = {
    announcement: '',
    announcementVersion: 0,
    height,
    loaded: false,
    uid,
    uri,
    width,
    x,
    y,
  }
  CookieImportViewStates.set(uid, state, state)
}
