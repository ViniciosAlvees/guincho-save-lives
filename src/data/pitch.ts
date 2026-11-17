export interface ProjectVideo { id: string; title: string; description: string; duration: string; url: string | null }

// Inserir somente os links confirmados pela equipe; nunca usar credenciais em URLs.
export const projectVideos: readonly ProjectVideo[] = [
  { id: 'pitch', title: 'Pitch da solução', description: 'O problema, a proposta CitizenTech e o impacto que queremos gerar.', duration: 'Até 5 minutos', url: null },
  { id: 'frontend', title: 'Demonstração da aplicação', description: 'Navegação, funcionalidades e integração com a API Java.', duration: 'Até 3 minutos', url: null },
]

export function youtubeLink(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) return null
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : null
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube.com/watch?v=${id}` : null
  } catch { return null }
}
