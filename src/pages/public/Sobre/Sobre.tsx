import {
  PublicLayout,
  SectionHeading,
  HeroSection,
  FeatureCard,
} from '@/components'

const principios = [
  {
    icone: 'bi-shield-check',
    titulo: 'Autonomia médica, sempre',
    texto:
      'A responsabilidade pela conduta e pelo diagnóstico é, e continuará sendo, do médico.',
  },
  {
    icone: 'bi-eye',
    titulo: 'Explicabilidade como padrão',
    texto:
      'Toda hipótese vem acompanhada do raciocínio que a gerou. O médico sabe exatamente o que está avaliando.',
  },
  {
    icone: 'bi-diagram-3',
    titulo: 'Feito para a rotina real',
    texto: 'Integrado ao fluxo da consulta sem gerar sobrecarga e sem abrir mão do rigor clínico.',
  },
  {
    icone: 'bi-clipboard2-check',
    titulo: 'Responsabilidade regulatória desde o primeiro dia',
    texto:
      'Desenvolvido desde o início em conformidade com os requisitos de Software como Dispositivo Médico (SaMD) pela Anvisa.',
  },
]

export default function Sobre() {
  return (
    <PublicLayout>
      <HeroSection>
        <SectionHeading
          eyebrow="Sobre nós"
          as="h1"
          className="max-w-4xl mb-8"
        >
          Por que o diagnóstico correto de uma doença rara demora tanto?
        </SectionHeading>
        <div className="border-l-4 border-ariad-green-water pl-6 space-y-4 max-w-3xl text-lg">
          <p>
            O Ariad nasceu dessa pergunta. Não como uma resposta fácil,
            mas como uma tentativa séria de reduzir o tempo entre o
            primeiro sintoma e o diagnóstico correto.
          </p>
          <p>
            São mais de 7.000 doenças raras catalogadas, com apresentações
            clínicas que se confundem com condições muito mais comuns.
            Levantar a suspeita certa, no momento certo, é o passo que muda tudo.
          </p>
        </div>
      </HeroSection>

      <section className="py-20 px-4 sm:px-6 bg-ariad-blue-slate">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="O que nos move"
            className="text-white mb-6 max-w-3xl"
          >
            Reduzir o tempo entre o primeiro sintoma e o diagnóstico correto em doenças raras
          </SectionHeading>
          <p className="text-lg text-ariad-muted leading-relaxed max-w-3xl">
            Não para substituir o médico ou  automatizar a medicina, mas para dar ao médico
            um apoio que hoje não existe, e que pode fazer diferença no momento em que o caso
            ainda não tem nome
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="O que orienta cada decisão que tomamos"
            className="mb-12"
          >
            Nossos princípios
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principios.map((p) => (
              <FeatureCard
                key={p.titulo}
                icon={p.icone}
                title={p.titulo}
                description={p.texto}
                layout="horizontal"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-15 px-4 sm:px-6 lg:px-8 bg-ariad-blue-slate">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-ariad-off-white leading-snug">
            O diagnóstico que muda uma vida começa com a suspeita certa. Estamos
            aqui para que essa suspeita chegue antes.
          </h2>
        </div>
      </section>
    </PublicLayout>
  )
}
