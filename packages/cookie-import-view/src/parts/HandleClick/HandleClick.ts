import type { CookieImportViewState } from '../CookieImportViewState/CookieImportViewState.ts'
import * as CookieImportProcess from '../CookieImportProcess/CookieImportProcess.ts'
import * as MainProcess from '../MainProcess/MainProcess.ts'

const withAnnouncement = (state: CookieImportViewState, announcement: string): CookieImportViewState => {
  const { announcementVersion } = state
  return {
    ...state,
    announcement,
    announcementVersion: announcementVersion + 1,
  }
}

export const handleClick = async (state: CookieImportViewState, name: string): Promise<CookieImportViewState> => {
  if (name !== 'import-cookies') {
    return withAnnouncement(state, 'Not implemented')
  }
  try {
    const cookies = await CookieImportProcess.getCookies()
    const { added, failed } = await MainProcess.addCookies(cookies)
    const announcement = failed ? `Imported ${added} cookies. ${failed} cookies could not be imported.` : `Imported ${added} cookies.`
    return withAnnouncement(state, announcement)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return withAnnouncement(state, `Failed to import Firefox cookies: ${message}`)
  }
}
