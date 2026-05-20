export type User = {
  id: string
  nome: string
  email: string
  crm: string
  especialidade: string
  uf: string
  nomeClinica: string
  isAdmin: boolean
  organizacaoId: string
}

export type Organizacao = {
  id: string
  nome: string
  adminId: string
}
