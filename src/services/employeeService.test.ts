import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const testPin = String(Math.floor(10000000 + Math.random() * 90000000))
const token = 't'.repeat(43)
const session = () => ({ token, expiresAt: new Date(Date.now() + 1800000).toISOString() })

describe('acesso de funcionários validado pelo servidor', () => {
  beforeEach(() => { vi.resetModules(); vi.stubEnv('VITE_API_BASE_URL', 'https://java.example.test'); vi.stubEnv('VITE_PYTHON_API_BASE_URL', '/api/python') })
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  it('envia o PIN somente no corpo JSON e exige uma sessão válida da API', async () => {
    const value = session()
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(value)))
    vi.stubGlobal('fetch', fetch)
    const { employeeService } = await import('./employeeService')
    expect(await employeeService.login(testPin)).toEqual(value)
    expect(fetch).toHaveBeenCalledWith('/api/python/funcionarios/sessao', expect.objectContaining({ method: 'POST', credentials: 'omit', body: JSON.stringify({ pin: testPin }) }))
    expect(JSON.stringify(fetch.mock.calls[0][1].headers)).not.toContain(testPin)
  })

  it.each(['', '1234', 'abcdefgh', '123456789'])('recusa formato inválido sem chamar a API: %s', async pin => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
    const { employeeService } = await import('./employeeService')
    await expect(employeeService.login(pin)).rejects.toThrow('oito dígitos')
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each([401, 404, 405, 429, 500, 503])('não libera acesso nem expõe o corpo de erro: HTTP %s', async status => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('SQL_INTERNAL_TEST_SENTINEL', { status })))
    const { employeeService } = await import('./employeeService')
    try { await employeeService.login(testPin); expect.fail('Acesso deveria ser recusado') }
    catch (error) {
      expect(error).toMatchObject({ status, mayHaveSaved: false })
      expect((error as Error).message).not.toContain('SQL_INTERNAL_TEST_SENTINEL')
    }
  })

  it.each([{}, { token, expiresAt: 'inválida' }, { token, expiresAt: '2020-01-01T00:00:00Z' }, { token: '<script>', expiresAt: '2099-01-01T00:00:00Z' }])('recusa respostas de sessão inválidas', async value => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(value))))
    const { employeeService } = await import('./employeeService')
    await expect(employeeService.login(testPin)).rejects.toThrow('sessão válida')
  })

  it('consulta pedidos pela rota protegida usando o token no cabeçalho', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('[]'))
    vi.stubGlobal('fetch', fetch)
    const { employeeService } = await import('./employeeService')
    expect(await employeeService.getRequests(token)).toEqual([])
    expect(fetch).toHaveBeenCalledWith('/api/python/funcionarios/solicitacoes', expect.objectContaining({ method: 'GET', headers: { Authorization: `Bearer ${token}` } }))
    expect(fetch.mock.calls[0][0]).not.toContain(token)
  })

  it('encerra a sessão no servidor aceitando HTTP 204', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetch)
    const { employeeService } = await import('./employeeService')
    await expect(employeeService.logout(token)).resolves.toBeUndefined()
    expect(fetch).toHaveBeenCalledWith('/api/python/funcionarios/sessao', expect.objectContaining({ method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }))
  })

  it.each([502, 504])('explica a indisponibilidade do Java sem invalidar a sessão: HTTP %s', async status => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('INTERNAL_SENTINEL', { status })))
    const { employeeService } = await import('./employeeService')
    await expect(employeeService.getRequests(token)).rejects.toMatchObject({ status, message: expect.stringContaining('Seu acesso foi confirmado') })
  })
})
