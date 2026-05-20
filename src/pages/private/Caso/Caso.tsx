import { useState, useRef, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PrivateLayout, Card, Button, Textarea } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { obterCaso, atualizarCaso, adicionarConsulta } from '@/services/casos'
import { ROUTES, STATUS_CASO, ESPECIALIDADES } from '@/utils/constants'
import type { Caso as CasoType } from '@/types'

function formatarData(d: Date): string {
  return d.toLocaleDateString('pt-BR')
}

const sexoLabel: Record<CasoType['pacienteSexo'], string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  outro: 'Outro',
}

const especialidadeLabel = (valor: string) =>
  ESPECIALIDADES.find((e) => e.value === valor)?.label ?? valor

export default function Caso() {
  const { id = '' } = useParams()
  const { user } = useAuth()

  const [caso, setCaso] = useState<CasoType | undefined>(() =>
    user ? obterCaso(user.id, id) : undefined,
  )
  const [consultaAberta, setConsultaAberta] = useState<string | null>(null)
  const [novaConsulta, setNovaConsulta] = useState({
    sintomas: '',
    evolucao: '',
  })
  const [formAberto, setFormAberto] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!user || !caso) {
    return (
      <PrivateLayout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-2xl  mb-4">Caso não encontrado</h1>
          <Link to={ROUTES.CASOS}>
            <Button variant="primary">Voltar para casos</Button>
          </Link>
        </div>
      </PrivateLayout>
    )
  }

  const hipotesesOrdenadas = [...caso.hipoteses].sort(
    (a, b) => b.probabilidade - a.probabilidade,
  )
  const ultimaConsulta = caso.consultas[caso.consultas.length - 1]
  const especialidadeMedico = especialidadeLabel(user.especialidade)
  const investigacoes = caso.investigacoes ?? []
  const perguntas = investigacoes.filter((i) => i.tipo === 'pergunta')
  const exames = investigacoes.filter((i) => i.tipo === 'exame')

  const handleStatus = (status: CasoType['status']) =>
    setCaso(atualizarCaso(user.id, caso.id, { status }))

  const handleNovaConsulta = (e: FormEvent) => {
    e.preventDefault()
    if (!novaConsulta.sintomas.trim()) return
    const atualizado = adicionarConsulta(user.id, caso.id, {
      sintomas: novaConsulta.sintomas,
      evolucao: novaConsulta.evolucao,
      primeiraConsulta: false,
      data: new Date(),
    })
    setCaso(atualizado)
    setNovaConsulta({ sintomas: '', evolucao: '' })
    setFormAberto(false)
  }

  const compartilhar = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
    setToast('Link do caso copiado.')
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3000)
  }

  return (
    <PrivateLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          to={ROUTES.CASOS}
          className="text-sm  hover:text-ariad-green-water inline-flex items-center gap-1"
        >
          <i className="bi bi-arrow-left" aria-hidden="true" /> Voltar para
          casos
        </Link>

        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl ">{caso.pacienteNome}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_CASO[caso.status].pastel
                  }`}
                >
                  {STATUS_CASO[caso.status].label}
                </span>
              </div>
              <p className="text-sm  mt-1">
                CPF {caso.pacienteCpf} · {caso.pacienteIdade} ·{' '}
                {sexoLabel[caso.pacienteSexo]} · {caso.pacienteRegiao} ·{' '}
                {especialidadeLabel(caso.pacienteEspecialidade)}
              </p>
              <p className="text-sm  mt-1">
                Registrado em {formatarData(caso.criadoEm)} · Última consulta em{' '}
                {formatarData(ultimaConsulta.data)}
              </p>
            </div>
            <button
              onClick={compartilhar}
              className="self-start inline-flex items-center gap-2 text-sm  hover:text-ariad-green-water"
            >
              <i className="bi bi-share" aria-hidden="true" />
              Compartilhar
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-4 mt-4 pt-4 border-t border-ariad-green-water">
            <label className="text-xs ">
              Status
              <select
                value={caso.status}
                onChange={(e) =>
                  handleStatus(e.target.value as CasoType['status'])
                }
                className={`block mt-1 px-3 py-1.5 rounded-lg text-sm border ${
                  STATUS_CASO[caso.status].select
                }`}
              >
                {Object.entries(STATUS_CASO).map(([v, { label }]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div className="ml-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFormAberto((v) => !v)}
              >
                {formAberto ? 'Cancelar' : 'Nova consulta'}
              </Button>
            </div>
          </div>

          {formAberto && (
            <form
              onSubmit={handleNovaConsulta}
              className="space-y-3 mt-4 pt-4 border-t border-ariad-green-water"
            >
              <Textarea
                label="Sintomas / achados"
                rows={2}
                value={novaConsulta.sintomas}
                onChange={(e) =>
                  setNovaConsulta((c) => ({
                    ...c,
                    sintomas: e.target.value,
                  }))
                }
              />
              <Textarea
                label="Evolução"
                rows={3}
                value={novaConsulta.evolucao}
                onChange={(e) =>
                  setNovaConsulta((c) => ({
                    ...c,
                    evolucao: e.target.value,
                  }))
                }
              />
              <Button type="submit" variant="secondary" size="sm">
                Registrar e reavaliar hipóteses
              </Button>
            </form>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="flex items-center gap-2 text-lg  mb-3">
              <i
                className="bi bi-clipboard2-pulse text-ariad-green-water"
                aria-hidden="true"
              />
              Sintomas apresentados
            </h2>
            <ul className="space-y-1">
              {ultimaConsulta.sintomas
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm ">
                    <i
                      className="bi bi-check-circle text-ariad-green-water"
                      aria-hidden="true"
                    />
                    {s}
                  </li>
                ))}
            </ul>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 text-lg  mb-3">
              <i
                className="bi bi-graph-up-arrow text-ariad-green-water"
                aria-hidden="true"
              />
              Evolução do quadro
            </h2>
            <p className="text-sm ">
              {ultimaConsulta.evolucao || 'Sem evolução registrada.'}
            </p>
          </Card>
        </div>

        <Card>
          <h2 className="flex items-center gap-2 text-lg  mb-3">
            <i
              className="bi bi-people text-ariad-green-water"
              aria-hidden="true"
            />
            Histórico familiar
          </h2>
          <p className="text-sm ">
            {caso.historicoFamiliar || 'Sem histórico familiar registrado.'}
          </p>
        </Card>

        <section>
          <h2 className="text-2xl  mb-1">Hipóteses diagnósticas</h2>
          <p className=" mb-4">
            Baseadas em análise probabilística dos dados clínicos fornecidos
          </p>
          <div className="space-y-4">
            {hipotesesOrdenadas.map((h) => (
              <div
                key={h.id}
                className="bg-ariad-beige-light rounded-lg shadow-sm p-6 border-l-4 border-ariad-green-water"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold ">{h.nome}</h3>
                  {h.probabilidade > 0 && (
                    <div className="text-center shrink-0 px-3 py-1.5 rounded-lg bg-ariad-green-water">
                      <div className="text-base font-semibold ">
                        {h.probabilidade}%
                      </div>
                      <div className="text-xs ">plausibilidade</div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium  mb-2">
                      <i
                        className="bi bi-check-circle text-ariad-green-water"
                        aria-hidden="true"
                      />
                      Evidências suportivas
                    </p>
                    <ul className="space-y-1">
                      {h.evidencias.map((ev, i) => (
                        <li key={i} className="text-sm  flex gap-2">
                          <span aria-hidden="true">•</span>
                          {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {h.investigacoes && h.investigacoes.length > 0 && (
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium  mb-2">
                        <i
                          className="bi bi-clipboard2-pulse text-ariad-green-water"
                          aria-hidden="true"
                        />
                        Investigações sugeridas
                      </p>
                      <ul className="space-y-1">
                        {h.investigacoes.map((inv) => (
                          <li key={inv.id} className="text-sm  flex gap-2">
                            <span aria-hidden="true">•</span>
                            {inv.descricao}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {perguntas.length > 0 && (
          <Card>
            <h2 className="flex items-center gap-2 text-lg  mb-1">
              <i
                className="bi bi-chat-square-text text-ariad-green-water"
                aria-hidden="true"
              />
              Perguntas clínicas sugeridas
            </h2>
            <p className=" mb-4">
              Questões relevantes para aprofundar a investigação clínica
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {perguntas.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 text-sm  bg-ariad-beige-light rounded-lg p-3"
                >
                  <i
                    className="bi bi-question-circle text-ariad-green-water shrink-0"
                    aria-hidden="true"
                  />
                  {p.descricao}
                </div>
              ))}
            </div>
          </Card>
        )}

        {exames.length > 0 && (
          <Card>
            <h2 className="flex items-center gap-2 text-lg  mb-1">
              <i
                className="bi bi-clipboard2-check text-ariad-green-water"
                aria-hidden="true"
              />
              Próximos passos recomendados
            </h2>
            <p className=" mb-4">
              Exames e avaliações sugeridos para confirmação diagnóstica
            </p>
            <ul className="space-y-3">
              {exames.map((ex) => (
                <li
                  key={ex.id}
                  className="flex items-center gap-3 bg-ariad-beige-light rounded-lg p-3"
                >
                  <i
                    className="bi bi-clipboard2-pulse text-ariad-green-water text-lg shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm ">{ex.descricao}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl ">Histórico de consultas</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFormAberto((v) => !v)}
            >
              {formAberto ? 'Cancelar' : 'Nova consulta'}
            </Button>
          </div>
          <div className="space-y-2">
            {caso.consultas.map((c, i) => {
              const aberta = consultaAberta === c.id
              return (
                <Card key={c.id}>
                  <button
                    className="w-full flex items-center justify-between text-left"
                    aria-expanded={aberta}
                    aria-controls={`consulta-${c.id}`}
                    onClick={() => setConsultaAberta(aberta ? null : c.id)}
                  >
                    <span className="font-medium ">
                      Consulta {i + 1} · {especialidadeMedico} ·{' '}
                      {formatarData(c.data)}
                    </span>
                    <i
                      className={`bi ${
                        aberta ? 'bi-chevron-up' : 'bi-chevron-down'
                      } `}
                      aria-hidden="true"
                    />
                  </button>
                  {aberta && (
                    <div
                      id={`consulta-${c.id}`}
                      className="mt-3 space-y-2 text-sm "
                    >
                      <p>
                        <strong>Médico:</strong> {user.nome} · CRM {user.crm}/
                        {user.uf}
                      </p>
                      <p>
                        <strong>Sintomas:</strong> {c.sintomas}
                      </p>
                      {c.evolucao && (
                        <p>
                          <strong>Evolução:</strong> {c.evolucao}
                        </p>
                      )}
                      {c.status && (
                        <p className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_CASO[c.status].pastel
                            }`}
                          >
                            {STATUS_CASO[c.status].label}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </section>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ariad-blue-slate text-ariad-off-white text-sm px-4 py-2 rounded-lg shadow-md"
        >
          {toast}
        </div>
      )}
    </PrivateLayout>
  )
}
