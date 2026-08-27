import * as CookieImportViewStates from '../CookieImportViewStates/CookieImportViewStates.ts'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as Resize from '../Resize/Resize.ts'

const handleDirectMessagePort = (port: MessagePort, setAsRendererProcess?: boolean): Promise<void> =>
  handleMessagePort(port, commandMap, setAsRendererProcess)

export const commandMap = {
  'CookieImportView.create': Create.create,
  'CookieImportView.diff2': Diff2.diff2,
  'CookieImportView.dispose': CookieImportViewStates.dispose,
  'CookieImportView.getCommandIds': CookieImportViewStates.getCommandIds,
  'CookieImportView.handleClick': CookieImportViewStates.wrapCommand(HandleClick.handleClick),
  'CookieImportView.handleMessagePort': handleDirectMessagePort,
  'CookieImportView.loadContent': CookieImportViewStates.wrapCommand(LoadContent.loadContent),
  'CookieImportView.render2': Render2.render2,
  'CookieImportView.renderEventListeners': RenderEventListeners.renderEventListeners,
  'CookieImportView.resize': CookieImportViewStates.wrapCommand(Resize.resize),
}
