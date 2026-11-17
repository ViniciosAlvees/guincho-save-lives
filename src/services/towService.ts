import type { NewRequest, Professional, Proposal, TowRequest } from '../types'
import { ApiError, apiRequest } from './apiClient'

// Provider demonstrativo. O contrato Java abaixo não inventa dados ausentes.
export interface TowService {
  getProfessionals(): Promise<Professional[]>
  getRequests(): Promise<TowRequest[]>
  createRequest(data: NewRequest): Promise<TowRequest>
  updateRequest(id: string, data: Partial<TowRequest>): Promise<TowRequest>
  createProposal(requestId: string, data: Pick<Proposal, 'amount' | 'note' | 'professionalId'>): Promise<Proposal>
  updateProposal(requestId: string, proposalId: string, data: Partial<Proposal>): Promise<Proposal>
  updateProfessional(id: string, data: Partial<Professional>): Promise<Professional>
}

export interface ApiProfessionalInput { name: string; region: string; city: string; towType: string; price: number }
export interface ApiProfessional extends ApiProfessionalInput { id: string | null }
export interface ApiRequestInput { clientName: string; origin: string; destination: string; vehicle: string; problem: string; cep?: string | null }
export interface ApiTowRequest extends ApiRequestInput { id: string | null }

type JsonObject = Record<string, unknown>
function object(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('A API retornou um registro em formato inesperado.')
  return value as JsonObject
}
function field(data: JsonObject, key: string, alias: string): string {
  const value = data[key] ?? data[alias]
  if (typeof value !== 'string' || !value.trim()) throw new Error('A API retornou um registro em formato inesperado.')
  return value
}
function identifier(data: JsonObject, requireId: boolean): string | null {
  const id = data.id
  if (typeof id === 'string' && id.trim()) return id
  if (typeof id === 'number' && Number.isSafeInteger(id) && id > 0) return String(id)
  if (!requireId && id == null) return null
  throw new Error('A API retornou um identificador em formato inesperado.')
}
function professional(value: unknown, requireId = true): ApiProfessional {
  const data = object(value)
  const price = data.price ?? data.preco
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) throw new Error('A API retornou um preço em formato inesperado.')
  return { id: identifier(data, requireId), name: field(data, 'name', 'nome'), region: field(data, 'region', 'regiao'), city: field(data, 'city', 'cidade'), towType: field(data, 'towType', 'tipoGuincho'), price }
}
function towRequest(value: unknown, requireId = true): ApiTowRequest {
  const data = object(value)
  if (data.cep != null && typeof data.cep !== 'string') throw new Error('A API retornou um CEP em formato inesperado.')
  return { id: identifier(data, requireId), clientName: field(data, 'clientName', 'nomeCliente'), origin: field(data, 'origin', 'origem'), destination: field(data, 'destination', 'destino'), vehicle: field(data, 'vehicle', 'veiculo'), problem: field(data, 'problem', 'problema'), cep: data.cep as string | null | undefined }
}
function list<T>(value: unknown, parse: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) throw new Error('A API retornou uma lista em formato inesperado.')
  return value.map(item => parse(item))
}
async function create<T>(path: string, data: unknown, parse: (item: unknown, requireId: boolean) => T): Promise<T> {
  const result = await apiRequest(path, data)
  try { return parse(result, false) }
  catch { throw new ApiError('A resposta não confirma os dados do registro. Confira antes de reenviar para evitar duplicidade.', true) }
}

// Rotas verificadas nos dois controllers do repositório Java.
export function parseApiRequests(value: unknown): ApiTowRequest[] { return list(value, towRequest) }

export const apiService = {
  getProfessionals: async (): Promise<ApiProfessional[]> => list(await apiRequest('/guincheiros'), professional),
  getRequests: async (): Promise<ApiTowRequest[]> => parseApiRequests(await apiRequest('/solicitacoes')),
  createProfessional: (data: ApiProfessionalInput): Promise<ApiProfessional> => create('/guincheiros', {
    name: data.name.trim(), region: data.region.trim(), city: data.city.trim(), towType: data.towType.trim(), price: data.price,
  }, professional),
  createRequest: (data: ApiRequestInput): Promise<ApiTowRequest> => create('/solicitacoes', {
    clientName: data.clientName.trim(), origin: data.origin.trim(), destination: data.destination.trim(), vehicle: data.vehicle.trim(), problem: data.problem.trim(), cep: data.cep?.replace(/\D/g, '') || null,
  }, towRequest),
}

export const isApiMode = import.meta.env.VITE_APP_MODE !== 'demo'
