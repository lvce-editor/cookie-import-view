import * as CookieImportViewStates from '../CookieImportViewStates/CookieImportViewStates.ts'

export const diff2 = (uid: number): readonly number[] => CookieImportViewStates.diff(uid, [(): boolean => false], [1])
