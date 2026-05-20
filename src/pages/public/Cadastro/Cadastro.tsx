import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PublicLayout, Input, Select, Button, Card } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, UFS, ESPECIALIDADES } from '@/utils/constants'
import {
  validateEmail,
  validateCRM,
  validatePassword,
} from '@/utils/validators'

type Form = {
  nome: string
  email: string
  senha: string
  crm: string
  uf: string
  especialidade: string
  nomeClinica: string
}

const inicial: Form = {
  nome: '',
  email: '',
  senha: '',
  crm: '',
  uf: UFS[0].value,
  especialidade: ESPECIALIDADES[0].value,
  nomeClinica: '',
}

export default function Cadastro() {
  const [form, setForm] = useState<Form>(inicial)
  const [erros, setErros] = useState<Partial<Record<keyof Form, string>>>({})
  const [erroGeral, setErroGeral] = useState('')

  const { cadastrar, isLoading } = useAuth()
  const navigate = useNavigate()

  const set = (campo: keyof Form, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }))

  const validar = (): boolean => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (!form.nome.trim()) e.nome = 'Informe seu nome completo.'
    if (!validateEmail(form.email)) e.email = 'Email inválido.'
    if (!validatePassword(form.senha)) e.senha = 'Mínimo de 6 caracteres.'
    if (!validateCRM(form.crm)) e.crm = 'CRM deve ter de 5 a 7 dígitos.'
    if (!form.nomeClinica.trim())
      e.nomeClinica = 'Informe a clínica ou organização.'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setErroGeral('')
    if (!validar()) return

    try {
      await cadastrar(form)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setErroGeral(
        err instanceof Error ? err.message : 'Não foi possível cadastrar.',
      )
    }
  }

  return (
    <PublicLayout>
      <section className="py-16 px-4 flex justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl mb-8 text-center">Criar conta</h1>

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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CRM"
                  value={form.crm}
                  error={erros.crm}
                  onChange={(e) =>
                    set('crm', e.target.value.replace(/\D/g, ''))
                  }
                />
                <Select
                  label="UF do CRM"
                  options={UFS}
                  value={form.uf}
                  onChange={(e) => set('uf', e.target.value)}
                />
              </div>
              <Select
                label="Especialidade"
                options={ESPECIALIDADES}
                value={form.especialidade}
                onChange={(e) => set('especialidade', e.target.value)}
              />
              <Input
                label="Clínica / organização"
                value={form.nomeClinica}
                error={erros.nomeClinica}
                onChange={(e) => set('nomeClinica', e.target.value)}
              />

              {erroGeral && <p className="text-red-500 text-sm">{erroGeral}</p>}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
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
