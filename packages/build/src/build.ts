import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bundleJs } from './bundleJs.ts'
import { root } from './root.ts'

const dist = join(root, '.tmp', 'dist')

const getVersion = async (): Promise<string> => {
  const version = process.env.RG_VERSION || process.env.GIT_TAG || '0.0.0-dev'
  return version.startsWith('v') ? version.slice(1) : version
}

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await bundleJs()

const packageJsonPath = join(root, 'packages', 'cookie-import-view', 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
delete packageJson.scripts
delete packageJson.devDependencies
delete packageJson.jest
packageJson.version = await getVersion()
packageJson.main = 'dist/cookieImportViewWorkerMain.js'
packageJson.bin = {
  'cookie-import-process': 'bin/cookieImportProcess.js',
}

await writeFile(join(dist, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
await mkdir(join(dist, 'bin'))
await writeFile(join(dist, 'bin', 'cookieImportProcess.js'), "#!/usr/bin/env node\n\nimport '../dist/cookieImportProcessMain.js'\n")
await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))
