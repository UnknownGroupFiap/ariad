import type { User } from '@shared/types'
import { apiRequest } from './http'

export type AtualizarPerfilInput = {
  nome?: string
  crm: string
  uf: string
  especialidade: string
  nomeClinica?: string
}

export function obterPerfil(): Promise<User> {
  return apiRequest<User>('/api/perfil')
}

export function atualizarPerfil(dados: AtualizarPerfilInput): Promise<User> {
  return apiRequest<User>('/api/perfil', {
    method: 'PUT',
    body: JSON.stringify(dados),
  })
}
