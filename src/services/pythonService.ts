import { pythonRequest } from './apiClient'

export interface EstimateInput {
  basePrice: number
  distanceKm: number
  vehicle: 'carro' | 'moto' | 'utilitario'
  night: boolean
}

export interface PriceEstimate { amount: number; currency: 'BRL' }

export const pythonService = {
  async estimatePrice(input: EstimateInput, signal?: AbortSignal): Promise<PriceEstimate> {
    if (!Number.isFinite(input.basePrice) || input.basePrice < 20 || input.basePrice > 10000
      || !Number.isFinite(input.distanceKm) || input.distanceKm <= 0 || input.distanceKm > 1000
      || !['carro', 'moto', 'utilitario'].includes(input.vehicle) || typeof input.night !== 'boolean') {
      throw new Error('Informe preço base entre R$ 20 e R$ 10.000, distância maior que zero e até 1.000 km e um veículo disponível.')
    }
    const query = new URLSearchParams({
      preco_base: String(input.basePrice), km: String(input.distanceKm), tipo: input.vehicle, noturno: String(input.night),
    })
    const result = await pythonRequest(`/estimativa?${query}`, signal)
    if (!result || typeof result !== 'object' || !('valor_estimado' in result) || !('moeda' in result)
      || typeof result.valor_estimado !== 'number' || !Number.isFinite(result.valor_estimado)
      || result.valor_estimado < 0 || result.moeda !== 'BRL') {
      throw new Error('A API Python retornou uma estimativa em formato inesperado.')
    }
    return { amount: result.valor_estimado, currency: result.moeda }
  },
}
