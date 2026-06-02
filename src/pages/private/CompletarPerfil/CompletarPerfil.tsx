import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PublicLayout, Card, Input, Select, Button } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { UFS, ESPECIALIDADES, ROUTES } from '@/utils/constants'
import { validateCRM } from '@/utils/validators'

export default function CompletarPerfil() {
  const { user, atualizarUsuario } = useAuth()
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

  return (
    <PublicLayout>
      <section className="py-20 px-4 flex justify-center">
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
      </section>
    </PublicLayout>
  )
}
