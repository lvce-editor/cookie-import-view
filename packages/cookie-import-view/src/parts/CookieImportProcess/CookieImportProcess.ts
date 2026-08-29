import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { Cookie } from '../Cookie/Cookie.ts'

const state: { rpcPromise: Promise<Rpc> | undefined } = { rpcPromise: undefined }

const create = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port) {
      await RendererWorker.invokeAndTransfer(
        'SendMessagePortToElectron.sendMessagePortToElectron',
        port,
        'HandleMessagePortForCookieImportProcess.handleMessagePortForCookieImportProcess',
      )
    },
  })
}

const getRpc = (): Promise<Rpc> => {
  state.rpcPromise ||= create()
  const { rpcPromise } = state
  return rpcPromise
}

export const getCookies = async (): Promise<readonly Cookie[]> => {
  const rpc = await getRpc()
  return rpc.invoke('FirefoxCookieImport.getCookies')
}
