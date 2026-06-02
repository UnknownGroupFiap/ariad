import type { Caso, Consulta } from '@shared/types'
import { apiRequest } from './http'

type CasoSerializado = Omit<Caso, 'criadoEm' | 'atualizadoEm' | 'consultas'> & {
  criadoEm: string
  atualizadoEm: string
  consultas: (Omit<Consulta, 'data'> & { data: string })[]
}

function reidratar(c: CasoSerializado): Caso {
  return {
    ...c,
    criadoEm: new Date(c.criadoEm),
    atualizadoEm: new Date(c.atualizadoEm),
    consultas: c.consultas.map((co) => ({ ...co, data: new Date(co.data) })),
  }
}

export async function listarCasos(): Promise<Caso[]> {
  const casos = await apiRequest<CasoSerializado[]>('/api/casos')
  return casos.map(reidratar)
}

export async function buscarCasoPorCpf(cpf: string): Promise<Caso[]> {
  const casos = await apiRequest<CasoSerializado[]>(
    `/api/casos?cpf=${encodeURIComponent(cpf)}`,
  )
  return casos.map(reidratar)
}

export async function obterCaso(id: string): Promise<Caso> {
  const caso = await apiRequest<CasoSerializado>(
    `/api/casos/${encodeURIComponent(id)}`,
  )
  return reidratar(caso)
}

export type DadosPaciente = {
  pacienteNome: string
  pacienteCpf: string
  pacienteIdade: string
  pacienteSexo: Caso['pacienteSexo']
  pacienteRegiao: string
  pacienteEspecialidade: string
  historicoFamiliar: string
}

export type NovoCasoInput = DadosPaciente & {
  sintomas: string
  evolucao: string
  primeiraConsulta: boolean
  data: Date
}

export async function criarCaso(input: NovoCasoInput): Promise<Caso> {
  const caso = await apiRequest<CasoSerializado>('/api/casos', {
    method: 'POST',
    body: JSON.stringify({ ...input, data: input.data.toISOString() }),
  })
  return reidratar(caso)
}

export type ConsultaInput = {
  sintomas: string
  evolucao: string
  primeiraConsulta: boolean
  data: Date
}

export async function adicionarConsulta(
  casoId: string,
  input: ConsultaInput,
  paciente?: Partial<DadosPaciente>,
): Promise<Caso> {
  const caso = await apiRequest<CasoSerializado>(
    `/api/casos/${encodeURIComponent(casoId)}/consultas`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...input,
        data: input.data.toISOString(),
        paciente,
      }),
    },
  )
  return reidratar(caso)
}

export async function salvarTranscricao(
  casoId: string,
  consultaId: string,
  transcricao: string,
): Promise<Caso> {
  const caso = await apiRequest<CasoSerializado>(
    `/api/casos/${encodeURIComponent(casoId)}/consultas/${encodeURIComponent(consultaId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ transcricao }),
    },
  )
  return reidratar(caso)
}

export async function atualizarCaso(
  casoId: string,
  dados: Partial<Pick<Caso, 'status'>>,
): Promise<Caso> {
  const caso = await apiRequest<CasoSerializado>(
    `/api/casos/${encodeURIComponent(casoId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(dados),
    },
  )
  return reidratar(caso)
}
