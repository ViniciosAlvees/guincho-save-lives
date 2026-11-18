import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useDemo } from '../contexts/DemoContext'
import { isApiMode } from '../services/towService'
import { usePageTitle } from '../hooks/usePageTitle'
import { useVisualMotion } from '../hooks/useVisualMotion'
import brandMark from '../assets/brand-mark.svg'

const nav = [['/', 'Início'], ['/buscar-guincho', 'Encontrar guincho'], ['/sobre', 'A solução'], ['/integrantes', 'Integrantes'], ['/faq', 'FAQ'], ['/contato', 'Contato'], ['/pitch', 'Pitch']]
const accessLinks = isApiMode
  ? [['/solicitar-guincho', 'Solicitar guincho'], ['/estimar-guincho', 'Estimar preço'], ['/cadastro/guincheiro', 'Cadastrar guincho'], ['/funcionarios/acesso', 'Funcionários']]
  : [['/cadastro/cliente', 'Cadastro cliente'], ['/login/cliente', 'Entrada cliente'], ['/cadastro/guincheiro', 'Cadastro guincheiro'], ['/login/guincheiro', 'Entrada guincheiro'], ['/funcionarios/acesso', 'Funcionários']]

export function Layout({ children }: { children: React.ReactNode }) {
  usePageTitle()
  useVisualMotion()
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()
  const { role, setRole } = useDemo()
  const dashboard = role === 'cliente' ? '/cliente/painel' : '/guincheiro/painel'
  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  return <div className="app-shell min-h-screen bg-ink text-mist">
    <div className="app-ambient" aria-hidden="true"><span/><span/><span/></div>
    <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-lime focus:p-3 focus:text-ink">Pular para o conteúdo</a>
    <div className="demo-ribbon px-4 py-1.5 text-center text-[10px] font-bold tracking-[.16em] text-lime sm:text-xs" role="status">{isApiMode ? 'PROJETO ACADÊMICO • cadastros e solicitações enviados ao servidor da equipe' : 'MODO DEMONSTRAÇÃO • dados fictícios • funcionamento local neste navegador'}</div>
    <header className="site-header sticky top-0 z-[1000] border-b border-white/10 backdrop-blur-xl">
      <div className="page-wrap flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-sm font-black tracking-tight sm:text-base" onClick={() => setOpen(false)}><img src={brandMark} alt="" className="size-9 rounded-lg"/><span>GUINCHO<span className="text-lime"> SAVE LIVES</span></span></Link>
        <div ref={menu} className="relative ml-auto flex items-center gap-3">
          <Link to={isApiMode ? '/solicitar-guincho' : dashboard} className="header-action btn-primary !min-h-10 !px-4 text-xs" onClick={() => setOpen(false)}>{isApiMode ? 'Solicitar guincho' : 'Meu painel'} <ArrowRight size={14}/></Link>
          <button ref={toggle} type="button" className="menu-toggle flex min-h-11 items-center gap-2 rounded-lg border border-cyan/40 px-3 py-2 text-sm font-bold text-cyan" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}>{open ? <X size={20}/> : <Menu size={20}/>} Menu</button>
          {open && <nav id="site-menu" className="site-menu surface absolute right-0 top-[calc(100%+1rem)] flex max-h-[calc(100dvh-150px)] w-[min(20rem,calc(100vw-2.5rem))] flex-col gap-1 p-3" aria-label="Menu principal">
            {[...nav, ...accessLinks].map(([to, label]) => <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-cyan/10 hover:text-cyan ${pathname === to ? 'bg-cyan/15 text-cyan' : 'text-slate-200'}`}>{label}</Link>)}
            {!isApiMode && <><label className="field border-t border-white/10 px-3 pt-3">Perfil de demonstração<select className="input" value={role} onChange={e => setRole(e.target.value as 'cliente' | 'guincheiro')}><option value="cliente">Cliente demo</option><option value="guincheiro">Guincheiro demo</option></select></label><Link to={dashboard} onClick={() => setOpen(false)} className="btn-primary mt-2">Meu painel</Link></>}
          </nav>}
        </div>
      </div>
    </header>
    <main id="conteudo" key={pathname} className="route-frame">{children}</main>
    <footer className="site-footer border-t border-white/10 py-12"><div className="page-wrap grid gap-8 md:grid-cols-3"><div><div className="font-black tracking-wide">GUINCHO <span className="text-lime">SAVE LIVES</span></div><p className="mt-3 max-w-xs text-sm text-slate-400">Tecnologia que conecta. Agilidade que faz a diferença.</p><p className="mt-3 text-xs text-slate-500">Projeto acadêmico • Global Solution 2026/2 • FIAP</p></div><div className="flex flex-col items-start gap-2 text-sm text-slate-300"><Link to="/sobre" className="hover:text-lime">Sobre</Link><Link to="/integrantes" className="hover:text-lime">Integrantes</Link><Link to="/faq" className="hover:text-lime">Perguntas frequentes</Link></div><div className="flex flex-col items-start gap-2 text-sm text-slate-300"><Link to="/contato" className="hover:text-lime">Contato</Link><Link to="/cadastro/guincheiro" className="hover:text-lime">Seja um parceiro</Link><p className="mt-2 text-xs text-slate-500">Não é um serviço real de emergência ou transporte.</p></div></div></footer>
  </div>
}
