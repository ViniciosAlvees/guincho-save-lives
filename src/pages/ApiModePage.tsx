import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Notice, PageHero } from '../components/UI'
import { ApiError } from '../services/apiClient'
import { apiService, type ApiProfessional, type ApiProfessionalInput, type ApiRequestInput, type ApiTowRequest } from '../services/towService'
import { money } from '../utils/format'

export function ApiModePage() {
  const { pathname, search } = useLocation()
  const { id } = useParams()
  if (pathname === '/buscar-guincho' || pathname.startsWith('/guincheiros/')) return <ApiProfessionals id={id} initialRegion={new URLSearchParams(search).get('regiao') || ''}/>
  if (pathname === '/solicitar-guincho') return <><PageHero eyebrow="SOLICITAÇÃO" title="Solicitar atendimento." description="Registre seu pedido no projeto acadêmico Guincho Save Lives."/><div className="page-wrap py-12"><ApiRequestForm/></div></>
  if (pathname === '/cadastro/guincheiro') return <><PageHero eyebrow="PORTAL DO PARCEIRO" title="Cadastre seu guincho." description="Apresente seu serviço e sua região de atendimento."/><div className="page-wrap py-12"><ApiProfessionalForm/></div></>
  return <><PageHero eyebrow="ACESSOS" title="Escolha seu próximo passo." description="Consulte os profissionais ou registre uma solicitação."/><div className="page-wrap space-y-6 py-12"><Notice>Login, contas de clientes, aprovação de documentos, propostas e chat ainda não estão disponíveis. Você pode consultar profissionais e enviar um pedido sem criar uma conta.</Notice><div className="flex flex-wrap gap-3"><Link className="btn-primary" to="/buscar-guincho">Consultar profissionais</Link><Link className="btn-secondary" to="/solicitar-guincho">Criar solicitação</Link><Link className="btn-secondary" to="/cadastro/guincheiro">Cadastrar guincho</Link></div></div></>
}

function ApiProfessionals({ id, initialRegion }: { id?: string; initialRegion: string }) {
  const [professionals, setProfessionals] = useState<ApiProfessional[]>([])
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [message, setMessage] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [region, setRegion] = useState(initialRegion)
  useEffect(() => {
    let active = true
    apiService.getProfessionals().then(data => {
      if (active) { setProfessionals(data); setState('ready') }
    }).catch(error => {
      if (active) { setState('error'); setMessage(error instanceof Error ? error.message : 'Não foi possível consultar os profissionais.') }
    })
    return () => { active = false }
  }, [attempt])
  const query = region.trim().toLocaleLowerCase('pt-BR')
  const visible = professionals.filter(p => id ? p.id === id : `${p.region} ${p.city}`.toLocaleLowerCase('pt-BR').includes(query))
  return <><PageHero eyebrow="PROFISSIONAIS" title={id ? 'Conheça o profissional.' : 'Encontre seu guincho.'} description="Consulte os serviços cadastrados e compare preços e regiões de atendimento."/><div className="page-wrap space-y-6 py-12" aria-busy={state === 'loading'}>
    {!id && <label className="field max-w-xl">Filtrar por região ou cidade<input className="input" value={region} onChange={event => setRegion(event.target.value)} placeholder="Sua região ou cidade"/></label>}
    {state === 'loading' && <Notice>Carregando profissionais... A primeira consulta pode demorar alguns instantes.</Notice>}
    {state === 'error' && <div className="space-y-4"><Notice tone="error">{message}</Notice><button className="btn-secondary" onClick={() => { setState('loading'); setAttempt(a => a + 1) }}>Tentar novamente</button></div>}
    {state === 'ready' && !visible.length && <Notice>{id ? 'Profissional não encontrado.' : 'Nenhum profissional encontrado para esta busca.'}</Notice>}
    {state === 'ready' && <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(p => <article key={p.id} className="surface flex flex-col p-6">
      <h2 className="break-words text-xl font-bold">{p.name}</h2><p className="mt-2 break-words text-slate-300">{p.region} • {p.city}</p><p className="mt-3 text-sm">{p.towType}</p><p className="mt-3 font-bold text-cyan">A partir de {money(p.price)}</p><p className="mt-2 text-sm text-slate-400">Disponibilidade a confirmar.</p>
      <div className="mt-auto flex flex-wrap gap-3 pt-5">{!id && p.id && <Link className="btn-secondary" to={`/guincheiros/${encodeURIComponent(p.id)}`}>Ver perfil</Link>}<Link className="btn-primary" to="/solicitar-guincho">Criar solicitação</Link></div>
    </article>)}</div>}
    <p className="text-sm text-slate-400">O pedido é registrado sem reserva de um profissional. A contratação e o acompanhamento ainda não estão disponíveis.</p>
  </div></>
}

const initialRequest: ApiRequestInput = { clientName: '', origin: '', destination: '', vehicle: 'Carro', problem: '', cep: '' }
function ApiRequestForm() {
  const [data, setData] = useState<ApiRequestInput>(initialRequest)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<ApiTowRequest | null>(null)
  const [uncertain, setUncertain] = useState(false)
  const sending = useRef(false)
  const update = (field: keyof ApiRequestInput, value: string) => setData(previous => ({ ...previous, [field]: value }))
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current || created || uncertain) return
    if (data.clientName.trim().length < 2 || data.origin.trim().length < 5 || data.destination.trim().length < 5 || data.problem.trim().length < 3) {
      setError('Revise seu nome, origem, destino e problema.'); return
    }
    if (data.cep && !/^\d{8}$/.test(data.cep.replace(/\D/g, ''))) { setError('Informe um CEP com 8 dígitos ou deixe o campo vazio.'); return }
    sending.current = true; setBusy(true); setError('')
    try { setCreated(await apiService.createRequest(data)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível enviar a solicitação.'); setUncertain(cause instanceof ApiError && cause.mayHaveSaved) }
    finally { sending.current = false; setBusy(false) }
  }
  return <form onSubmit={submit} className="surface mx-auto max-w-3xl space-y-5 p-6 sm:p-9" aria-busy={busy}>
    <h2 className="text-2xl font-bold">Dados do atendimento</h2><p className="text-sm text-slate-300">Use dados fictícios para testar este projeto acadêmico. O envio registra um pedido; não aciona atendimento de emergência.</p>
    <fieldset disabled={busy || !!created || uncertain} className="space-y-5">
      <label className="field">Nome do cliente<input className="input" required minLength={2} maxLength={80} autoComplete="name" value={data.clientName} onChange={e => update('clientName', e.target.value)}/></label>
      <label className="field">Local de origem<input className="input" required minLength={5} maxLength={160} value={data.origin} onChange={e => update('origin', e.target.value)}/></label>
      <label className="field">CEP da origem (opcional)<input className="input" inputMode="numeric" maxLength={9} placeholder="00000-000" autoComplete="postal-code" value={data.cep || ''} onChange={e => update('cep', e.target.value)}/></label>
      <label className="field">Destino desejado<input className="input" required minLength={5} maxLength={160} value={data.destination} onChange={e => update('destination', e.target.value)}/></label>
      <label className="field">Tipo de veículo<select className="input" value={data.vehicle} onChange={e => update('vehicle', e.target.value)}>{['Carro', 'Moto', 'Utilitário', 'Caminhão'].map(vehicle => <option key={vehicle}>{vehicle}</option>)}</select></label>
      <label className="field">Problema<textarea className="input min-h-28" required minLength={3} maxLength={160} value={data.problem} onChange={e => update('problem', e.target.value)}/></label>
      <button disabled={busy || !!created || uncertain} className="btn-primary w-full">{busy ? 'Enviando solicitação...' : created ? 'Solicitação enviada' : 'Confirmar solicitação'}</button>
    </fieldset>
    {error && <Notice tone="error">{error}</Notice>}
    {uncertain && <Notice>O reenvio foi pausado para evitar pedidos duplicados. Confirme o registro com a equipe antes de abrir outro pedido.</Notice>}
    {created && <><Notice tone="success">Solicitação registrada.{created.id ? ` Protocolo: ${created.id}.` : ' O servidor não informou um protocolo nesta resposta.'} O registro não confirma a contratação de um guincheiro.</Notice><Link className="btn-secondary" to="/buscar-guincho">Voltar à busca</Link></>}
  </form>
}

const initialProfessional: ApiProfessionalInput = { name: '', region: '', city: '', towType: 'Plataforma', price: 180 }
function ApiProfessionalForm() {
  const [data, setData] = useState(initialProfessional)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<ApiProfessional | null>(null)
  const [uncertain, setUncertain] = useState(false)
  const sending = useRef(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current || created || uncertain) return
    if ([data.name, data.region, data.city, data.towType].some(value => value.trim().length < 2) || !Number.isFinite(data.price) || data.price <= 0) { setError('Revise os campos e informe um preço maior que zero.'); return }
    sending.current = true; setBusy(true); setError('')
    try { setCreated(await apiService.createProfessional(data)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível cadastrar o guincho.'); setUncertain(cause instanceof ApiError && cause.mayHaveSaved) }
    finally { sending.current = false; setBusy(false) }
  }
  return <form onSubmit={submit} className="surface mx-auto max-w-3xl space-y-5 p-6 sm:p-9" aria-busy={busy}>
    <h2 className="text-2xl font-bold">Dados do profissional</h2><p className="text-sm text-slate-300">Use dados fictícios neste projeto acadêmico. Este cadastro não cria uma conta de acesso nem realiza análise de documentos.</p>
    <fieldset disabled={busy || !!created || uncertain} className="space-y-5">
      {([['name', 'Nome do profissional'], ['region', 'Região de atendimento'], ['city', 'Cidade']] as const).map(([key, label]) => <label key={key} className="field">{label}<input className="input" required minLength={2} maxLength={80} value={data[key]} onChange={e => setData(previous => ({ ...previous, [key]: e.target.value }))}/></label>)}
      <label className="field">Tipo de guincho<select className="input" value={data.towType} onChange={e => setData(previous => ({ ...previous, towType: e.target.value }))}><option>Plataforma</option><option>Pesado</option><option>Reboque</option></select></label>
      <label className="field">Preço inicial (R$)<input className="input" type="number" required min="0.01" step="0.01" value={Number.isFinite(data.price) ? data.price : ''} onChange={e => setData(previous => ({ ...previous, price: e.target.valueAsNumber }))}/></label>
      <button disabled={busy || !!created || uncertain} className="btn-primary w-full">{busy ? 'Enviando cadastro...' : created ? 'Cadastro enviado' : 'Cadastrar guincho'}</button>
    </fieldset>
    {error && <Notice tone="error">{error}</Notice>}
    {uncertain && <Notice>Confira a busca de profissionais antes de reenviar para evitar um cadastro duplicado.</Notice>}
    {created && <Notice tone="success">Cadastro de {created.name} registrado.{created.id ? ` Identificador: ${created.id}.` : ' O servidor não informou um identificador nesta resposta.'}</Notice>}
    <Link className="btn-secondary" to="/buscar-guincho">Consultar profissionais</Link>
  </form>
}
