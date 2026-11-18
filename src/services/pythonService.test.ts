import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const input = { basePrice: 180, distanceKm: 10, vehicle: 'carro' as const, night: false }

describe('integração com a API Python', () => {
  beforeEach(() => { vi.resetModules(); vi.stubEnv('VITE_PYTHON_API_BASE_URL', undefined) })
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  it('consulta o proxy com os parâmetros do FastAPI e normaliza a resposta real', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('{"valor_estimado":225.0,"moeda":"BRL"}'))
    vi.stubGlobal('fetch', fetch)
    const { pythonService } = await import('./pythonService')
    expect(await pythonService.estimatePrice(input)).toEqual({ amount: 225, currency: 'BRL' })
    expect(fetch).toHaveBeenCalledWith('/api/python/estimativa?preco_base=180&km=10&tipo=carro&noturno=false', expect.objectContaining({ method: 'GET', credentials: 'omit' }))
    expect(fetch.mock.calls[0][1]).not.toHaveProperty('body')
  })

  it('permite endereço Python próprio sem alterar o endereço Java', async () => {
    vi.stubEnv('VITE_PYTHON_API_BASE_URL', ' https://python.example.test/ ')
    vi.stubEnv('VITE_API_BASE_URL', 'https://java.example.test')
    const fetch = vi.fn().mockResolvedValue(new Response('{"valor_estimado":300,"moeda":"BRL"}'))
    vi.stubGlobal('fetch', fetch)
    const { pythonService } = await import('./pythonService')
    await pythonService.estimatePrice({ ...input, vehicle: 'utilitario', night: true })
    expect(fetch.mock.calls[0][0]).toBe('https://python.example.test/estimativa?preco_base=180&km=10&tipo=utilitario&noturno=true')
    expect((await import('./apiClient')).apiBaseUrl).toBe('https://java.example.test')
  })

  it.each([
    { basePrice: 19 }, { basePrice: 10001 }, { basePrice: NaN },
    { distanceKm: 0 }, { distanceKm: -1 }, { distanceKm: 1001 }, { distanceKm: Infinity },
  ])('recusa entradas fora dos limites do Python antes de chamar a rede: %j', async invalid => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
    const { pythonService } = await import('./pythonService')
    await expect(pythonService.estimatePrice({ ...input, ...invalid })).rejects.toThrow('Informe preço base')
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each([
    { valor_estimado: '225', moeda: 'BRL' }, { valor_estimado: -10, moeda: 'BRL' },
    { valor_estimado: 225, moeda: 'USD' }, {}, null, [],
  ])('recusa respostas inválidas sem calcular um valor local: %j', async result => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(result))))
    const { pythonService } = await import('./pythonService')
    await expect(pythonService.estimatePrice(input)).rejects.toThrow('formato inesperado')
  })

  it('expõe erro HTTP, JSON inválido e falha de rede sem mocks ou repetição automática', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('', { status: 422 }))
      .mockResolvedValueOnce(new Response('<html>Erro</html>')).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetch)
    const { pythonService } = await import('./pythonService')
    await expect(pythonService.estimatePrice(input)).rejects.toThrow('HTTP 422')
    await expect(pythonService.estimatePrice(input)).rejects.toThrow('JSON inválida')
    await expect(pythonService.estimatePrice(input)).rejects.toThrow('Falha de rede')
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('propaga cancelamento ao fetch ao sair da tela', async () => {
    const controller = new AbortController()
    const fetch = vi.fn().mockResolvedValue(new Response('{"valor_estimado":225,"moeda":"BRL"}'))
    vi.stubGlobal('fetch', fetch)
    const { pythonService } = await import('./pythonService')
    await pythonService.estimatePrice(input, controller.signal)
    const signal = fetch.mock.calls[0][1].signal as AbortSignal
    expect(signal.aborted).toBe(false)
    controller.abort()
    expect(signal.aborted).toBe(true)
  })

  it('informa configuração Python vazia sem tentar acessar a rede', async () => {
    vi.stubEnv('VITE_PYTHON_API_BASE_URL', '')
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
    const { pythonService } = await import('./pythonService')
    await expect(pythonService.estimatePrice(input)).rejects.toThrow('VITE_PYTHON_API_BASE_URL')
    expect(fetch).not.toHaveBeenCalled()
  })
})
