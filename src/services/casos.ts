import type { Caso, Consulta } from '@shared/types'

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Erro ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function listarCasos(medicoId: string): Promise<Caso[]> {
  const casos = await request<CasoSerializado[]>(
    `/api/casos?medicoId=${encodeURIComponent(medicoId)}`,
  )
  return casos.map(reidratar)
}

export async function obterCaso(medicoId: string, id: string): Promise<Caso> {
  const caso = await request<CasoSerializado>(
    `/api/casos/${encodeURIComponent(id)}?medicoId=${encodeURIComponent(medicoId)}`,
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

export async function criarCaso(
  medicoId: string,
  input: NovoCasoInput,
): Promise<Caso> {
  const caso = await request<CasoSerializado>('/api/casos', {
    method: 'POST',
    body: JSON.stringify({
      medicoId,
      ...input,
      data: input.data.toISOString(),
    }),
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
  medicoId: string,
  casoId: string,
  input: ConsultaInput,
  paciente?: Partial<DadosPaciente>,
): Promise<Caso> {
  const caso = await request<CasoSerializado>(
    `/api/casos/${encodeURIComponent(casoId)}/consultas`,
    {
      method: 'POST',
      body: JSON.stringify({
        medicoId,
        ...input,
        data: input.data.toISOString(),
        paciente,
      }),
    },
  )
  return reidratar(caso)
}

export async function salvarTranscricao(
  medicoId: string,
  casoId: string,
  consultaId: string,
  transcricao: string,
): Promise<Caso> {
  const caso = await request<CasoSerializado>(
    `/api/casos/${encodeURIComponent(casoId)}/consultas/${encodeURIComponent(consultaId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ medicoId, transcricao }),
    },
  )
  return reidratar(caso)
}

export async function atualizarCaso(
  medicoId: string,
  casoId: string,
  dados: Partial<Pick<Caso, 'status'>>,
): Promise<Caso> {
  const caso = await request<CasoSerializado>(
    `/api/casos/${encodeURIComponent(casoId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ medicoId, ...dados }),
    },
  )
  return reidratar(caso)
}
