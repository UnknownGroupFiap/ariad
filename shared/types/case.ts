export type Sintoma = {
  id: string
  descricao: string
}

export type Hipotese = {
  id: string
  nome: string
  probabilidade: number
  evidencias: string[]
  investigacoes?: Investigacao[]
}

export type Investigacao = {
  id: string
  tipo: 'pergunta' | 'exame'
  descricao: string
}

export type Consulta = {
  id: string
  data: Date
  primeiraConsulta: boolean
  sintomas: string
  evolucao: string
  status?: Caso['status']
  transcricao?: string
}

export type Caso = {
  id: string
  pacienteNome: string
  pacienteIdade: string
  pacienteSexo: 'masculino' | 'feminino' | 'outro'
  pacienteRegiao: string
  pacienteEspecialidade: string
  historicoFamiliar: string
  medicoId: string
  status: 'em_analise' | 'aguardando_exames' | 'finalizado'
  criadoEm: Date
  atualizadoEm: Date
  consultas: Consulta[]
  hipoteses: Hipotese[]
  investigacoes: Investigacao[]
}
