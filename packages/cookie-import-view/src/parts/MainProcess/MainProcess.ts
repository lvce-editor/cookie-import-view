import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { Cookie } from '../Cookie/Cookie.ts'

export interface AddCookiesResult {
  readonly added: number
  readonly failed: number
}

const state: { rpcPromise: Promise<Rpc> | undefined } = { rpcPromise: undefined }

const create = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port) {
      await RendererWorker.invokeAndTransfer(
        'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
        port,
        'HandleElectronMessagePort.handleElectronMessagePort',
        0,
      )
    },
  })
}

const getRpc = (): Promise<Rpc> => {
  state.rpcPromise ||= create()
  const { rpcPromise } = state
  return rpcPromise
}

export const addCookies = async (cookies: readonly Cookie[]): Promise<AddCookiesResult> => {
  const rpc = await getRpc()
  return rpc.invoke('ElectronWebContentsView.addCookies', cookies)
}
