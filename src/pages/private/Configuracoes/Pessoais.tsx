import { useState, type FormEvent } from 'react'
import { PrivateLayout, Card, Input, Select, Button } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { UFS, ESPECIALIDADES } from '@/utils/constants'
import { validateCRM } from '@/utils/validators'

export default function Pessoais() {
  const { user, atualizarUsuario } = useAuth()

  const [form, setForm] = useState({
    nome: user?.nome ?? '',
    email: user?.email ?? '',
    crm: user?.crm ?? '',
    uf: user?.uf ?? UFS[0].value,
    especialidade: user?.especialidade ?? ESPECIALIDADES[0].value,
    nomeClinica: user?.nomeClinica ?? '',
  })
  const [erro, setErro] = useState('')
  const [salvo, setSalvo] = useState(false)

  const set = (campo: keyof typeof form, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setSalvo(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!form.nome.trim()) return setErro('Informe seu nome.')
    if (!validateCRM(form.crm)) return setErro('CRM deve ter de 5 a 7 dígitos.')

    try {
      await atualizarUsuario(form)
      setSalvo(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar.')
    }
  }

  return (
    <PrivateLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl ">Configurações pessoais</h1>
          <p>Seus dados profissionais.</p>
        </header>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              readOnly
              disabled
            />
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
              label="Instituição / clínica"
              value={form.nomeClinica}
              onChange={(e) => set('nomeClinica', e.target.value)}
            />

            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            {salvo && (
              <p className="text-ariad-green-water text-sm">
                Alterações salvas.
              </p>
            )}

            <Button type="submit" variant="primary">
              Salvar alterações
            </Button>
          </form>
        </Card>
      </div>
    </PrivateLayout>
  )
}
