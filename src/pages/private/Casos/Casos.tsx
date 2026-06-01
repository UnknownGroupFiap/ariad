import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PrivateLayout, Select } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { listarCasos } from '@/services/casos'
import { ROUTES, STATUS_CASO, ESPECIALIDADES } from '@/utils/constants'
import type { Caso } from '@/types'

const especialidadeLabel = (valor: string) =>
  ESPECIALIDADES.find((e) => e.value === valor)?.label ?? valor

const sexoLabel: Record<Caso['pacienteSexo'], string> = {
  masculino: 'Masculino',
  feminino: 'Feminino',
  outro: 'Outro',
}

export default function Casos() {
  const { user } = useAuth()
  const { data: casos = [], isLoading } = useQuery({
    queryKey: ['casos', user?.id],
    queryFn: () => listarCasos(user!.id),
    enabled: !!user,
  })

  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')

  const filtrados = useMemo(
    () =>
      casos.filter((c) => {
        const termo = busca.trim().toLowerCase()
        const buscaOk =
          c.pacienteNome.toLowerCase().includes(termo) ||
          c.pacienteCpf.toLowerCase().includes(termo)
        const statusOk = statusFiltro === 'todos' || c.status === statusFiltro
        return buscaOk && statusOk
      }),
    [casos, busca, statusFiltro],
  )

  return (
    <PrivateLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl ">Casos Clínicos</h1>
          <p>Gerencie e acompanhe todos os casos em investigação</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <i
              className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 /60"
              aria-hidden="true"
            />
            <label htmlFor="busca-casos" className="sr-only">
              Buscar casos por nome ou CPF
            </label>
            <input
              id="busca-casos"
              type="search"
              placeholder="Buscar por nome ou CPF..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-ariad-green-water rounded-lg  placeholder:/40 focus:outline-none focus:ring-2 focus:ring-ariad-green-water"
            />
          </div>
          <Select
            options={[
              { value: 'todos', label: 'Todos os status' },
              ...Object.entries(STATUS_CASO).map(([value, s]) => ({
                value,
                label: s.label,
              })),
            ]}
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-ariad-beige-light">
            <p className="text-sm ">
              {isLoading
                ? 'Carregando casos...'
                : `${filtrados.length} ${
                    filtrados.length === 1
                      ? 'caso encontrado'
                      : 'casos encontrados'
                  }`}
            </p>
          </div>

          {!isLoading && filtrados.length === 0 ? (
            <p className=" text-center py-12">
              Nenhum caso corresponde aos filtros.
            </p>
          ) : (
            <ul>
              {filtrados.map((caso) => {
                const hipotese = [...caso.hipoteses].sort(
                  (a, b) => b.probabilidade - a.probabilidade,
                )[0]
                return (
                  <li
                    key={caso.id}
                    className="border-b border-ariad-beige-light last:border-b-0"
                  >
                    <Link
                      to={ROUTES.CASO(caso.id)}
                      className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-ariad-green-water-light transition-colors"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium ">
                            {caso.pacienteNome}
                          </span>
                          <span className="text-sm ">
                            {caso.pacienteIdade} ·{' '}
                            {sexoLabel[caso.pacienteSexo]}
                          </span>
                        </div>
                        <p className="text-sm  mt-2">
                          Hipótese principal:{' '}
                          <strong>
                            {hipotese ? hipotese.nome : 'Sem hipóteses'}
                          </strong>
                        </p>
                        <p className="text-sm  mt-1">
                          {STATUS_CASO[caso.status].label} ·{' '}
                          {especialidadeLabel(caso.pacienteEspecialidade)} ·{' '}
                          {caso.criadoEm.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {hipotese && hipotese.probabilidade > 0 && (
                        <div className="text-center shrink-0 px-4 py-2 rounded-lg bg-ariad-green-water">
                          <div className="text-md font-semibold ">
                            {hipotese.probabilidade}%
                          </div>
                          <div className="text-xs">confiança</div>
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
