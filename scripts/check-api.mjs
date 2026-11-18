import process from 'node:process'
import { log } from 'node:console'

const base = (process.env.VITE_API_BASE_URL || 'https://guincho-save-lives-backend.onrender.com').replace(/\/+$/, '')
const origin = process.env.VITE_FRONTEND_ORIGIN || 'https://gincho-save-lives.vercel.app'
const pythonBase = (process.env.VITE_PYTHON_API_BASE_URL || '/api/python').trim().replace(/\/+$/, '')
// URL relativa exige o proxy Vite/Vercel. Sem FRONTEND_BASE_URL, consulta a API Python na Vercel diretamente.
const pythonUsesProxy = pythonBase.startsWith('/')
const pythonTarget = pythonUsesProxy
  ? process.env.FRONTEND_BASE_URL ? `${process.env.FRONTEND_BASE_URL.replace(/\/+$/, '')}${pythonBase}` : 'https://python-guincho-save.vercel.app'
  : pythonBase
const checks = [
  ...['/guincheiros', '/solicitacoes'].map(path => ({ api: 'Java', base, path, corsRequired: true, authenticationRequired: path === '/solicitacoes', validate: Array.isArray })),
  { api: 'Python', base: pythonTarget, path: '/', corsRequired: !pythonUsesProxy, validate: data => data?.status === 'online' && typeof data.java_configurado === 'boolean' },
  { api: 'Python', base: pythonTarget, path: '/estimativa?preco_base=180&km=10&tipo=carro&noturno=false', corsRequired: !pythonUsesProxy, validate: data => data?.moeda === 'BRL' && data.valor_estimado === 225 },
]
const results = await Promise.all(checks.map(async ({ api, base: target, path, corsRequired, authenticationRequired = false, validate }) => {
  try {
    const response = await fetch(`${target}${path}`, { headers: { Origin: origin }, signal: AbortSignal.timeout(90000) })
    const data = await response.json().catch(() => null)
    const cors = response.headers.get('access-control-allow-origin')
    const corsAccepted = cors === '*' || cors === origin
    const accessAccepted = authenticationRequired ? response.status === 401 || response.status === 403 : response.ok && validate(data)
    let postAccepted = true
    let preflightHttp
    if (api === 'Java') {
      const preflight = await fetch(`${target}${path}`, { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' }, signal: AbortSignal.timeout(90000) })
      preflightHttp = preflight.status
      const allowedOrigin = preflight.headers.get('access-control-allow-origin')
      const methods = (preflight.headers.get('access-control-allow-methods') || '').toUpperCase().split(',').map(value => value.trim())
      const headers = (preflight.headers.get('access-control-allow-headers') || '').toLowerCase().split(',').map(value => value.trim())
      postAccepted = preflight.ok && (allowedOrigin === '*' || allowedOrigin === origin) && methods.includes('POST') && (headers.includes('*') || headers.includes('content-type'))
    }
    const valid = accessAccepted && postAccepted && (!corsRequired || corsAccepted)
    return { api, base: target, path, http: response.status, contractValid: validate(data), records: Array.isArray(data) ? data.length : null, corsAccepted, corsRequired, authenticationRequired, publicRequestList: authenticationRequired && response.ok && Array.isArray(data), preflightHttp, postAccepted, ok: valid }
  } catch (cause) {
    return { api, base: target, path, ok: false, error: cause instanceof Error ? cause.message : 'Falha de conexão' }
  }
}))
log(JSON.stringify({ results, note: 'Somente GET/OPTIONS. Espera listagem de solicitações protegida com 401/403. Não testa escrita, persistência ou navegador. Python usa proxy por padrão; configure FRONTEND_BASE_URL para verificá-lo. Sem essa variável, testa a API Python na Vercel diretamente. Não exibe dados pessoais.' }, null, 2))
if (results.some(result => !result.ok)) process.exitCode = 1
