export type TipoIntegracao = 'rnds' | 'tiss' | 'pep' | 'pdf'

export type StatusIntegracao = 'desconectado' | 'conectado'

export type ConfigIntegracao = {
  tipo: TipoIntegracao
  status: StatusIntegracao
  credenciais: Record<string, string>
  conectadoEm?: string
}

export type PacienteImportado = {
  cpf: string
  nome: string
  idade: string
  sexo: 'masculino' | 'feminino' | 'outro'
  regiao: string
  historicoFamiliar: string
  alergias?: string
  medicamentosAtivos?: string[]
}

export type ConectorInfo = {
  tipo: TipoIntegracao
  nome: string
  descricao: string
  icone: string
  requisitos: string
  campos: { name: string; label: string; type: 'text' | 'password' }[]
}
