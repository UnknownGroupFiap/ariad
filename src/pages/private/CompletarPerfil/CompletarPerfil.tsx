import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Input, Select, Button } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { UFS, ESPECIALIDADES, ROUTES } from '@/utils/constants'
import { validateCRM } from '@/utils/validators'
import logo from '@/assets/logo.svg'

export default function CompletarPerfil() {
  const { user, atualizarUsuario, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    crm: user?.crm ?? '',
    uf: user?.uf || UFS[0].value,
    especialidade: user?.especialidade || ESPECIALIDADES[0].value,
    nomeClinica: user?.nomeClinica ?? '',
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const set = (campo: keyof typeof form, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!validateCRM(form.crm)) return setErro('CRM deve ter de 5 a 7 dígitos.')
    if (!form.especialidade) return setErro('Selecione sua especialidade.')

    setSalvando(true)
    try {
      await atualizarUsuario(form)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSalvando(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen flex flex-col bg-ariad-beige-light">
      <header className="border-b border-ariad-green-water">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img src={logo} alt="Ariad" className="w-8 h-8" />
            <span className="text-lg font-semibold">Ariad</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-md hover:bg-ariad-green-water-light transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl mb-2 text-center">Complete seu perfil</h1>
          <p className="text-center mb-8">
            Precisamos dos seus dados profissionais para liberar o painel.
          </p>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Número do CRM"
                  value={form.crm}
                  onChange={(e) => set('crm', e.target.value.replace(/\D/g, ''))}
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
                label="Instituição / clínica (opcional)"
                value={form.nomeClinica}
                onChange={(e) => set('nomeClinica', e.target.value)}
              />

              {erro && <p className="text-red-500 text-sm">{erro}</p>}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Concluir cadastro'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
