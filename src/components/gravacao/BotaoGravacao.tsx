import { useState, useEffect, useRef, type KeyboardEvent } from 'react'
import { Button, Textarea } from '@/components'
import WaveformAnimation from './WaveformAnimation'
import { simularProcessamento } from '@/services/gravacao'
import type {
  EstadoGravacao,
  EtapaProcessamento,
  ResultadoTranscricao,
} from '@shared/types'

type BotaoGravacaoProps = {
  sintomas: string
  evolucao: string
  onSalvar: (dados: {
    transcricao: string
    sintomas: string[]
    evolucao: string
  }) => void
}

export default function BotaoGravacao({
  sintomas,
  evolucao,
  onSalvar,
}: BotaoGravacaoProps) {
  const [estado, setEstado] = useState<EstadoGravacao>('idle')
  const [consentimento, setConsentimento] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const [etapas, setEtapas] = useState<EtapaProcessamento[]>([])
  const [resultado, setResultado] = useState<ResultadoTranscricao | null>(null)

  // Estado de revisão editável
  const [sintomasRevisao, setSintomasRevisao] = useState<string[]>([])
  const [evolucaoRevisao, setEvolucaoRevisao] = useState('')
  const [transcricaoAberta, setTranscricaoAberta] = useState(false)
  const [sintomaInput, setSintomaInput] = useState('')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (cancelRef.current) cancelRef.current()
    }
  }, [])

  const abrir = () => {
    setEstado('consent')
    setConsentimento(false)
    setSegundos(0)
    setEtapas([])
    setResultado(null)
  }

  const fechar = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (cancelRef.current) cancelRef.current()
    setEstado('idle')
  }

  const iniciarGravacao = () => {
    setEstado('recording')
    setSegundos(0)
    timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000)
  }

  const pararGravacao = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setEstado('processing')

    cancelRef.current = simularProcessamento(
      setEtapas,
      (res) => {
        setResultado(res)
        setSintomasRevisao(res.sintomasExtraidos)
        setEvolucaoRevisao(res.evolucaoExtraida)
        setEstado('review')
      },
      sintomas,
      evolucao,
    )
  }

  const salvar = () => {
    if (!resultado) return
    onSalvar({
      transcricao: resultado.transcricao,
      sintomas: sintomasRevisao,
      evolucao: evolucaoRevisao,
    })
    fechar()
  }

  const adicionarSintoma = () => {
    const valor = sintomaInput.trim()
    if (!valor) return
    if (!sintomasRevisao.includes(valor))
      setSintomasRevisao((s) => [...s, valor])
    setSintomaInput('')
  }

  const onSintomaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      adicionarSintoma()
    }
  }

  const formatarTempo = (s: number) => {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${min}:${sec}`
  }

  const progresso =
    etapas.length > 0
      ? Math.round(
          (etapas.filter((e) => e.status === 'concluido').length /
            etapas.length) *
            100,
        )
      : 0

  if (estado === 'idle') {
    return (
      <Button type="button" variant="secondary" size="sm" onClick={abrir}>
        <i className="bi bi-mic-fill mr-2" aria-hidden="true" />
        Gravar consulta
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* ── Consentimento ── */}
        {estado === 'consent' && (
          <div className="p-6 space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <i
                className="bi bi-mic-fill text-ariad-green-water"
                aria-hidden="true"
              />
              Gravar consulta
            </h2>

            <div className="bg-ariad-beige-light rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <i
                  className="bi bi-shield-lock text-lg text-ariad-blue-medium mt-0.5"
                  aria-hidden="true"
                />
                <div className="text-sm space-y-1">
                  <p>
                    A gravação requer <strong>consentimento do paciente</strong>{' '}
                    conforme a LGPD (Lei 13.709/2018).
                  </p>
                  <p>
                    O áudio será processado para extração de dados clínicos e
                    descartado após a transcrição.
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm cursor-pointer pt-2 border-t border-ariad-beige">
                <input
                  type="checkbox"
                  checked={consentimento}
                  onChange={(e) => setConsentimento(e.target.checked)}
                  className="accent-ariad-green-water mt-0.5"
                />
                <span>
                  Confirmo que obtive o consentimento do paciente para gravação e
                  processamento por IA desta consulta.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-center py-4">
              <button
                onClick={iniciarGravacao}
                disabled={!consentimento}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  consentimento
                    ? 'bg-ariad-green-water hover:bg-ariad-green-mint text-white cursor-pointer'
                    : 'bg-ariad-muted text-white/60 cursor-not-allowed'
                }`}
                aria-label="Iniciar gravação"
              >
                <i className="bi bi-mic text-3xl" aria-hidden="true" />
              </button>
            </div>
            <p className="text-center text-sm text-ariad-blue-medium">
              {consentimento
                ? 'Clique para iniciar a gravação'
                : 'Marque o consentimento para habilitar'}
            </p>

            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={fechar}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* ── Gravando ── */}
        {estado === 'recording' && (
          <div className="p-6 space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              Gravando consulta
            </h2>

            <div className="flex flex-col items-center gap-4 py-6">
              <button
                onClick={pararGravacao}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                aria-label="Parar gravação"
              >
                <i className="bi bi-stop-fill text-3xl" aria-hidden="true" />
              </button>

              <div className="text-2xl font-mono text-ariad-blue-slate">
                {formatarTempo(segundos)}
              </div>

              <WaveformAnimation ativo />
            </div>

            <p className="text-center text-sm text-ariad-blue-medium">
              Clique no botão para parar e processar a gravação
            </p>
          </div>
        )}

        {/* ── Processando ── */}
        {estado === 'processing' && (
          <div className="p-6 space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <i
                className="bi bi-cpu text-ariad-green-water"
                aria-hidden="true"
              />
              Processando consulta
            </h2>

            <div className="space-y-4">
              <div className="w-full bg-ariad-beige-light rounded-full h-2.5">
                <div
                  className="bg-ariad-green-water h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
              <p className="text-right text-sm text-ariad-blue-medium">
                {progresso}%
              </p>

              <ul className="space-y-2">
                {etapas.map((etapa) => (
                  <li key={etapa.id} className="flex items-center gap-3 text-sm">
                    {etapa.status === 'concluido' && (
                      <i
                        className="bi bi-check-circle-fill text-ariad-green-water"
                        aria-hidden="true"
                      />
                    )}
                    {etapa.status === 'processando' && (
                      <i
                        className="bi bi-arrow-repeat text-ariad-blue-medium animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {etapa.status === 'pendente' && (
                      <i
                        className="bi bi-circle text-ariad-muted"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={
                        etapa.status === 'pendente'
                          ? 'text-ariad-muted'
                          : ''
                      }
                    >
                      {etapa.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Revisão ── */}
        {estado === 'review' && resultado && (
          <div className="p-6 space-y-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <i
                className="bi bi-check-circle text-ariad-green-water"
                aria-hidden="true"
              />
              Dados extraídos — revise antes de salvar
            </h2>

            {/* Sintomas */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Sintomas identificados
              </label>
              {sintomasRevisao.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-2">
                  {sintomasRevisao.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-ariad-green-water-light"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() =>
                          setSintomasRevisao((arr) =>
                            arr.filter((x) => x !== s),
                          )
                        }
                        aria-label={`Remover ${s}`}
                        className="hover:text-red-500"
                      >
                        <i className="bi bi-x" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar sintoma"
                  value={sintomaInput}
                  onChange={(e) => setSintomaInput(e.target.value)}
                  onKeyDown={onSintomaKeyDown}
                  className="flex-1 px-3 py-2 bg-white border border-ariad-beige-dark rounded-lg text-sm placeholder:/40 focus:outline-none focus:ring-2 focus:ring-ariad-green-water"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarSintoma}
                >
                  <i className="bi bi-plus-lg" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Evolução */}
            <Textarea
              label="Evolução do quadro"
              rows={4}
              value={evolucaoRevisao}
              onChange={(e) => setEvolucaoRevisao(e.target.value)}
            />

            {/* Transcrição colapsável */}
            <div>
              <button
                type="button"
                onClick={() => setTranscricaoAberta((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium hover:text-ariad-green-water"
              >
                <i
                  className={`bi ${transcricaoAberta ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                  aria-hidden="true"
                />
                Transcrição completa
              </button>
              {transcricaoAberta && (
                <div className="mt-2 p-3 bg-ariad-beige-light rounded-lg text-sm max-h-40 overflow-y-auto">
                  {resultado.transcricao}
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-2 border-t border-ariad-beige-light">
              <Button type="button" variant="outline" size="sm" onClick={fechar}>
                Descartar
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={salvar}>
                <i className="bi bi-check-lg mr-2" aria-hidden="true" />
                Salvar e aplicar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
