import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Notice, PageHero } from '../components/UI'
import { pythonService, type EstimateInput, type PriceEstimate } from '../services/pythonService'
import { money } from '../utils/format'

export function EstimatePage() {
  const [params] = useSearchParams()
  const initialPrice = Number(params.get('preco'))
  const [basePrice, setBasePrice] = useState(initialPrice >= 20 && initialPrice <= 10000 ? String(initialPrice) : '')
  const [distance, setDistance] = useState('')
  const [vehicle, setVehicle] = useState<EstimateInput['vehicle']>('carro')
  const [night, setNight] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null)
  const pending = useRef<AbortController | null>(null)
  useEffect(() => () => { pending.current?.abort() }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const controller = new AbortController()
    pending.current = controller
    setBusy(true); setError(''); setEstimate(null)
    try {
      const result = await pythonService.estimatePrice({ basePrice: Number(basePrice), distanceKm: Number(distance), vehicle, night }, controller.signal)
      if (!controller.signal.aborted) setEstimate(result)
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Não foi possível calcular a estimativa.')
    } finally {
      pending.current = null
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  return <><PageHero eyebrow="ESTIMATIVA DE PREÇO" title="Planeje o custo do guincho." description="Informe o preço inicial e a distância prevista para consultar uma estimativa de valor."/>
    <div className="page-wrap py-12">
      <form onSubmit={submit} onChange={() => { setEstimate(null); setError('') }} className="surface mx-auto max-w-3xl space-y-5 p-6 sm:p-9" aria-busy={busy}>
        <h2 className="text-2xl font-bold">Calcular estimativa</h2>
        <p className="text-sm text-slate-300">Cálculo ilustrativo do projeto acadêmico. Informe a distância prevista do percurso; ela não é calculada pelo mapa. O resultado não confirma preço final nem reserva um profissional.</p>
        <fieldset disabled={busy} className="space-y-5">
          <label className="field">Preço inicial do guincho (R$)<input className="input" type="number" required min="20" max="10000" step="0.01" value={basePrice} onChange={event => setBasePrice(event.target.value)}/></label>
          <label className="field">Distância prevista (km)<input className="input" type="number" required min="0.01" max="1000" step="0.01" value={distance} onChange={event => setDistance(event.target.value)}/></label>
          <label className="field">Tipo de veículo<select className="input" value={vehicle} onChange={event => setVehicle(event.target.value as EstimateInput['vehicle'])}><option value="carro">Carro</option><option value="moto">Moto</option><option value="utilitario">Utilitário</option></select></label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={night} onChange={event => setNight(event.target.checked)}/>Atendimento noturno</label>
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Calculando estimativa...' : 'Calcular estimativa'}</button>
        </fieldset>
        {busy && <Notice>Consultando estimativa... A primeira consulta pode demorar alguns instantes.</Notice>}
        {error && <Notice tone="error">{error}</Notice>}
        {estimate && <Notice tone="success">Valor estimado: <strong>{money(estimate.amount)}</strong>. Confirme as condições com o profissional antes de contratar.</Notice>}
        <div className="flex flex-wrap gap-3"><Link className="btn-secondary" to="/buscar-guincho">Consultar profissionais</Link><Link className="btn-secondary" to="/solicitar-guincho">Criar solicitação</Link></div>
      </form>
    </div>
  </>
}
