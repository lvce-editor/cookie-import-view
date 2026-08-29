import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'

export const handleElectronMessagePort = async (messagePort: MessagePort): Promise<void> => {
  await ElectronMessagePortRpcClient.create({
    commandMap: CommandMapRef.commandMapRef,
    messagePort,
    requiresSocket: false,
  })
}
