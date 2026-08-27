import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = join(currentDir, '..', '..', '..')
const nodeModulesPath = join(root, 'node_modules')
const workerPath = join(root, '.tmp', 'dist', 'dist', 'cookieImportViewWorkerMain.js')
const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')
const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find((dirent) => dirent.length === 7 && /^[a-z\d]+$/.test(dirent)) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const content = await readFile(rendererWorkerMainPath, 'utf8')

if (!content.includes('// const cookieImportViewWorkerUrl = ')) {
  const occurrence = 'const cookieImportViewWorkerUrl = `${assetDir}/packages/cookie-import-view/dist/cookieImportViewWorkerMain.js`'
  if (!content.includes(occurrence)) {
    console.info('cookie import view worker URL is not available in this LVCE server version yet')
    process.exit(0)
  }
  const remoteUrl = `/remote/${pathToFileURL(workerPath).toString().slice(8)}`
  const replacement = `// ${occurrence}\nconst cookieImportViewWorkerUrl = \`${remoteUrl}\``
  const updated = content.replace(occurrence, replacement)
  await writeFile(rendererWorkerMainPath, updated)
}
