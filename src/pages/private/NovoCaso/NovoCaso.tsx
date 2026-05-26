import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PrivateLayout,
  Card,
  Input,
  Select,
  Textarea,
  Button,
} from '@/components'
import BotaoGravacao from '@/components/gravacao/BotaoGravacao'
import { useAuth } from '@/contexts/AuthContext'
import { criarCaso, obterCasoPorCpf, adicionarConsulta } from '@/services/casos'
import {
  buscarPacientePorCpf,
  temIntegracaoAtiva,
} from '@/services/integracoes'
import { CASOS_TEMPLATES } from '@/utils/mockData'
import { ROUTES, ESPECIALIDADES } from '@/utils/constants'
import type { Caso } from '@/types'

const hojeISO = () => new Date().toISOString().slice(0, 10)

type Form = {
  pacienteNome: string
  pacienteCpf: string
  pacienteIdade: string
  pacienteSexo: Caso['pacienteSexo']
  pacienteRegiao: string
  pacienteEspecialidade: string
  historicoFamiliar: string
  evolucao: string
  primeiraConsulta: boolean
  data: string
}

const inicial: Form = {
  pacienteNome: '',
  pacienteCpf: '',
  pacienteIdade: '',
  pacienteSexo: 'masculino',
  pacienteRegiao: '',
  pacienteEspecialidade: ESPECIALIDADES[0].value,
  historicoFamiliar: '',
  evolucao: '',
  primeiraConsulta: true,
  data: hojeISO(),
}

export default function NovoCaso() {
  const [form, setForm] = useState<Form>(inicial)
  const [sintomas, setSintomas] = useState<string[]>([])
  const [sintomaAtual, setSintomaAtual] = useState('')
  const [erro, setErro] = useState('')
  const [dadosImportados, setDadosImportados] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  const set = <K extends keyof Form>(campo: K, valor: Form[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }))

  const cpfJaRegistrado = (cpf: string) =>
    !!user && !!obterCasoPorCpf(user.id, cpf)

  const onCpfChange = (cpf: string) => {
    setForm((f) => ({
      ...f,
      pacienteCpf: cpf,
      primeiraConsulta: !cpfJaRegistrado(cpf),
    }))
    setDadosImportados(false)

    // Auto-fill via integração com prontuário
    if (temIntegracaoAtiva()) {
      const paciente = buscarPacientePorCpf(cpf)
      if (paciente) {
        setForm((f) => ({
          ...f,
          pacienteCpf: cpf,
          pacienteNome: paciente.nome,
          pacienteIdade: paciente.idade,
          pacienteSexo: paciente.sexo,
          pacienteRegiao: paciente.regiao,
          historicoFamiliar: paciente.historicoFamiliar,
          primeiraConsulta: !cpfJaRegistrado(cpf),
        }))
        setDadosImportados(true)
      }
    }
  }

  const adicionarSintoma = () => {
    const valor = sintomaAtual.trim()
    if (!valor) return
    if (!sintomas.includes(valor)) setSintomas((s) => [...s, valor])
    setSintomaAtual('')
  }

  const onSintomaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      adicionarSintoma()
    }
  }

  const removerSintoma = (valor: string) =>
    setSintomas((s) => s.filter((x) => x !== valor))

  const preencherTemplate = (chave: keyof typeof CASOS_TEMPLATES) => {
    const t = CASOS_TEMPLATES[chave]
    setForm((f) => ({
      ...f,
      pacienteNome: t.pacienteNome,
      pacienteCpf: t.pacienteCpf,
      pacienteIdade: t.pacienteIdade,
      pacienteSexo: t.pacienteSexo,
      pacienteRegiao: t.pacienteRegiao,
      pacienteEspecialidade: t.pacienteEspecialidade,
      historicoFamiliar: t.historicoFamiliar,
      evolucao: t.evolucao,
    }))
    setSintomas(t.sintomas.split(',').map((x) => x.trim()))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!user) return
    if (!form.pacienteNome.trim() || !form.pacienteCpf.trim()) {
      setErro('Informe o nome e o CPF do paciente.')
      return
    }
    if (!form.pacienteIdade.trim() || !form.pacienteRegiao.trim()) {
      setErro('Informe a idade e a região do paciente.')
      return
    }
    if (sintomas.length === 0) {
      setErro('Adicione ao menos um sintoma.')
      return
    }

    const sintomasTexto = sintomas.join(', ')
    const existente = obterCasoPorCpf(user.id, form.pacienteCpf)

    if (existente) {
      const atualizado = adicionarConsulta(
        user.id,
        existente.id,
        {
          sintomas: sintomasTexto,
          evolucao: form.evolucao,
          primeiraConsulta: false,
          data: new Date(form.data),
        },
        {
          pacienteNome: form.pacienteNome,
          pacienteIdade: form.pacienteIdade,
          pacienteSexo: form.pacienteSexo,
          pacienteRegiao: form.pacienteRegiao,
          pacienteEspecialidade: form.pacienteEspecialidade,
          historicoFamiliar: form.historicoFamiliar,
        },
      )
      navigate(ROUTES.CASO(atualizado.id))
      return
    }

    const caso = criarCaso(user.id, {
      pacienteNome: form.pacienteNome,
      pacienteCpf: form.pacienteCpf,
      pacienteIdade: form.pacienteIdade,
      pacienteSexo: form.pacienteSexo,
      pacienteRegiao: form.pacienteRegiao,
      pacienteEspecialidade: form.pacienteEspecialidade,
      historicoFamiliar: form.historicoFamiliar,
      sintomas: sintomasTexto,
      evolucao: form.evolucao,
      primeiraConsulta: form.primeiraConsulta,
      data: new Date(form.data),
    })

    navigate(ROUTES.CASO(caso.id))
  }

  return (
    <PrivateLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl ">Novo Caso Clínico</h1>
          <p>
            Preencha os dados do paciente para iniciar a investigação
            diagnóstica
          </p>
        </header>

        <div className="bg-ariad-green-water-light rounded-lg p-4 mb-6 flex gap-3">
          <i className="bi bi-info-circle  text-lg" aria-hidden="true" />
          <p className="text-sm ">
            <strong>Assistente de Investigação Clínica.</strong> Esta ferramenta
            fornece sugestões probabilísticas baseadas nos dados informados. O
            diagnóstico e a conduta final são de exclusiva responsabilidade do
            médico.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm  self-center">Preencher exemplo:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => preencherTemplate('parkinson')}
          >
            Parkinson
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => preencherTemplate('guillain')}
          >
            Guillain-Barré
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h2 className="text-xl  mb-4">Dados do Paciente</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome do paciente"
                  placeholder="Ex.: Maria Souza"
                  value={form.pacienteNome}
                  onChange={(e) => set('pacienteNome', e.target.value)}
                />
                <div>
                  <Input
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={form.pacienteCpf}
                    onChange={(e) => onCpfChange(e.target.value)}
                  />
                  {cpfJaRegistrado(form.pacienteCpf) && (
                    <p className="text-xs  mt-1">
                      CPF já registrado. Este caso será adicionado como nova
                      consulta do paciente.
                    </p>
                  )}
                </div>
              </div>
              {dadosImportados && (
                <div className="bg-ariad-green-water-light rounded-lg p-3 flex gap-2 text-sm">
                  <i
                    className="bi bi-plug text-ariad-green-water"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Dados importados do prontuário eletrônico.</strong>{' '}
                    Verifique e ajuste se necessário.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Idade"
                  placeholder="Ex.: 7 anos"
                  value={form.pacienteIdade}
                  onChange={(e) => set('pacienteIdade', e.target.value)}
                />
                <Select
                  label="Sexo"
                  options={[
                    { value: 'masculino', label: 'Masculino' },
                    { value: 'feminino', label: 'Feminino' },
                    { value: 'outro', label: 'Outro' },
                  ]}
                  value={form.pacienteSexo}
                  onChange={(e) =>
                    set('pacienteSexo', e.target.value as Form['pacienteSexo'])
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Região (cidade, UF)"
                  placeholder="Ex.: São Paulo, SP"
                  value={form.pacienteRegiao}
                  onChange={(e) => set('pacienteRegiao', e.target.value)}
                />
                <Select
                  label="Especialidade médica"
                  options={ESPECIALIDADES}
                  value={form.pacienteEspecialidade}
                  onChange={(e) => set('pacienteEspecialidade', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl  mb-4">Dados Clínicos</h2>
            <div className="space-y-4">
              <div className="bg-ariad-beige-light rounded-lg p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <i
                    className="bi bi-mic-fill text-ariad-green-water"
                    aria-hidden="true"
                  />
                  <span>
                    Grave a consulta para preencher sintomas e evolução
                    automaticamente.
                  </span>
                </div>
                <BotaoGravacao
                  sintomas={sintomas.join(', ')}
                  evolucao={form.evolucao}
                  onSalvar={(dados) => {
                    setSintomas(dados.sintomas)
                    set('evolucao', dados.evolucao)
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="sintoma"
                  className="block text-sm font-medium  mb-1"
                >
                  Sintomas apresentados
                </label>
                <div className="flex gap-2">
                  <input
                    id="sintoma"
                    type="text"
                    placeholder="Digite um sintoma e pressione Enter"
                    value={sintomaAtual}
                    onChange={(e) => setSintomaAtual(e.target.value)}
                    onKeyDown={onSintomaKeyDown}
                    className="flex-1 px-4 py-2.5 bg-white border border-ariad-beige-dark rounded-lg  placeholder:/40 focus:outline-none focus:ring-2 focus:ring-ariad-green-water"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={adicionarSintoma}
                  >
                    <i className="bi bi-plus-lg mr-1" aria-hidden="true" />
                    Adicionar
                  </Button>
                </div>
                {sintomas.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-3">
                    {sintomas.map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-ariad-green-water-light "
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removerSintoma(s)}
                          aria-label={`Remover ${s}`}
                          className="hover:text-red-500"
                        >
                          <i className="bi bi-x" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Textarea
                label="Evolução do quadro"
                rows={4}
                placeholder="Descreva como os sintomas evoluíram ao longo do tempo..."
                value={form.evolucao}
                onChange={(e) => set('evolucao', e.target.value)}
              />

              <Textarea
                label="Histórico familiar"
                rows={3}
                placeholder="Histórico de doenças na família, consanguinidade, etc..."
                value={form.historicoFamiliar}
                onChange={(e) => set('historicoFamiliar', e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <Input
                  label="Data do atendimento"
                  type="date"
                  value={form.data}
                  onChange={(e) => set('data', e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm  pb-2.5">
                  <input
                    type="checkbox"
                    checked={form.primeiraConsulta}
                    onChange={(e) => set('primeiraConsulta', e.target.checked)}
                    className="accent-ariad-green-water"
                  />
                  Primeira consulta
                </label>
              </div>
            </div>
          </Card>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              <i className="bi bi-stars mr-2" aria-hidden="true" />
              Iniciar análise
            </Button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  )
}
