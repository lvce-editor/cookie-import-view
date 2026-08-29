import { ViewletCommand } from '@lvce-editor/constants'
import * as CookieImportViewStates from '../CookieImportViewStates/CookieImportViewStates.ts'
import { getCookieImportViewVirtualDom } from '../GetCookieImportViewVirtualDom/GetCookieImportViewVirtualDom.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const render2 = async (uid: number, _diffResult: readonly number[]): Promise<readonly any[]> => {
  const { newState, oldState } = CookieImportViewStates.get(uid)
  CookieImportViewStates.set(uid, newState, newState)
  const commands: any[] = [[ViewletCommand.SetDom2, uid, getCookieImportViewVirtualDom()]]
  if (newState.announcementVersion !== oldState.announcementVersion) {
    commands.push(['Viewlet.ariaAnnounce', newState.announcement])
  }
  if (!RendererProcess.isConnected()) {
    return commands
  }
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, commands)
  return [['Viewlet.commitPending', uid, transactionId]]
}
