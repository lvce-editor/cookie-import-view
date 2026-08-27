import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { CookieImportViewState } from '../CookieImportViewState/CookieImportViewState.ts'

export const { diff, dispose, get, getCommandIds, registerCommands, set, wrapCommand } = ViewletRegistry.create<CookieImportViewState>()
