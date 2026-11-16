export class ApiError extends Error {
  constructor(message: string, public readonly mayHaveSaved = false) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'https://guincho-save-lives-backend.onrender.com').trim().replace(/\/+$/, '')

export async function apiRequest(path: string, body?: unknown): Promise<unknown> {
  if (!apiBaseUrl) throw new ApiError('Configure VITE_API_BASE_URL com o endereço do backend Java.')
  const writing = body !== undefined
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: writing ? 'POST' : 'GET',
      // O CorsConfig Java permite origens externas sem credenciais/cookies.
      credentials: 'omit',
      signal: AbortSignal.timeout(90000),
      ...(writing ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    })
  } catch {
    throw new ApiError(writing
      ? 'A conexão foi interrompida. O registro pode ter sido salvo; confira antes de enviar novamente para evitar duplicidade.'
      : 'Falha de rede ou tempo esgotado ao acessar a API. A Render pode levar alguns instantes para iniciar; tente novamente.', writing)
  }
  if (!response.ok) throw new ApiError(`Não foi possível concluir a operação: HTTP ${response.status}.${writing && response.status >= 500 ? ' O registro pode ter sido salvo; confira antes de reenviar.' : ''}`, writing && response.status >= 500)
  try {
    return await response.json() as unknown
  } catch {
    throw new ApiError(writing
      ? 'O servidor respondeu sem confirmação válida. Confira o registro antes de reenviar para evitar duplicidade.'
      : 'A API retornou uma resposta JSON inválida.', writing)
  }
}
