import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import { Notice, PageHero } from '../components/UI'
import { useEmployee } from '../contexts/EmployeeContext'
import { ApiError } from '../services/apiClient'
import { employeeService } from '../services/employeeService'
import type { ApiTowRequest } from '../services/towService'

export function EmployeeApiGate({ children }: { children: ReactNode }) {
  const { session } = useEmployee()
  return session ? children : <Navigate to="/funcionarios/acesso" replace/>
}

export function EmployeeAccessPage() {
  const { session, startSession } = useEmployee()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const sending = useRef(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current) return
    if (!/^\d{8}$/.test(pin)) { setError('Informe o PIN de oito dígitos.'); return }
    sending.current = true; setBusy(true); setError('')
    const submitted = pin
    setPin('')
    try {
      startSession(await employeeService.login(submitted))
      navigate('/funcionarios/painel', { replace: true })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível confirmar o acesso.') }
    finally { sending.current = false; setBusy(false) }
  }
  if (session) return <Navigate to="/funcionarios/painel" replace/>
  return <><PageHero eyebrow="ÁREA RESTRITA" title="Acesso de funcionários." description="Entre com o PIN cadastrado pela equipe para acessar o painel interno."/><div className="page-wrap py-12"><form onSubmit={submit} className="surface mx-auto max-w-xl space-y-6 p-6 sm:p-9" aria-busy={busy}>
    <ShieldCheck className="text-cyan" size={34} aria-hidden="true"/><h2 className="text-2xl font-bold">Confirme seu acesso</h2>
    <label className="field">PIN de oito dígitos<input name="pin" type="password" inputMode="numeric" autoComplete="off" required pattern="[0-9]{8}" minLength={8} maxLength={8} className="input tracking-[.4em]" value={pin} disabled={busy} onChange={event => setPin(event.target.value.replace(/\D/g, '').slice(0, 8))}/></label>
    <p className="text-sm leading-relaxed text-slate-400">Seu acesso será validado pelo servidor. A sessão é temporária e termina ao sair ou recarregar a página.</p>
    {error && <Notice tone="error">{error}</Notice>}
    <button type="submit" disabled={busy} className="btn-primary w-full"><LockKeyhole size={18} aria-hidden="true"/>{busy ? 'Validando acesso...' : 'Entrar no painel'}</button>
  </form></div></>
}

export function EmployeeDashboardPage() {
  const { session, clearSession, endSession } = useEmployee()
  const [requests, setRequests] = useState<ApiTowRequest[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (!session) return
    let active = true
    employeeService.getRequests(session.token).then(data => {
      if (active) { setRequests(data); setState('ready') }
    }).catch(cause => {
      if (!active) return
      if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) { clearSession(); return }
      setError(cause instanceof Error ? cause.message : 'Não foi possível consultar os pedidos.'); setState('error')
    })
    return () => { active = false }
  }, [session, clearSession, attempt])
  async function leave() {
    setLeaving(true)
    try { await endSession() } catch { /* O contexto encerra a sessão local mesmo sem rede. */ }
  }
  return <><PageHero eyebrow="PAINEL INTERNO" title="Área de funcionários." description="Consulte as solicitações registradas para acompanhamento pela equipe."/><div className="page-wrap space-y-6 py-12" aria-busy={state === 'loading'}>
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-bold">Solicitações registradas</h2><button type="button" className="btn-secondary" disabled={leaving} onClick={leave}><LogOut size={18}/>{leaving ? 'Saindo...' : 'Sair do painel'}</button></div>
    {state === 'loading' && <Notice>Consultando solicitações...</Notice>}
    {state === 'error' && <><Notice tone="error">{error}</Notice><button type="button" className="btn-secondary" onClick={() => { setState('loading'); setAttempt(value => value + 1) }}><RefreshCw size={18}/> Tentar novamente</button></>}
    {state === 'ready' && !requests.length && <Notice>Nenhuma solicitação registrada.</Notice>}
    {state === 'ready' && <div className="grid gap-5 lg:grid-cols-2">{requests.map(request => <article key={request.id} className="surface space-y-4 p-6"><div><p className="eyebrow">SOLICITAÇÃO {request.id}</p><h3 className="mt-3 text-xl font-bold">{request.clientName}</h3></div><dl className="space-y-3 text-sm">{[['Origem', request.origin], ['Destino', request.destination], ['Veículo', request.vehicle], ['Problema', request.problem]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 break-words text-slate-200">{value}</dd></div>)}</dl></article>)}</div>}
    <p className="text-sm text-slate-400">Aprovação de documentos e mudanças no status dos atendimentos ainda não estão disponíveis.</p>
  </div></>
}
