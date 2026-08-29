import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'node:path'
import { rollup, type RollupOptions } from 'rollup'
import { root } from './root.ts'

const createOptions = (input: string, output: string): RollupOptions => ({
  input: join(root, input),
  preserveEntrySignatures: 'strict',
  treeshake: { propertyReadSideEffects: false },
  output: {
    file: join(root, output),
    format: 'es',
    freeze: false,
    generatedCode: { constBindings: true, objectShorthand: true },
  },
  external: ['electron', 'node:sqlite', 'ws'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
})

const allOptions = [
  createOptions('packages/cookie-import-view/src/cookieImportViewWorkerMain.ts', '.tmp/dist/dist/cookieImportViewWorkerMain.js'),
  createOptions('packages/cookie-import-process/src/cookieImportProcessMain.ts', '.tmp/dist/dist/cookieImportProcessMain.js'),
]

export const bundleJs = async (): Promise<void> => {
  for (const options of allOptions) {
    const input = await rollup(options)
    if (Array.isArray(options.output)) {
      for (const output of options.output) {
        await input.write(output)
      }
    } else if (options.output) {
      await input.write(options.output)
    }
  }
}
