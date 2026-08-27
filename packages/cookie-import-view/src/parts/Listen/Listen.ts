import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../CookieImportViewStates/CookieImportViewStates.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await initializeRendererWorker()
}
