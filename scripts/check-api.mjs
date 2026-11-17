import process from 'node:process'
import { log } from 'node:console'

const base = (process.env.VITE_API_BASE_URL || 'https://guincho-save-lives-backend.onrender.com').replace(/\/+$/, '')
const origin = process.env.VITE_FRONTEND_ORIGIN || 'https://gincho-save-lives.vercel.app'
const results = await Promise.all(['/guincheiros', '/solicitacoes'].map(async path => {
  try {
    const response = await fetch(`${base}${path}`, { headers: { Origin: origin }, signal: AbortSignal.timeout(90000) })
    const data = await response.json().catch(() => null)
    const cors = response.headers.get('access-control-allow-origin')
    const corsAccepted = cors === '*' || cors === origin
    const preflight = await fetch(`${base}${path}`, {
      method: 'OPTIONS',
      headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' },
      signal: AbortSignal.timeout(90000),
    })
    const allowedOrigin = preflight.headers.get('access-control-allow-origin')
    const methods = (preflight.headers.get('access-control-allow-methods') || '').toUpperCase().split(',').map(value => value.trim())
    const headers = (preflight.headers.get('access-control-allow-headers') || '').toLowerCase().split(',').map(value => value.trim())
    const postAccepted = preflight.ok && (allowedOrigin === '*' || allowedOrigin === origin) && methods.includes('POST') && (headers.includes('*') || headers.includes('content-type'))
    const protectedList = path === '/solicitacoes'
    const accessAccepted = protectedList ? response.status === 401 || response.status === 403 : response.ok && Array.isArray(data)
    const valid = accessAccepted && corsAccepted && postAccepted
    return { path, http: response.status, list: Array.isArray(data), records: Array.isArray(data) ? data.length : null, corsAccepted, preflightHttp: preflight.status, postAccepted, authenticationRequired: protectedList, publicRequestList: protectedList && response.ok && Array.isArray(data), ok: valid }
  } catch (cause) {
    return { path, ok: false, error: cause instanceof Error ? cause.message : 'Falha de conexão' }
  }
}))
log(JSON.stringify({ base, origin, results, note: 'Somente GET e OPTIONS. Espera GET público de guincheiros e GET /solicitacoes protegido (401/403), além do CORS de POST JSON. Não grava nem exibe dados pessoais.' }, null, 2))
if (results.some(result => !result.ok)) process.exitCode = 1
