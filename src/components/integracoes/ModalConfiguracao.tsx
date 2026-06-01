import { useState, type FormEvent } from 'react'
import { Button, Input } from '@/components'
import type { ConectorInfo, ConfigIntegracao } from '@shared/types'

type ModalConfiguracaoProps = {
  conector: ConectorInfo
  onSalvar: (config: ConfigIntegracao) => void
  onFechar: () => void
}

export default function ModalConfiguracao({
  conector,
  onSalvar,
  onFechar,
}: ModalConfiguracaoProps) {
  const [credenciais, setCredenciais] = useState<Record<string, string>>(() =>
    Object.fromEntries(conector.campos.map((c) => [c.name, ''])),
  )
  const [conectando, setConectando] = useState(false)
  const [erro, setErro] = useState('')

  const set = (name: string, valor: string) =>
    setCredenciais((c) => ({ ...c, [name]: valor }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    // Validar campos obrigatórios (exceto pdf que não tem campos)
    if (conector.campos.length > 0) {
      const vazio = conector.campos.find((c) => !credenciais[c.name]?.trim())
      if (vazio) {
        setErro(`Preencha o campo "${vazio.label}".`)
        return
      }
    }

    setConectando(true)

    // Simula handshake de 1.5s
    setTimeout(() => {
      onSalvar({
        tipo: conector.tipo,
        status: 'conectado',
        credenciais,
        conectadoEm: new Date().toISOString(),
      })
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i
              className={`bi ${conector.icone} text-ariad-green-water`}
              aria-hidden="true"
            />
            Configurar {conector.nome}
          </h2>
          <button
            onClick={onFechar}
            className="text-ariad-blue-medium hover:text-ariad-blue-slate"
            aria-label="Fechar"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {conector.campos.length === 0 ? (
            <div className="bg-ariad-green-water-light rounded-lg p-4 text-sm">
              <p>
                <strong>Importação de PDF/Laudos</strong>
              </p>
              <p className="mt-1">
                Ao ativar, você poderá importar dados de laudos e resultados de
                exames em PDF automaticamente via OCR simulado.
              </p>
            </div>
          ) : (
            conector.campos.map((campo) => (
              <Input
                key={campo.name}
                label={campo.label}
                type={campo.type === 'password' ? 'password' : 'text'}
                value={credenciais[campo.name] ?? ''}
                onChange={(e) => set(campo.name, e.target.value)}
                placeholder={
                  campo.type === 'password' ? '••••••••' : `Ex.: ${campo.label}`
                }
              />
            ))
          )}

          {conector.tipo === 'rnds' && (
            <div className="bg-ariad-beige-light rounded-lg p-3 flex gap-2 text-xs">
              <i
                className="bi bi-info-circle text-ariad-blue-medium mt-0.5"
                aria-hidden="true"
              />
              <span>
                Para obter credenciais RNDS, acesse o Portal de Serviços do
                Ministério da Saúde e solicite acesso ao serviço RNDS.
              </span>
            </div>
          )}

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onFechar}
              disabled={conectando}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={conectando}>
              {conectando ? (
                <>
                  <i
                    className="bi bi-arrow-repeat animate-spin mr-2"
                    aria-hidden="true"
                  />
                  Conectando...
                </>
              ) : (
                <>
                  <i className="bi bi-plug mr-2" aria-hidden="true" />
                  {conector.campos.length === 0 ? 'Ativar' : 'Conectar'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
