import process from 'node:process'
import { log } from 'node:console'

const frontend = new URL(process.env.FRONTEND_BASE_URL || 'https://gincho-save-lives.vercel.app')
if (!['https:', 'http:'].includes(frontend.protocol) || frontend.username || frontend.password) {
  throw new Error('FRONTEND_BASE_URL deve ser uma URL HTTP(S), sem credenciais.')
}

const cases = [
  { tipo: 'carro', noturno: false, amount: 225 },
  { tipo: 'carro', noturno: true, amount: 270 },
  { tipo: 'moto', noturno: false, amount: 191.25 },
  { tipo: 'moto', noturno: true, amount: 229.5 },
  { tipo: 'utilitario', noturno: false, amount: 303.75 },
  { tipo: 'utilitario', noturno: true, amount: 364.5 },
  { tipo: 'caminhao', noturno: false, status: 422 },
]

let frontendCheck
try {
  const page = await fetch(new URL('/estimar-guincho', frontend), { signal: AbortSignal.timeout(90000), redirect: 'error' })
  const html = await page.text()
  const script = html.match(/<script[^>]+src="([^"]+)"/i)?.[1]
  if (!page.ok || !page.headers.get('content-type')?.includes('text/html') || !script) {
    throw new Error('A página da calculadora não entregou o HTML e o bundle esperados.')
  }
  const assetUrl = new URL(script, frontend)
  if (assetUrl.origin !== frontend.origin) throw new Error('Bundle fora da origem do frontend.')
  const asset = await fetch(assetUrl, { signal: AbortSignal.timeout(90000), redirect: 'error' })
  const javascript = await asset.text()
  const integrated = javascript.includes('/api/python') && javascript.includes('/estimar-guincho') && javascript.includes('Valor estimado:')
  frontendCheck = { http: page.status, assetHttp: asset.status, integrated, ok: asset.ok && integrated }
} catch (cause) {
  frontendCheck = { ok: false, error: cause instanceof Error ? cause.message : 'Falha ao consultar o frontend' }
}

const results = await Promise.all(cases.map(async ({ tipo, noturno, amount, status = 200 }) => {
  const url = new URL('/api/python/estimativa', frontend)
  url.search = new URLSearchParams({ preco_base: '180', km: '10', tipo, noturno: String(noturno) }).toString()
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(90000), redirect: 'error' })
    const contentType = response.headers.get('content-type') || ''
    const data = await response.json().catch(() => null)
    const json = contentType.includes('application/json')
    const contract = status === 422
      ? Array.isArray(data?.detail) && data.detail.length > 0
      : data?.moeda === 'BRL' && data.valor_estimado === amount
    return { tipo, noturno, http: response.status, contentType, amount: data?.valor_estimado, ok: response.status === status && json && contract }
  } catch (cause) {
    return { tipo, noturno, ok: false, error: cause instanceof Error ? cause.message : 'Falha de conexão' }
  }
}))

log(JSON.stringify({ frontend: frontend.origin, frontendCheck, results, note: 'Somente GET pelo proxy público. Verifica HTML/bundle publicado, JSON, parâmetros e validação; não testa gravação nem renderização no navegador.' }, null, 2))
if (!frontendCheck.ok || results.some(result => !result.ok)) process.exitCode = 1
