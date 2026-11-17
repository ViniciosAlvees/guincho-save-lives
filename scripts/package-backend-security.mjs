import { createHash } from 'node:crypto'
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { log } from 'node:console'
import { zipSync, unzipSync } from 'fflate'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const source = join(root, 'support', 'backend-security')
const files = Object.create(null)
async function collect(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || ['.git', 'target', 'node_modules', '.env'].includes(entry.name)) throw new Error('Arquivo não permitido no pacote de correção.')
    const name = prefix + entry.name
    if (entry.isDirectory()) await collect(join(directory, entry.name), name + '/')
    else files[name] = new Uint8Array(await readFile(join(directory, entry.name)))
  }
}
await collect(source)
const zip = zipSync(files, { level: 6 })
const extracted = unzipSync(zip)
const checksum = bytes => createHash('sha256').update(bytes).digest('hex')
for (const [name, bytes] of Object.entries(files)) {
  if (!extracted[name] || checksum(bytes) !== checksum(extracted[name])) throw new Error('Falha na verificação do pacote de correção.')
}
const output = join(root, 'output')
await mkdir(output, { recursive: true })
await writeFile(join(output, 'guincho-backend-seguranca.zip'), zip)
await writeFile(join(output, 'manifesto-backend-seguranca.json'), JSON.stringify({ bytes: zip.length, sha256: checksum(zip), files: Object.keys(files).sort() }, null, 2) + '\n')
log(`Correção do backend: ${Object.keys(files).length} arquivos, ${zip.length} bytes. Não aplicada ao Render.`)
