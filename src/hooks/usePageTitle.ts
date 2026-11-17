import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'Início', '/sobre': 'Sobre', '/integrantes': 'Integrantes', '/faq': 'FAQ', '/contato': 'Contato',
  '/pitch': 'Pitch',
  '/entrar': 'Acesso', '/cadastro/cliente': 'Cadastro de cliente', '/cadastro/guincheiro': 'Cadastro de guincheiro',
  '/login/cliente': 'Login do cliente', '/login/guincheiro': 'Login do guincheiro', '/guincheiro/status': 'Análise cadastral',
  '/funcionarios/acesso': 'Acesso funcionários', '/funcionarios/painel': 'Painel de funcionários',
  '/buscar-guincho': 'Buscar guincho', '/solicitar-guincho': 'Solicitar guincho',
  '/cliente/painel': 'Painel do cliente', '/guincheiro/painel': 'Painel do guincheiro',
}

export function usePageTitle() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const title = titles[pathname] || (pathname.endsWith('/chat') ? 'Chat demonstrativo' : pathname.startsWith('/solicitacoes/') ? 'Solicitação' : pathname.startsWith('/guincheiros/') ? 'Profissional' : 'Página')
    document.title = `${title} | GUINCHO SAVE LIVES`
  }, [pathname])
  useEffect(() => {
    if (hash) {
      try { document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }) }
      catch { /* Uma âncora inválida não deve interromper a navegação. */ }
    } else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
}
