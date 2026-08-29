/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(method: string, ...args: readonly any[]) => Promise<any>>()
const invokeAndTransfer = jest.fn<(...args: readonly any[]) => Promise<void>>()
const state: { send: ((port: MessagePort) => Promise<void>) | undefined } = { send: undefined }
const create = jest.fn(async (options: any) => {
  const { send } = options
  state.send = send
  return { invoke }
})

jest.unstable_mockModule('@lvce-editor/rpc', () => ({ LazyTransferMessagePortRpcParent: { create } }))
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ RendererWorker: { invokeAndTransfer } }))

const MainProcess = await import('../src/parts/MainProcess/MainProcess.ts')

test('adds cookies over a lazily transferred main-process port', async () => {
  const cookies = [{ name: 'session' }]
  invoke.mockResolvedValue({ added: 1, failed: 0 })

  await expect(MainProcess.addCookies(cookies as any)).resolves.toEqual({ added: 1, failed: 0 })
  expect(invoke).toHaveBeenCalledWith('ElectronWebContentsView.addCookies', cookies)

  const port = {} as MessagePort
  const { send } = state
  await send?.(port)
  expect(invokeAndTransfer).toHaveBeenCalledWith(
    'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
    port,
    'HandleElectronMessagePort.handleElectronMessagePort',
    0,
  )
})
