import type { Caso, Consulta } from '@/types'
import { CASOS_DEMO } from '@/utils/mockData'
import { gerarDiagnostico } from './diagnostico'

const CASOS_KEY = 'ariad:casos'

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

function lerTodos(): Caso[] {
  try {
    const raw: CasoSerializado[] = JSON.parse(
      localStorage.getItem(CASOS_KEY) ?? '[]',
    )
    return raw.map(reidratar)
  } catch {
    return []
  }
}

function gravarTodos(casos: Caso[]): void {
  localStorage.setItem(CASOS_KEY, JSON.stringify(casos))
}

function clonarMock(mock: Caso, medicoId: string): Caso {
  const sufixo = medicoId.slice(-6)
  return {
    ...mock,
    id: `${mock.id}-${sufixo}`,
    medicoId,
    consultas: mock.consultas.map((c) => ({ ...c })),
    hipoteses: mock.hipoteses.map((h) => ({ ...h })),
    investigacoes: mock.investigacoes.map((i) => ({ ...i })),
  }
}

function garantirSeed(medicoId: string): Caso[] {
  const todos = lerTodos()
  if (todos.some((c) => c.medicoId === medicoId)) return todos

  const seeds = CASOS_DEMO.map((m) => clonarMock(m, medicoId))
  const atualizado = [...seeds, ...todos]
  gravarTodos(atualizado)
  return atualizado
}

export function listarCasos(medicoId: string): Caso[] {
  return garantirSeed(medicoId)
    .filter((c) => c.medicoId === medicoId)
    .sort((a, b) => b.atualizadoEm.getTime() - a.atualizadoEm.getTime())
}

export function obterCaso(medicoId: string, id: string): Caso | undefined {
  return garantirSeed(medicoId).find(
    (c) => c.id === id && c.medicoId === medicoId,
  )
}

export function obterCasoPorCpf(
  medicoId: string,
  cpf: string,
): Caso | undefined {
  const alvo = cpf.trim()
  if (!alvo) return undefined
  return listarCasos(medicoId).find((c) => c.pacienteCpf === alvo)
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

export function criarCaso(medicoId: string, input: NovoCasoInput): Caso {
  const todos = garantirSeed(medicoId)
  const { hipoteses, investigacoes } = gerarDiagnostico(
    input.sintomas,
    input.evolucao,
  )

  const agora = new Date()
  const caso: Caso = {
    id: `caso-${Date.now()}`,
    pacienteNome: input.pacienteNome,
    pacienteCpf: input.pacienteCpf,
    pacienteIdade: input.pacienteIdade,
    pacienteSexo: input.pacienteSexo,
    pacienteRegiao: input.pacienteRegiao,
    pacienteEspecialidade: input.pacienteEspecialidade,
    historicoFamiliar: input.historicoFamiliar,
    medicoId,
    status: 'em_analise',
    criadoEm: agora,
    atualizadoEm: agora,
    consultas: [
      {
        id: `consulta-${Date.now()}`,
        data: input.data,
        primeiraConsulta: input.primeiraConsulta,
        sintomas: input.sintomas,
        evolucao: input.evolucao,
        status: 'em_analise',
      },
    ],
    hipoteses,
    investigacoes,
  }

  gravarTodos([caso, ...todos])
  return caso
}

export type ConsultaInput = {
  sintomas: string
  evolucao: string
  primeiraConsulta: boolean
  data: Date
}

export function adicionarConsulta(
  medicoId: string,
  casoId: string,
  input: ConsultaInput,
  paciente?: Partial<DadosPaciente>,
): Caso {
  const todos = garantirSeed(medicoId)
  const idx = todos.findIndex((c) => c.id === casoId && c.medicoId === medicoId)
  if (idx === -1) throw new Error('Caso não encontrado.')

  const anterior = todos[idx]
  const { hipoteses, investigacoes } = gerarDiagnostico(
    input.sintomas,
    input.evolucao,
  )

  const atualizado: Caso = {
    ...anterior,
    pacienteNome: paciente?.pacienteNome ?? anterior.pacienteNome,
    pacienteIdade: paciente?.pacienteIdade ?? anterior.pacienteIdade,
    pacienteSexo: paciente?.pacienteSexo ?? anterior.pacienteSexo,
    pacienteRegiao: paciente?.pacienteRegiao ?? anterior.pacienteRegiao,
    pacienteEspecialidade:
      paciente?.pacienteEspecialidade ?? anterior.pacienteEspecialidade,
    historicoFamiliar:
      paciente?.historicoFamiliar ?? anterior.historicoFamiliar,
    atualizadoEm: new Date(),
    consultas: [
      ...anterior.consultas,
      {
        id: `consulta-${Date.now()}`,
        data: input.data,
        primeiraConsulta: input.primeiraConsulta,
        sintomas: input.sintomas,
        evolucao: input.evolucao,
        status: anterior.status,
      },
    ],
    hipoteses,
    investigacoes,
  }

  todos[idx] = atualizado
  gravarTodos(todos)
  return atualizado
}

export function salvarTranscricao(
  medicoId: string,
  casoId: string,
  consultaId: string,
  transcricao: string,
): Caso {
  const todos = garantirSeed(medicoId)
  const idx = todos.findIndex((c) => c.id === casoId && c.medicoId === medicoId)
  if (idx === -1) throw new Error('Caso não encontrado.')

  const caso = todos[idx]
  const consultas = caso.consultas.map((c) =>
    c.id === consultaId ? { ...c, transcricao } : c,
  )
  todos[idx] = { ...caso, consultas, atualizadoEm: new Date() }
  gravarTodos(todos)
  return todos[idx]
}

export function atualizarCaso(
  medicoId: string,
  casoId: string,
  dados: Partial<Pick<Caso, 'status'>>,
): Caso {
  const todos = garantirSeed(medicoId)
  const idx = todos.findIndex((c) => c.id === casoId && c.medicoId === medicoId)
  if (idx === -1) throw new Error('Caso não encontrado.')

  todos[idx] = { ...todos[idx], ...dados, atualizadoEm: new Date() }
  gravarTodos(todos)
  return todos[idx]
}
