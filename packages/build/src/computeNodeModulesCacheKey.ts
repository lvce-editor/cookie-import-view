import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.ts'

const locations = ['package.json', 'package-lock.json', '.github/workflows/pr.yml', '.github/workflows/ci.yml', '.github/workflows/release.yml']
const contents = await Promise.all(locations.map((location) => readFile(join(root, location), 'utf8')))
const hash = createHash('sha1')
for (const content of contents) {
  hash.update(content)
}
process.stdout.write(hash.digest('hex'))
