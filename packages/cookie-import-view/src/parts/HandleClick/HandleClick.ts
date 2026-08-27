import type { CookieImportViewState } from '../CookieImportViewState/CookieImportViewState.ts'

export const handleClick = (state: CookieImportViewState): CookieImportViewState => {
  const { announcementVersion } = state
  return {
    ...state,
    announcementVersion: announcementVersion + 1,
  }
}
