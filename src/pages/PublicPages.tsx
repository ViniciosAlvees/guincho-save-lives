import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Radio, ShieldCheck, Truck, Users } from 'lucide-react'
import { HeroAnimation } from '../components/HeroAnimation'
import { PageHero } from '../components/UI'
import { isApiMode } from '../services/towService'

export function Home() {
  const [region, setRegion] = useState('')
  const navigate = useNavigate()
  const benefits = isApiMode
    ? [[MapPin, 'Busque na sua região', 'Consulte os profissionais cadastrados por região e cidade.'], [Truck, 'Compare os serviços', 'Confira tipo de guincho e preço inicial antes de registrar um pedido.'], [CheckCircle2, 'Descreva o atendimento', 'Informe origem, destino e problema em um formulário com validação.']] as const
    : [[MapPin, 'Encontre perto de você', 'Busque profissionais por região, veículo, disponibilidade e preço ilustrativo.'], [MessageCircle, 'Negocie com clareza', 'Receba propostas, envie contrapropostas e converse no mesmo fluxo demonstrativo.'], [Radio, 'Acompanhe cada etapa', 'Do pedido ao atendimento concluído, visualize o status sem perder o contexto.']] as const
  return <>
    <section className="cinematic-hero">
      <div className="cinematic-hero__grid" aria-hidden="true"/>
      <div className="page-wrap cinematic-hero__inner">
        <div className="hero-copy">
          <div className="eyebrow hero-kicker inline-flex items-center gap-2"><span className="status-dot"/> GLOBAL SOLUTION 2026/2</div>
          <h1 className="hero-headline"><span>Sua jornada</span> <span className="text-lime">continua.</span><br/><span>A ajuda chega.</span></h1>
          <p className="hero-subtitle">{isApiMode ? 'Consulte serviços de guincho por região, compare informações e registre os dados do atendimento em um só lugar.' : 'Tecnologia que conecta. Agilidade que faz a diferença. Encontre profissionais de guincho próximos e acompanhe cada etapa em uma experiência simples.'}</p>
          <div className="hero-actions flex flex-wrap gap-3"><Link to="/solicitar-guincho" className="btn-primary">Solicitar guincho <ArrowRight size={18}/></Link><Link to="/buscar-guincho" className="btn-secondary">Explorar profissionais</Link></div>
          <form onSubmit={e => { e.preventDefault(); navigate(`/buscar-guincho${region.trim() ? `?regiao=${encodeURIComponent(region.trim())}` : ''}`) }} className="hero-search surface flex flex-col gap-3 p-3 sm:flex-row"><label className="flex flex-1 items-center gap-2 text-cyan"><MapPin size={20}/><span className="sr-only">Digite uma região</span><input className="w-full bg-transparent p-2 text-white outline-none placeholder:text-slate-400" value={region} onChange={e => setRegion(e.target.value)} placeholder="Sua região ou cidade"/></label><button className="btn-primary shrink-0">Busca rápida</button></form>
          <p className="hero-caption text-xs text-slate-400">{isApiMode ? 'Projeto acadêmico. Seu pedido será registrado no servidor da equipe.' : 'Simulação acadêmica. Nenhum atendimento real é solicitado.'}</p>
        </div>
        <HeroAnimation/>
      </div>
      <div className="hero-edge" aria-hidden="true"><span>01 / 04</span><span>CONEXÃO EM MOVIMENTO</span><span>↓</span></div>
    </section>
    <section className="page-wrap py-20"><div className="max-w-2xl"><p className="eyebrow">POR QUE EXISTIMOS</p><h2 className="section-title mt-4">Menos incerteza. <span className="text-lime">Mais movimento.</span></h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{benefits.map(([Icon, title, text]) => <article key={title} className="surface surface-hover p-7"><Icon className="text-cyan" size={32}/><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-400">{text}</p></article>)}</div></section>
    <section className="border-y border-white/10 bg-panel py-20"><div className="page-wrap grid items-center gap-10 lg:grid-cols-2"><div><p className="eyebrow">COMO FUNCIONA</p><h2 className="section-title mt-4">Da solicitação à solução, <span className="text-cyan">sem ruído.</span></h2><p className="mt-5 text-slate-300">{isApiMode ? 'Consulte os profissionais cadastrados e envie seu pedido ao servidor da equipe. Negociação, chat e acompanhamento ainda estão em desenvolvimento.' : 'Uma jornada desenhada para conectar motoristas e guincheiros de forma transparente. Neste protótipo, tudo acontece localmente no seu navegador.'}</p><Link to="/sobre" className="btn-ghost mt-7">Conheça o projeto <ArrowRight size={17}/></Link></div><div className="space-y-4">{(isApiMode ? [['01', 'Localize', 'Consulte profissionais por região e cidade.'], ['02', 'Compare', 'Confira tipo de guincho e preço inicial.'], ['03', 'Solicite', 'Registre seu nome, origem, destino e problema.']] : [['01', 'Localize', 'Encontre um profissional ou descreva o atendimento.'], ['02', 'Negocie', 'Analise propostas e escolha a melhor para você.'], ['03', 'Acompanhe', 'Converse e acompanhe a evolução do chamado.']]).map(([n,t,d]) => <div key={n} className="surface flex gap-5 p-5"><strong className="text-2xl text-lime">{n}</strong><div><h3 className="font-bold">{t}</h3><p className="mt-1 text-sm text-slate-400">{d}</p></div></div>)}</div></div></section>
    <section className="page-wrap grid gap-5 py-20 md:grid-cols-2"><div className="surface p-8"><Truck className="text-lime"/><h2 className="mt-5 text-2xl font-black">Precisa de ajuda?</h2><p className="mt-2 text-slate-400">{isApiMode ? 'Informe os dados do atendimento para registrar seu pedido.' : 'Crie um pedido demonstrativo e veja o fluxo do motorista.'}</p><Link to={isApiMode ? '/solicitar-guincho' : '/cadastro/cliente'} className="btn-primary mt-6">{isApiMode ? 'Criar solicitação' : 'Entrar como cliente'}</Link></div><div className="surface p-8"><Users className="text-cyan"/><h2 className="mt-5 text-2xl font-black">Você é guincheiro?</h2><p className="mt-2 text-slate-400">{isApiMode ? 'Cadastre seu serviço, preço inicial e região de atendimento.' : 'Conheça o painel de chamados e propostas do profissional.'}</p><Link to="/cadastro/guincheiro" className="btn-secondary mt-6">{isApiMode ? 'Cadastrar guincho' : 'Conhecer portal do guincheiro'}</Link></div></section>
  </>
}

export { About } from './AboutPage'

const faqs = [
  ['Este é um serviço real de guincho?', 'Não. Este é um protótipo acadêmico demonstrativo. Os profissionais, preços e chamados iniciais são fictícios.'],
  ['Como funciona o modo demonstração?', 'As ações são armazenadas localmente neste navegador. Você pode alternar entre cliente e guincheiro para testar o fluxo completo.'],
  ['A distância mostrada é uma rota?', 'Não. Quando disponível, é uma aproximação em linha reta. Não representa distância rodoviária nem previsão de chegada.'],
  ['O pagamento é feito pela plataforma?', 'Não. Os valores são ilustrativos e não há cobrança ou pagamento neste protótipo.'],
  ['O chat envia mensagens para outra pessoa?', 'Não. O chat é local e demonstrativo, visível apenas neste navegador.'],
  ['Quais recursos estão conectados ao servidor?', 'No modo API, a busca, o cadastro de guincheiros e o envio de solicitações utilizam o servidor Java da equipe. Login, documentos, negociação e chat ainda não estão disponíveis. No modo demo, o fluxo completo é simulado localmente.'],
]
export function FAQ() { return <><PageHero eyebrow="CENTRAL DE AJUDA" title="Perguntas frequentes." description="Tudo o que você precisa saber sobre este protótipo demonstrativo."/><div className="page-wrap max-w-4xl space-y-3 py-16">{faqs.map(([q,a]) => <details key={q} className="surface group p-5"><summary className="cursor-pointer list-none pr-4 font-bold marker:hidden">{q}<span className="float-right text-lime group-open:rotate-45">+</span></summary><p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-300">{a}</p></details>)}</div></> }

export { Contact } from './ContactPage'

export function Enter() {
  if (isApiMode) return <><PageHero eyebrow="GUINCHO SAVE LIVES" title="Como podemos ajudar?" description="Escolha um serviço para continuar."/><div className="page-wrap grid gap-5 py-16 md:grid-cols-3">{[['/buscar-guincho', 'Encontrar guincho', 'Compare profissionais por região e preço.'], ['/solicitar-guincho', 'Criar solicitação', 'Registre os dados do seu pedido.'], ['/cadastro/guincheiro', 'Cadastrar guincho', 'Apresente seu serviço e região de atendimento.']].map(([to, title, description]) => <Link key={to} to={to} className="surface surface-hover p-8"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-3 text-slate-400">{description}</p><ArrowRight className="mt-6 text-cyan" size={20}/></Link>)}</div></>
  return <><PageHero eyebrow="ACESSO DEMONSTRATIVO" title="Escolha como explorar." description="Três áreas, uma operação. O modo demo simula acesso local; não existe autenticação real."/><div className="page-wrap grid gap-5 py-16 md:grid-cols-3"><Link to="/login/cliente" className="surface surface-hover p-8 text-left"><Truck className="text-cyan" size={32}/><h2 className="mt-5 text-2xl font-bold">Sou cliente</h2><p className="mt-2 text-slate-400">Criar pedido, comparar propostas e acompanhar.</p><span className="mt-6 inline-flex items-center gap-2 font-bold text-cyan">Entrar <ArrowRight size={16}/></span></Link><Link to="/login/guincheiro" className="surface surface-hover p-8 text-left"><Users className="text-cyan" size={32}/><h2 className="mt-5 text-2xl font-bold">Sou guincheiro</h2><p className="mt-2 text-slate-400">Acompanhar aprovação e responder chamados.</p><span className="mt-6 inline-flex items-center gap-2 font-bold text-cyan">Entrar <ArrowRight size={16}/></span></Link><Link to="/funcionarios/acesso" className="surface surface-hover p-8 text-left"><ShieldCheck className="text-cyan" size={32}/><h2 className="mt-5 text-2xl font-bold">Funcionários</h2><p className="mt-2 text-slate-400">Analisar cadastros no painel fictício.</p><span className="mt-6 inline-flex items-center gap-2 font-bold text-cyan">Acessar <ArrowRight size={16}/></span></Link></div><div className="page-wrap pb-16 text-sm text-slate-400">Primeiro acesso? <Link to="/cadastro/cliente" className="text-cyan underline">Cadastro de cliente</Link> ou <Link to="/cadastro/guincheiro" className="text-cyan underline">cadastro de guincheiro</Link>.</div></>
}

export function NotFound() { return <div className="page-wrap py-24 text-center"><p className="eyebrow">ERRO 404</p><h1 className="section-title mt-4">Rota não encontrada.</h1><p className="mt-4 text-slate-400">Esta página não existe neste protótipo.</p><Link to="/" className="btn-primary mt-8">Voltar ao início <CheckCircle2 size={17}/></Link></div> }
