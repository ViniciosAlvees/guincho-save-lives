export class ApiError extends Error {
  constructor(message: string, public readonly mayHaveSaved = false, public readonly status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'https://guincho-save-lives-backend.onrender.com').trim().replace(/\/+$/, '')

interface ApiRequestOptions { method?: 'GET' | 'POST' | 'DELETE'; token?: string; uncertainWrite?: boolean; emptyResponse?: boolean }

export async function apiRequest(path: string, body?: unknown, options: ApiRequestOptions = {}): Promise<unknown> {
  if (!apiBaseUrl) throw new ApiError('Configure VITE_API_BASE_URL com o endereço do backend Java.')
  const method = options.method ?? (body !== undefined ? 'POST' : 'GET')
  const writing = options.uncertainWrite ?? (body !== undefined)
  const headers = { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) }
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      // O CorsConfig Java permite origens externas sem credenciais/cookies.
      credentials: 'omit',
      signal: AbortSignal.timeout(90000),
      ...(Object.keys(headers).length ? { headers } : {}),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch {
    throw new ApiError(writing
      ? 'A conexão foi interrompida. O registro pode ter sido salvo; confira antes de enviar novamente para evitar duplicidade.'
      : 'Falha de rede ou tempo esgotado ao acessar a API. A Render pode levar alguns instantes para iniciar; tente novamente.', writing)
  }
  if (!response.ok) throw new ApiError(`Não foi possível concluir a operação: HTTP ${response.status}.${writing && response.status >= 500 ? ' O registro pode ter sido salvo; confira antes de reenviar.' : ''}`, writing && response.status >= 500, response.status)
  if (options.emptyResponse && response.status === 204) return undefined
  try {
    return await response.json() as unknown
  } catch {
    throw new ApiError(writing
      ? 'O servidor respondeu sem confirmação válida. Confira o registro antes de reenviar para evitar duplicidade.'
      : 'A API retornou uma resposta JSON inválida.', writing)
  }
}
