import { useState } from 'react'
import { PrivateLayout, Card } from '@/components'
import ConnectorCard from '@/components/integracoes/ConnectorCard'
import ModalConfiguracao from '@/components/integracoes/ModalConfiguracao'
import {
  CONECTORES,
  listarIntegracoes,
  salvarIntegracao,
  desconectarIntegracao,
} from '@/services/integracoes'
import type { ConectorInfo, ConfigIntegracao } from '@shared/types'

export default function Integracoes() {
  const [configs, setConfigs] = useState<ConfigIntegracao[]>(listarIntegracoes)
  const [modalConector, setModalConector] = useState<ConectorInfo | null>(null)

  const recarregar = () => setConfigs(listarIntegracoes())

  const handleSalvar = (config: ConfigIntegracao) => {
    salvarIntegracao(config)
    recarregar()
    setModalConector(null)
  }

  const handleDesconectar = (tipo: ConfigIntegracao['tipo']) => {
    desconectarIntegracao(tipo)
    recarregar()
  }

  const ativas = configs.filter((c) => c.status === 'conectado').length

  return (
    <PrivateLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl">Integrações</h1>
          <p>
            Conecte seu prontuário eletrônico para importar dados dos pacientes
            automaticamente.
          </p>
        </header>

        <Card>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-ariad-green-water flex items-center justify-center">
              <i className="bi bi-plug text-white text-lg" aria-hidden="true" />
            </span>
            <div>
              {ativas > 0 ? (
                <>
                  <p className="font-semibold">
                    {ativas} integração{ativas > 1 ? 'ões' : ''} ativa
                    {ativas > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-ariad-blue-medium">
                    Dados de pacientes serão importados automaticamente ao
                    digitar o CPF.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Nenhuma integração configurada</p>
                  <p className="text-sm text-ariad-blue-medium">
                    Configure um conector abaixo para importar dados dos
                    pacientes automaticamente.
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONECTORES.map((conector) => (
            <ConnectorCard
              key={conector.tipo}
              conector={conector}
              config={configs.find((c) => c.tipo === conector.tipo)}
              onConfigurar={() => setModalConector(conector)}
              onDesconectar={() => handleDesconectar(conector.tipo)}
            />
          ))}
        </div>

        <Card>
          <div className="flex items-start gap-3">
            <i
              className="bi bi-shield-lock text-lg text-ariad-blue-medium mt-0.5"
              aria-hidden="true"
            />
            <div className="text-sm space-y-1">
              <p className="font-semibold">Consentimento e privacidade</p>
              <p>
                Todos os dados importados são protegidos conforme a LGPD (Lei
                13.709/2018). Criptografia AES-256 em repouso e TLS 1.2+ em
                trânsito.
              </p>
              <p>
                O paciente deve consentir com o compartilhamento de dados entre
                sistemas via Termo de Consentimento Livre e Esclarecido (TCLE)
                específico.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {modalConector && (
        <ModalConfiguracao
          conector={modalConector}
          onSalvar={handleSalvar}
          onFechar={() => setModalConector(null)}
        />
      )}
    </PrivateLayout>
  )
}
