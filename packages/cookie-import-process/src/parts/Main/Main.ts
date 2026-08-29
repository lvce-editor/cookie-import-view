import { ElectronUtilityProcessRpcClient, NodeForkedProcessRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'

export const main = async (argv: readonly string[]): Promise<void> => {
  Object.assign(CommandMapRef.commandMapRef, CommandMap.commandMap)
  if (argv.includes('--ipc-type=electron-utility-process')) {
    await ElectronUtilityProcessRpcClient.create({ commandMap: CommandMap.commandMap })
    return
  }
  if (argv.includes('--ipc-type=node-forked-process')) {
    await NodeForkedProcessRpcClient.create({ commandMap: CommandMap.commandMap })
    return
  }
  throw new Error('[cookie-import-process] unknown ipc type')
}
