import type { CookieImportViewState } from '../CookieImportViewState/CookieImportViewState.ts'

interface Dimensions {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

export const resize = (state: CookieImportViewState, dimensions: Dimensions): CookieImportViewState => ({ ...state, ...dimensions })
