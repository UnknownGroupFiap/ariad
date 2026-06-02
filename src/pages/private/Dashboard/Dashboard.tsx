import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import { PrivateLayout, Card } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { listarCasos } from '@/services/casos'
import { ROUTES, STATUS_CASO } from '@/utils/constants'
import type { Caso } from '@shared/types'

const MESES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const CORES_STATUS: Record<Caso['status'], string> = {
  finalizado: '#A4CECB',
  em_analise: '#AEC0A3',
  aguardando_exames: '#E2D7B7',
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data: casos = [] } = useQuery({
    queryKey: ['casos', user?.id],
    queryFn: () => listarCasos(),
    enabled: !!user,
  })

  const acoes = [
    {
      to: ROUTES.NOVO_CASO,
      icon: 'bi-plus-circle',
      titulo: 'Novo caso clínico',
      subtitulo: 'Iniciar investigação diagnóstica',
    },
    {
      to: ROUTES.CASOS,
      icon: 'bi-folder2-open',
      titulo: 'Ver todos os casos',
      subtitulo: 'Acessar histórico completo',
    },
  ]

  const stats = [
    {
      label: 'Casos ativos',
      valor: casos.filter((c) => c.status === 'em_analise').length,
      icon: 'bi-file-earmark-text',
      cor: 'bg-ariad-blue-medium',
    },
    {
      label: 'Finalizados',
      valor: casos.filter((c) => c.status === 'finalizado').length,
      icon: 'bi-check-circle',
      cor: 'bg-ariad-green-mint',
    },
    {
      label: 'Aguardando exames',
      valor: casos.filter((c) => c.status === 'aguardando_exames').length,
      icon: 'bi-clock',
      cor: 'bg-ariad-beige-dark',
    },
    {
      label: 'Casos este mês',
      valor: casos.filter((c) => {
        const agora = new Date()
        return (
          c.criadoEm.getMonth() === agora.getMonth() &&
          c.criadoEm.getFullYear() === agora.getFullYear()
        )
      }).length,
      icon: 'bi-calendar-check',
      cor: 'bg-ariad-green-water',
    },
  ]

  const casosPorMes = useMemo(() => {
    const contagem = new Array(12).fill(0)
    casos.forEach((c) => contagem[c.criadoEm.getMonth()]++)
    return contagem
      .map((total, i) => ({ mes: MESES[i], total }))
      .filter((m) => m.total > 0)
  }, [casos])

  const statusData = useMemo(
    () =>
      (Object.keys(STATUS_CASO) as Caso['status'][])
        .map((s) => ({
          name: STATUS_CASO[s].label,
          value: casos.filter((c) => c.status === s).length,
          cor: CORES_STATUS[s],
        }))
        .filter((d) => d.value > 0),
    [casos],
  )

  const recentes = casos.slice(0, 3)

  return (
    <PrivateLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {acoes.map((a) => (
            <Link key={a.titulo} to={a.to}>
              <Card className="flex items-center gap-4 border border-transparent hover:border-ariad-green-water hover:border-2 transition-colors">
                <span className="w-12 h-12 rounded-lg bg-ariad-green-water flex items-center justify-center">
                  <i
                    className={`bi ${a.icon} text-2xl text-white`}
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="block font-semibold ">{a.titulo}</span>
                  <span className="block text-sm ">{a.subtitulo}</span>
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <Card key={s.label}>
              <div className="flex items-start justify-between">
                <span>{s.label}</span>
                <span
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.cor}`}
                >
                  <i className={`bi ${s.icon} text-white`} aria-hidden="true" />
                </span>
              </div>
              <div className="text-3xl font-semibold mt-3">{s.valor}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          <Card>
            <h2 className="text-lg mb-4">Casos por mês</h2>
            {casosPorMes.length === 0 ? (
              <p className="text-sm ">Sem dados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={casosPorMes}>
                  <XAxis dataKey="mes" stroke="#2E364A" fontSize={12} />
                  <YAxis stroke="#2E364A" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    labelStyle={{ color: '#2E364A' }}
                    itemStyle={{ color: '#2E364A' }}
                  />
                  <Bar
                    dataKey="total"
                    name="Casos"
                    fill="#A4CECB"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card>
            <h2 className="text-lg  mb-4">Status dos casos</h2>
            {statusData.length === 0 ? (
              <p className="text-sm ">Sem dados.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                  >
                    {statusData.map((d) => (
                      <Cell key={d.name} fill={d.cor} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#2E364A' }}>{value}</span>
                    )}
                  />
                  <Tooltip
                    labelStyle={{ color: '#2E364A' }}
                    itemStyle={{ color: '#2E364A' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <section>
          <h2 className="text-2xl mb-1">Casos Recentes</h2>
          <p className=" mb-4">Últimos casos clínicos em investigação</p>

          {recentes.length === 0 ? (
            <Card>
              <p className=" text-center py-8">
                Nenhum caso ainda. Crie seu primeiro caso clínico.
              </p>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul>
                {recentes.map((caso) => {
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
                        className="group flex items-center justify-between gap-3 px-6 py-4 hover:bg-ariad-green-water-light transition-colors"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium ">
                              {caso.pacienteNome}
                            </span>
                            <span className="text-sm ">
                              {caso.pacienteIdade}
                            </span>
                          </div>
                          <p className="text-sm  mt-2 flex items-center gap-2">
                            <i
                              className="bi bi-lightbulb text-ariad-green-water"
                              aria-hidden="true"
                            />
                            {hipotese
                              ? `Hipótese: ${hipotese.nome}${
                                  hipotese.probabilidade > 0
                                    ? ` (${hipotese.probabilidade}% confiança)`
                                    : ''
                                }`
                              : 'Sem hipóteses'}
                          </p>
                          <p className="text-sm  mt-1">
                            {STATUS_CASO[caso.status].label} ·{' '}
                            {caso.criadoEm.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <i
                          className="bi bi-chevron-right  group-hover:/40 transition-colors"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {casos.length > 3 && (
                <div className="text-center border-t border-ariad-beige-light py-4">
                  <Link
                    to={ROUTES.CASOS}
                    className="text-sm hover:underline inline-flex items-center gap-1"
                  >
                    Ver todos os casos
                    <i className="bi bi-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </PrivateLayout>
  )
}
