import { createHash } from 'node:crypto'
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { log, error } from 'node:console'
import { zipSync, unzipSync } from 'fflate'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const required = ['package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'eslint.config.js', 'vercel.json', '.env.example', '.env.production', '.gitignore', 'README.md', 'identificacao.txt']
const forbidden = /(^|\/)(node_modules|\.git|dist|target|coverage|output|\.aws|\.codex|\.agents)(\/|$)|\.(log|tmp|tsbuildinfo|pem|key|p12|pfx)$/i
const files = Object.create(null)
const checksum = data => createHash('sha256').update(data).digest('hex')

async function addFile(path) {
  const name = relative(root, path).replaceAll('\\', '/')
  if (name.startsWith('../') || forbidden.test(name) || (name.split('/').some(part => part.startsWith('.env')) && !['.env.example', '.env.production'].includes(name))) {
    throw new Error(`Arquivo não permitido no pacote: ${name}`)
  }
  const bytes = await readFile(path)
  if (['.env.example', '.env.production'].includes(name)) {
    const keys = bytes.toString('utf8').split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => line.split('=')[0].trim())
    if (keys.some(key => !['VITE_APP_MODE', 'VITE_API_BASE_URL', 'VITE_PYTHON_API_BASE_URL'].includes(key))) throw new Error(`Configuração pública não autorizada em ${name}.`)
  }
  files[name] = new Uint8Array(bytes)
}

async function addDirectory(path) {
  for (const entry of (await readdir(path, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink()) throw new Error(`Link simbólico não permitido no pacote: ${entry.name}`)
    if (forbidden.test(entry.name) || entry.name.startsWith('.env')) continue
    const child = join(path, entry.name)
    if (entry.isDirectory()) await addDirectory(child)
    else if (entry.isFile()) await addFile(child)
  }
}

try {
  // Lista explícita: nunca compactar a pasta inteira nem depender do .gitignore.
  for (const name of required) await addFile(join(root, name))
  for (const directory of ['src', 'docs', 'scripts', 'support']) await addDirectory(join(root, directory))
  for (const name of ['src/main.tsx', 'src/App.tsx', 'src/index.css']) {
    if (!files[name]) throw new Error(`Arquivo essencial ausente: ${name}`)
  }
  const zip = zipSync(files, { level: 6 })
  if (zip.length > 50_000_000) throw new Error(`O ZIP ultrapassa 50 MB: ${zip.length} bytes.`)
  const extracted = unzipSync(zip)
  if (Object.keys(extracted).length !== Object.keys(files).length) throw new Error('A quantidade de arquivos compactados não corresponde à origem.')
  for (const [name, bytes] of Object.entries(files)) {
    if (!extracted[name] || checksum(bytes) !== checksum(extracted[name])) throw new Error(`Conteúdo inválido após compactação: ${name}`)
  }
  const output = join(root, 'output')
  await mkdir(output, { recursive: true })
  const archive = join(output, 'guincho-save-lives-entrega.zip')
  await writeFile(archive, zip)
  const manifest = { archive: 'guincho-save-lives-entrega.zip', bytes: zip.length, sha256: checksum(zip), files: Object.keys(files).sort() }
  await writeFile(join(output, 'manifesto-entrega.json'), JSON.stringify(manifest, null, 2) + '\n')
  log(`ZIP criado: ${archive}\n${manifest.files.length} arquivos • ${zip.length} bytes • SHA256 ${manifest.sha256}`)
} catch (cause) {
  error(cause instanceof Error ? cause.message : cause)
  process.exitCode = 1
}
