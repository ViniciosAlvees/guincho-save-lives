import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const professional = { id: '12', name: 'Guincho de teste', region: 'Centro', city: 'São Paulo', towType: 'Plataforma', price: 180 }
const request = { id: '34', clientName: 'Cliente de teste', origin: 'Rua de origem', destination: 'Oficina destino', vehicle: 'Carro', problem: 'Pane elétrica', cep: '01001000' }

describe('contrato real da API Java', () => {
  beforeEach(() => { vi.resetModules(); vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/') })
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  it('consulta os seis campos do Java, sem cookies e sem cabeçalhos desnecessários', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([professional])))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    expect(await apiService.getProfessionals()).toEqual([professional])
    expect(fetch).toHaveBeenCalledWith('https://api.example.test/guincheiros', expect.objectContaining({ method: 'GET', credentials: 'omit' }))
    expect(fetch.mock.calls[0][1]).not.toHaveProperty('headers')
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })

  it('normaliza também os getters portugueses serializados pelo Jackson', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 12, nome: professional.name, regiao: 'Centro', cidade: 'São Paulo', tipoGuincho: 'Plataforma', preco: 180 }]))))
    const { apiService } = await import('./towService')
    expect(await apiService.getProfessionals()).toEqual([professional])
  })

  it('lê solicitações sem inventar status, propostas ou datas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([request]))))
    const { apiService } = await import('./towService')
    expect(await apiService.getRequests()).toEqual([request])
  })

  it('envia nome e CEP ao Java e aceita o POST atual com id nulo', async () => {
    const created = { ...request, id: null }
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(created), { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    expect(await apiService.createRequest({ ...request, clientName: ' Cliente de teste ', cep: '01001-000' })).toEqual(created)
    expect(fetch).toHaveBeenCalledWith('https://api.example.test/solicitacoes', expect.objectContaining({ method: 'POST', credentials: 'omit', body: JSON.stringify({ clientName: request.clientName, origin: request.origin, destination: request.destination, vehicle: request.vehicle, problem: request.problem, cep: '01001000' }) }))
  })

  it('envia CEP vazio como null para não consultar o ViaCEP com string vazia', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...request, id: null, cep: null }), { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    await apiService.createRequest({ ...request, cep: '' })
    expect(JSON.parse(fetch.mock.calls[0][1].body).cep).toBeNull()
  })

  it('cadastra guincheiro pela rota POST existente sem enviar senha ou documentos', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...professional, id: null }), { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    expect(await apiService.createProfessional(professional)).toEqual({ ...professional, id: null })
    expect(fetch).toHaveBeenCalledWith('https://api.example.test/guincheiros', expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: professional.name, region: professional.region, city: professional.city, towType: professional.towType, price: professional.price }) }))
  })

  it('aceita lista vazia e rejeita paginação que não faz parte do contrato', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('[]')).mockResolvedValueOnce(new Response('{"content":[]}')))
    const { apiService } = await import('./towService')
    expect(await apiService.getProfessionals()).toEqual([])
    await expect(apiService.getProfessionals()).rejects.toThrow('formato inesperado')
  })

  it.each([{ ...professional, price: -1 }, { ...professional, id: null }, { ...professional, name: null }])('rejeita profissional inválido: %j', async invalid => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([invalid]))))
    const { apiService } = await import('./towService')
    await expect(apiService.getProfessionals()).rejects.toThrow('formato inesperado')
  })

  it('informa falhas HTTP e de rede sem retornar mocks', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('', { status: 500 })).mockRejectedValueOnce(new TypeError('Failed to fetch')))
    const { apiService } = await import('./towService')
    await expect(apiService.getProfessionals()).rejects.toThrow('HTTP 500')
    await expect(apiService.getProfessionals()).rejects.toThrow('Falha de rede')
  })

  it.each(['network', 'http', 'json', 'contract', 'empty'])('sinaliza escrita incerta para impedir reenvio automático: %s', async failure => {
    const fetch = vi.fn()
    if (failure === 'network') fetch.mockRejectedValue(new TypeError('Failed to fetch'))
    else if (failure === 'http') fetch.mockResolvedValue(new Response('', { status: 500 }))
    else if (failure === 'json') fetch.mockResolvedValue(new Response('<html>Erro</html>', { status: 201 }))
    else if (failure === 'empty') fetch.mockResolvedValue(new Response(null, { status: 204 }))
    else fetch.mockResolvedValue(new Response('{}', { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    await expect(apiService.createRequest(request)).rejects.toMatchObject({ mayHaveSaved: true })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('não bloqueia correção de uma requisição recusada com HTTP 400', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 400 })))
    const { apiService } = await import('./towService')
    await expect(apiService.createRequest(request)).rejects.toMatchObject({ mayHaveSaved: false })
  })

  it('informa configuração vazia antes de chamar a rede', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    await expect(apiService.getProfessionals()).rejects.toThrow('VITE_API_BASE_URL')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('usa Render e modo API por padrão, mantendo demo como opção explícita', async () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined)
    vi.stubEnv('VITE_APP_MODE', undefined)
    const { apiBaseUrl } = await import('./apiClient')
    const { isApiMode } = await import('./towService')
    expect(apiBaseUrl).toBe('https://guincho-save-lives-backend.onrender.com')
    expect(isApiMode).toBe(true)
    vi.resetModules(); vi.stubEnv('VITE_APP_MODE', 'demo')
    expect((await import('./towService')).isApiMode).toBe(false)
  })
})
