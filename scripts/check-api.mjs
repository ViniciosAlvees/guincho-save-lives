import process from 'node:process'
import { log } from 'node:console'

const base = (process.env.VITE_API_BASE_URL || 'https://guincho-save-lives-backend.onrender.com').replace(/\/+$/, '')
const origin = 'https://gincho-save-lives.vercel.app'
const results = await Promise.all(['/guincheiros', '/solicitacoes'].map(async path => {
  try {
    const response = await fetch(`${base}${path}`, { headers: { Origin: origin }, signal: AbortSignal.timeout(90000) })
    const data = await response.json().catch(() => null)
    const cors = response.headers.get('access-control-allow-origin')
    const valid = response.ok && Array.isArray(data) && (cors === '*' || cors === origin)
    return { path, http: response.status, list: Array.isArray(data), records: Array.isArray(data) ? data.length : null, corsAccepted: cors === '*' || cors === origin, ok: valid }
  } catch (cause) {
    return { path, ok: false, error: cause instanceof Error ? cause.message : 'Falha de conexão' }
  }
}))
log(JSON.stringify({ base, results, note: 'Somente GET. Não testa escrita, persistência ou renderização no navegador e não exibe os dados dos registros.' }, null, 2))
if (results.some(result => !result.ok)) process.exitCode = 1
