import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from '@shared/types'
import { authClient } from '@/lib/auth-client'
import { obterPerfil, atualizarPerfil, type AtualizarPerfilInput } from '@/services/perfil'

export type CadastroInput = {
  nome: string
  email: string
  senha: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  perfilCompleto: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastrar: (input: CadastroInput) => Promise<void>
  atualizarUsuario: (dados: AtualizarPerfilInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data: session, isPending } = authClient.useSession()
  const usuarioId = session?.user?.id ?? null
  const autenticado = !!usuarioId

  const { data: perfil, isLoading: perfilLoading } = useQuery({
    queryKey: ['perfil', usuarioId],
    queryFn: obterPerfil,
    enabled: autenticado,
  })

  const login = useCallback(async (email: string, senha: string) => {
    try {
      const { error } = await authClient.signIn.email({ email, password: senha })
      if (error) throw new Error(error.message ?? 'Email ou senha incorretos.')
    } catch (err) {
      if (err instanceof Error) throw err
      throw new Error('Erro ao conectar com o servidor de autenticação.')
    }
  }, [])

  const cadastrar = useCallback(async (input: CadastroInput) => {
    try {
      const { error } = await authClient.signUp.email({
        email: input.email,
        password: input.senha,
        name: input.nome,
      })
      if (error) throw new Error(error.message ?? 'Não foi possível cadastrar.')
    } catch (err) {
      if (err instanceof Error) throw err
      throw new Error('Erro ao conectar com o servidor de autenticação.')
    }
  }, [])

  const atualizarUsuario = useCallback(
    async (dados: AtualizarPerfilInput) => {
      const atualizado = await atualizarPerfil(dados)
      queryClient.setQueryData(['perfil', usuarioId], atualizado)
    },
    [queryClient, usuarioId],
  )

  const logout = useCallback(async () => {
    await authClient.signOut()
    queryClient.clear()
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        user: perfil ?? null,
        isAuthenticated: autenticado,
        isLoading: isPending || (autenticado && perfilLoading),
        perfilCompleto: !!(perfil?.crm && perfil?.especialidade),
        login,
        cadastrar,
        atualizarUsuario,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.')
  }
  return ctx
}
