import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PublicLayout, Input, Button, Card } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/utils/constants'
import { validateEmail, validatePassword } from '@/utils/validators'

type Form = {
  nome: string
  email: string
  senha: string
}

const inicial: Form = { nome: '', email: '', senha: '' }

export default function Cadastro() {
  const [form, setForm] = useState<Form>(inicial)
  const [erros, setErros] = useState<Partial<Record<keyof Form, string>>>({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { cadastrar } = useAuth()
  const navigate = useNavigate()

  const set = (campo: keyof Form, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }))

  const validar = (): boolean => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (!form.nome.trim()) e.nome = 'Informe seu nome completo.'
    if (!validateEmail(form.email)) e.email = 'Email inválido.'
    if (!validatePassword(form.senha)) e.senha = 'Mínimo de 6 caracteres.'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setErroGeral('')
    if (!validar()) return

    setEnviando(true)
    try {
      await cadastrar(form)
      navigate(ROUTES.COMPLETAR_PERFIL, { replace: true })
    } catch (err) {
      setErroGeral(
        err instanceof Error ? err.message : 'Não foi possível cadastrar.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PublicLayout>
      <section className="py-16 px-4 flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl mb-2 text-center">Criar conta</h1>
          <p className="text-center mb-8">
            Depois pediremos seus dados profissionais.
          </p>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome completo"
                value={form.nome}
                error={erros.nome}
                onChange={(e) => set('nome', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={form.email}
                error={erros.email}
                onChange={(e) => set('email', e.target.value)}
              />
              <Input
                label="Senha"
                type="password"
                autoComplete="new-password"
                value={form.senha}
                error={erros.senha}
                onChange={(e) => set('senha', e.target.value)}
              />

              {erroGeral && <p className="text-red-500 text-sm">{erroGeral}</p>}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={enviando}
              >
                {enviando ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm mt-6">
            Já tem conta?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-ariad-blue-medium hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
