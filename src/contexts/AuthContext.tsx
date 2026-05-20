import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import * as authService from '@/services/auth'
import type { CadastroInput } from '@/services/auth'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastrar: (input: CadastroInput) => Promise<void>
  logout: () => void
  atualizarUsuario: (
    dados: Partial<Omit<User, 'id' | 'organizacaoId' | 'isAdmin'>>,
  ) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    authService.usuarioAtual(),
  )
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true)
    try {
      setUser(authService.login(email, senha))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cadastrar = useCallback(async (input: CadastroInput) => {
    setIsLoading(true)
    try {
      setUser(authService.cadastrar(input))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const atualizarUsuario = useCallback(
    (dados: Partial<Omit<User, 'id' | 'organizacaoId' | 'isAdmin'>>) => {
      setUser((atual) =>
        atual ? authService.atualizarPerfil(atual.id, dados) : atual,
      )
    },
    [],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        cadastrar,
        logout,
        atualizarUsuario,
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
