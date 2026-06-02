import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PublicLayout, Input, Button, Card } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'

type LocationState = { from?: { pathname: string } }

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino =
    (location.state as LocationState | null)?.from?.pathname ?? ROUTES.DASHBOARD

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await login(email, senha)
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PublicLayout>
      <section className="py-20 px-4 flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl mb-2 text-center">Entrar no Ariad</h1>
          <p className="text-center mb-8">Acesse seu painel clínico.</p>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {erro && <p className="text-red-500 text-sm">{erro}</p>}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={enviando}
              >
                {enviando ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm mt-6">
            Ainda não tem conta?{' '}
            <Link
              to={ROUTES.CADASTRO}
              className="text-ariad-blue-medium hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
