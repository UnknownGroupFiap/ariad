export type EstadoGravacao =
  | 'idle'
  | 'consent'
  | 'recording'
  | 'processing'
  | 'review'

export type EtapaProcessamento = {
  id: string
  label: string
  status: 'pendente' | 'processando' | 'concluido'
}

export type ResultadoTranscricao = {
  transcricao: string
  sintomasExtraidos: string[]
  evolucaoExtraida: string
}
