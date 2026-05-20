import { Link } from 'react-router-dom'
import {
  PublicLayout,
  Button,
  SectionHeading,
  HeroSection,
  FeatureCard,
} from '@/components'
import { ROUTES } from '@/utils/constants'

const stats = [
  {
    value: '10Mi',
    label: 'de brasileiros vivem com uma doença rara',
  },
  {
    value: '10',
    label: 'médicos consultados em média antes do diagnóstico',
  },
  {
    value: '95%',
    label:
      'dos casos não têm cura. O diagnóstico precoce é o que muda a trajetória',
  },
]

const features = [
  {
    icon: 'bi-percent',
    title: 'Probabilístico',
    description:
      'Hipóteses classificadas por plausibilidade, com base em dados clínicos e evidências clínicas',
  },
  {
    icon: 'bi-chat-dots',
    title: 'Explicável',
    description: 'Cada sugestão vem acompanhada do raciocínio que a sustenta',
  },
  {
    icon: 'bi-person-check',
    title: 'Autônomo',
    description:
      'O Ariad não diagnostica, ele amplia o que o médico consegue enxergar. A conduta e o diagnóstico final são sempre do profissional',
  },
  {
    icon: 'bi-lightning-charge',
    title: 'Simples',
    description:
      'Integrado ao fluxo real da consulta, sem sobrecarga operacional',
  },
]

export default function Inicio() {
  return (
    <PublicLayout>
      <HeroSection>
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
          Para os casos que ainda
          <span className="block text-ariad-green-water italic">
            não têm nome
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Milhões de brasileiros vivem anos com uma doença rara sem um
          diagnóstico correto. O caminho começa com a suspeita certa.
        </p>
      </HeroSection>

      <section className="py-16 px-4 bg-ariad-blue-slate">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white text-2xl md:text-3xl max-w-4xl mb-20">
            Por trás de cada diagnóstico tardio, há anos de consultas, exames e
            incerteza que poderiam ter sido evitados
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {stats.map((stat) => (
              <div key={stat.value} className="text-center max-w-xs">
                <div className="text-4xl md:text-5xl font-bold text-ariad-green-water mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-ariad-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-30 pb-15 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <SectionHeading eyebrow="O Problema">
              O problema não é a falta de conhecimento médico
            </SectionHeading>

            <div className="space-y-4">
              <p>
                São mais de 7.000 doenças raras catalogadas. Nenhum médico (por
                mais experiente) consegue dominar todas as especialidades e
                todos os fenótipos ao mesmo tempo.
              </p>
              <p>
                Quando os sintomas são comuns e a doença é rara, o diagnóstico
                correto exige enxergar além do óbvio. E isso, na rotina real de
                uma consulta, exige um apoio que nenhum médico deveria precisar
                buscar sozinho.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-25 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="O Ariad"
            className="max-w-2xl"
            containerClassName="mb-12"
          >
            A suspeita certa no momento certo muda a trajetória de um paciente
          </SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ariad-blue-slate">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl text-ariad-off-white mb-6">
            O diagnóstico que muda uma vida começa com a suspeita certa
          </h2>
          <Link to={ROUTES.CADASTRO}>
            <Button variant="secondary" size="lg">
              Conhecer a plataforma
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
