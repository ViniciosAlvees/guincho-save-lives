import { ApiError, employeeRequest } from './apiClient'
import { parseApiRequests } from './towService'

export interface EmployeeSession { token: string; expiresAt: string }

export const employeeService = {
  async login(pin: string): Promise<EmployeeSession> {
    if (!/^\d{8}$/.test(pin)) throw new ApiError('Informe o PIN de oito dígitos.')
    let value: unknown
    try { value = await employeeRequest('/funcionarios/sessao', { pin }, { uncertainWrite: false }) }
    catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) throw new ApiError('PIN inválido ou acesso não autorizado.', false, 401)
        if (error.status === 429) throw new ApiError('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.', false, 429)
        if (error.status === 503) throw new ApiError('O acesso de funcionários está temporariamente indisponível. Tente novamente em instantes.', false, 503)
        if (error.status === 404 || error.status === 405) throw new ApiError('O acesso de funcionários ainda precisa ser habilitado no servidor da equipe.', false, error.status)
      }
      throw error
    }
    if (!value || typeof value !== 'object') throw new ApiError('O servidor não confirmou uma sessão válida.')
    const session = value as Record<string, unknown>
    if (typeof session.token !== 'string' || !/^[A-Za-z0-9_-]{32,256}$/.test(session.token)
      || typeof session.expiresAt !== 'string' || !Number.isFinite(Date.parse(session.expiresAt)) || Date.parse(session.expiresAt) <= Date.now()) {
      throw new ApiError('O servidor não confirmou uma sessão válida.')
    }
    return { token: session.token, expiresAt: session.expiresAt }
  },
  async getRequests(token: string) {
    try {
      return parseApiRequests(await employeeRequest('/funcionarios/solicitacoes', undefined, { token }))
    } catch (error) {
      if (error instanceof ApiError && (error.status === 502 || error.status === 504)) {
        throw new ApiError('Seu acesso foi confirmado, mas o servidor de pedidos está indisponível. Tente consultar novamente em instantes.', false, error.status)
      }
      throw error
    }
  },
  async logout(token: string): Promise<void> {
    await employeeRequest('/funcionarios/sessao', undefined, { method: 'DELETE', token, uncertainWrite: false, emptyResponse: true })
  },
}
