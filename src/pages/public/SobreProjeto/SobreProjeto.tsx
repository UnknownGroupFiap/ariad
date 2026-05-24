import { PublicLayout, SectionHeading, HeroSection } from '@/components'

const integrantes = [
  {
    rm: 'RM567434',
    nome: 'Gabriel Pelizzaro Pereira',
    iniciais: 'GP',
  },
  {
    rm: 'RM567447',
    nome: 'Giovanna de Lima Ribeiro',
    iniciais: 'GL',
  },
  {
    rm: 'RM567071',
    nome: 'Gustavo Vaccari Lopes',
    iniciais: 'GV',
  },
  {
    rm: 'RM567833',
    nome: 'Thales José Mendes de Almeida',
    iniciais: 'TM',
  },
]

const tecnologias = [
  'HTML para a estrutura base da aplicação',
  'CSS e Tailwind CSS para estilização, responsividade e identidade visual',
  'JavaScript e TypeScript para regras de interação e organização do código',
  'React para criação das páginas, componentes e fluxo de navegação',
  'Vite para ambiente de desenvolvimento e geração do build',
  'Vercel para publicação do projeto na web',
]

export default function SobreProjeto() {
  return (
    <PublicLayout>
      <HeroSection>
        <SectionHeading
          eyebrow="Sobre o projeto"
          as="h1"
          className="max-w-4xl mb-8"
        >
          Ariad: apoio ao raciocínio clínico para suspeição de doenças raras
        </SectionHeading>
        <div className="border-l-4 border-ariad-green-water pl-6 space-y-4 max-w-3xl text-lg">
          <p>
            O Ariad foi desenvolvido para o Challenge FIAP 2025/2026 com o
            objetivo de apoiar profissionais de saúde no monitoramento,
            prevenção e investigação de problemas de saúde relacionados a
            doenças raras.
          </p>
          <p>
            A plataforma não substitui o diagnóstico médico. Ela organiza
            informações clínicas, apresenta hipóteses de forma visual e ajuda o
            profissional a conduzir a investigação com mais clareza.
          </p>
        </div>
      </HeroSection>

      <section className="py-20 px-4 sm:px-6 bg-ariad-blue-slate">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Vídeo Pitch"
            className="text-white mb-8 max-w-3xl"
          >
            Apresentação da proposta
          </SectionHeading>
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-ariad-green-water bg-black shadow-lg">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/yGg-VoG-7tc"
              title="Vídeo pitch do projeto Ariad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Equipe" className="mb-12">
            Integrantes do grupo
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrantes.map((integrante) => (
              <article
                key={integrante.rm}
                className="rounded-2xl border border-ariad-green-water bg-white/50 p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    aria-label={`Foto de ${integrante.nome}`}
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ariad-green-water-light text-2xl font-bold text-ariad-blue-slate"
                  >
                    {integrante.iniciais}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ariad-green-water">
                      {integrante.rm}
                    </p>
                    <h3 className="text-xl font-semibold text-ariad-blue-slate">
                      {integrante.nome}
                    </h3>
                    <p className="mt-3 leading-relaxed text-ariad-blue-slate/80">
                      Desenvolvimento, documentação e apresentação do Ariad.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-ariad-beige-light">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Tecnologias" className="mb-8">
            Tecnologias utilizadas no projeto
          </SectionHeading>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed">
            O projeto foi construído com tecnologias abordadas ao longo do
            curso, priorizando organização, responsividade, usabilidade e
            clareza na visualização das informações.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tecnologias.map((tecnologia) => (
              <li
                key={tecnologia}
                className="rounded-xl border border-ariad-green-water bg-white/70 p-4"
              >
                {tecnologia}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PublicLayout>
  )
}
