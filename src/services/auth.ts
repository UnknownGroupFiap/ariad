import type { User } from '@/types'

const USERS_KEY = 'ariad:users'
const SESSION_KEY = 'ariad:session'

type StoredUser = User & { senha: string }

export type CadastroInput = {
  nome: string
  email: string
  senha: string
  crm: string
  uf: string
  especialidade: string
  nomeClinica: string
}

function lerUsuarios(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function gravarUsuarios(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function semSenha(u: StoredUser): User {
  const { senha: _senha, ...user } = u
  void _senha
  return user
}

export function cadastrar(input: CadastroInput): User {
  const users = lerUsuarios()

  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('Já existe uma conta com este email.')
  }

  const primeiroUsuario = users.length === 0
  const organizacaoId = `org-${Date.now()}`

  const novo: StoredUser = {
    id: `medico-${Date.now()}`,
    nome: input.nome,
    email: input.email,
    senha: input.senha,
    crm: input.crm,
    uf: input.uf,
    especialidade: input.especialidade,
    nomeClinica: input.nomeClinica,
    isAdmin: primeiroUsuario,
    organizacaoId,
  }

  gravarUsuarios([...users, novo])
  localStorage.setItem(SESSION_KEY, novo.id)
  return semSenha(novo)
}

export function login(email: string, senha: string): User {
  const users = lerUsuarios()
  const encontrado = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha,
  )

  if (!encontrado) {
    throw new Error('Email ou senha incorretos.')
  }

  localStorage.setItem(SESSION_KEY, encontrado.id)
  return semSenha(encontrado)
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function usuarioAtual(): User | null {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) return null
  const encontrado = lerUsuarios().find((u) => u.id === id)
  return encontrado ? semSenha(encontrado) : null
}

export function atualizarPerfil(
  id: string,
  dados: Partial<Omit<User, 'id' | 'organizacaoId' | 'isAdmin'>>,
): User {
  const users = lerUsuarios()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('Usuário não encontrado.')

  users[idx] = { ...users[idx], ...dados }
  gravarUsuarios(users)
  return semSenha(users[idx])
}
