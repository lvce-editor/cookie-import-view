import type { CookieImportViewState } from '../CookieImportViewState/CookieImportViewState.ts'

export const loadContent = (state: CookieImportViewState): CookieImportViewState => ({
  ...state,
  loaded: true,
})
