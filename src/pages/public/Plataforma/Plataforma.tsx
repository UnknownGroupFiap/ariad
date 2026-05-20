import { Link } from 'react-router-dom'
import {
  PublicLayout,
  Button,
  SectionHeading,
  HeroSection,
  FeatureCard,
} from '@/components'
import { ROUTES } from '@/utils/constants'

const passos = [
  {
    numero: '01',
    titulo: 'Você descreve o caso',
    descricao:
      'Descreva o caso como faria em qualquer prontuário: sintomas, evolução, antecedentes, contexto regional.',
    extra:
      'Quanto mais contexto, mais consistente a suspeição. Sem mudar a forma como você trabalha.',
  },
  {
    numero: '02',
    titulo: 'O Ariad gera hipóteses',
    descricao:
      'Condições classificadas por plausibilidade, onde cada hipótese vem acompanhada do raciocínio que a sustenta, sem diagnósticos fechados.',
    extra:
      'Você sabe exatamente por que cada suspeita foi levantada. Pode seguir, questionar ou ignorar, a condução é sempre sua.',
  },
  {
    numero: '03',
    titulo: 'Investigação guiada',
    descricao:
      'O Ariad sugere perguntas clínicas para aprofundar a anamnese e ajudar a confirmar ou afastar cada hipótese.',
    extra:
      'Você continua conduzindo a consulta, o Ariad apenas organiza o próximo passo.',
  },
  {
    numero: '04',
    titulo: 'Próximos exames',
    descricao:
      'Indicação dos exames mais assertivos para confirmar ou afastar as hipóteses levantadas.',
    extra: 'Menos exames dispersos, mais direcionamento, sempre como sugestão.',
  },
]

const diferenciais = [
  {
    icone: 'bi-person-vcard-fill',
    titulo: 'Orientado à especialidade',
    texto: 'Linguagem e prioridades adaptadas ao perfil do médico cadastrado.',
  },
  {
    icone: 'bi-file-earmark-medical-fill',
    titulo: 'Análise de documentos',
    texto:
      'Aceita exames e laudos para hipóteses mais consistentes com o caso concreto.',
  },
  {
    icone: 'bi-geo-alt-fill',
    titulo: 'Contexto epidemiológico',
    texto: 'Considera os dados regionais do paciente na suspeição.',
  },
  {
    icone: 'bi-chat-square-text-fill',
    titulo: 'Explicabilidade total',
    texto: 'Cada sugestão tem justificativa clínica visível.',
  },
]

export default function Plataforma() {
  return (
    <PublicLayout>
      <HeroSection>
        <SectionHeading eyebrow="A plataforma" as="h1" className="mb-8">
          Para os casos que pedem mais do que o repertório habitual
        </SectionHeading>
        <div className="border-l-4 border-ariad-green-water pl-6 space-y-4 max-w-3xl">
          <p className="text-lg leading-relaxed">
            Sintomas comuns podem esconder condições que estão fora do
            repertório de qualquer especialidade. Não por falta de conhecimento,
            mas porque são mais de 7.000 doenças raras catalogadas.
          </p>
          <p className="text-lg leading-relaxed">
            O Ariad foi feito para esse momento: ajudar o médico a suspeitar
            melhor, investigar com mais direção e encaminhar com mais segurança.
          </p>
        </div>
      </HeroSection>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Como funciona" className="mb-15">
            Quatro etapas, sempre com você no comando
          </SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {passos.map((p) => (
              <div
                key={p.numero}
                className="bg-white/80 rounded-lg border border-ariad-green-water p-8"
              >
                <div className="text-2xl font-bold text-ariad-green-water mb-3">
                  {p.numero}
                </div>
                <h3 className="text-2xl mb-3">{p.titulo}</h3>
                <p className="mb-2">{p.descricao}</p>
                <p>{p.extra}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-ariad-blue-slate">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Para quem é" className="text-white mb-6">
            Para qualquer médico que já ficou diante de um caso que não fechava
          </SectionHeading>
          <div className="text-lg text-ariad-muted leading-relaxed max-w-3xl">
            <ul className="space-y-1">
              <li>
                O clínico geral que volta ao mesmo caso pela terceira consulta;
              </li>
              <li>
                O pediatra diante de um padrão de desenvolvimento que não se
                encaixa;
              </li>
              <li>
                O neurologista que sente que há algo além do diagnóstico mais
                óbvio.
              </li>
            </ul>
            <p className="mt-6">
              Se você já pensou que aquele caso pedia mais do que o repertório
              habitual, o Ariad foi feito para esse momento.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-ariad-beige-light">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Diferenciais"
            className="mb-12"
          >
            O que sustenta a confiança clínica.
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diferenciais.map((d) => (
              <FeatureCard
                key={d.titulo}
                icon={d.icone}
                title={d.titulo}
                description={d.texto}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-ariad-blue-slate">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl text-ariad-off-white mb-4">
            O caso que não fechava pode ter um próximo passo
          </h2>
          <p className="text-lg text-ariad-muted leading-relaxed">
            O Ariad apoia médicos que atendem casos complexos e precisam ir além
            do diagnóstico mais imediato
          </p>
          <div className="mt-6">
            <Link to={ROUTES.CADASTRO}>
              <Button variant="secondary" size="lg">
                Conhecer a plataforma
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
