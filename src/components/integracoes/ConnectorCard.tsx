import { Card, Badge, Button } from '@/components'
import type { ConectorInfo, ConfigIntegracao } from '@shared/types'

type ConnectorCardProps = {
  conector: ConectorInfo
  config?: ConfigIntegracao
  onConfigurar: () => void
  onDesconectar: () => void
}

export default function ConnectorCard({
  conector,
  config,
  onConfigurar,
  onDesconectar,
}: ConnectorCardProps) {
  const conectado = config?.status === 'conectado'

  return (
    <Card className="flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-ariad-green-water-light flex items-center justify-center">
              <i
                className={`bi ${conector.icone} text-lg text-ariad-blue-medium`}
                aria-hidden="true"
              />
            </span>
            <div>
              <h3 className="font-semibold text-sm">{conector.nome}</h3>
              <Badge variant={conectado ? 'success' : 'default'}>
                {conectado ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-sm mt-3">{conector.descricao}</p>

        <p className="text-xs text-ariad-blue-medium mt-2">
          <strong>Requer:</strong> {conector.requisitos}
        </p>

        {conectado && config?.conectadoEm && (
          <p className="text-xs text-ariad-green-water mt-1">
            Conectado em{' '}
            {new Date(config.conectadoEm).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      <div>
        {conectado ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDesconectar}
          >
            Desconectar
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onConfigurar}
          >
            Configurar
          </Button>
        )}
      </div>
    </Card>
  )
}
