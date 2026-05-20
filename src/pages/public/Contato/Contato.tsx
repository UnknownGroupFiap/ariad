import { useState, type FormEvent } from 'react'
import { PublicLayout, Input, Select, Textarea, Button, Card, SectionHeading,} from '@/components'
import { validateEmail } from '@/utils/validators'

const MAX_CHARS_MENSAGEM = 500

const ASSUNTOS = [
  { value: 'duvidas', label: 'Dúvidas sobre a plataforma' },
  { value: 'suporte', label: 'Suporte técnico' },
  { value: 'sugestao', label: 'Opinião ou sugestão' },
  { value: 'outro', label: 'Outro assunto' },
]

const canais = [
  {
    icone: 'bi-envelope-fill',
    titulo: 'Email',
    linhas: ['contato@ariad.com.br', 'suporte@ariad.com.br'],
  },
  {
    icone: 'bi-telephone-fill',
    titulo: 'Telefone',
    linhas: ['(11) 3000-0000', 'WhatsApp: (11) 99999-9999'],
  },
  {
    icone: 'bi-geo-alt-fill',
    titulo: 'Localização',
    linhas: ['São Paulo, SP', 'Brasil'],
  },
  {
    icone: 'bi-clock-fill',
    titulo: 'Horário de atendimento',
    linhas: ['Segunda a Sexta: 8h às 18h', 'Sábado: 8h às 12h'],
  },
]

const faq = [
  {
    pergunta: 'O Ariad substitui o diagnóstico médico?',
    resposta:
      'Não. O Ariad é uma ferramenta de apoio ao raciocínio clínico que apresenta hipóteses com plausibilidade e justificativa. A decisão final é sempre do médico.',
  },
  {
    pergunta: 'O Ariad funciona para qualquer especialidade?',
    resposta:
      'Sim, o Ariad considera a especialidade do médico cadastrado para adaptar linguagem e prioridades. Qualquer especialidade que tenha doenças raras catalogadas em sua área pode se beneficiar da plataforma.',
  },
  {
    pergunta: 'Como o Ariad gera as hipóteses diagnósticas?',
    resposta:
      'A partir dos dados clínicos inseridos, como sintomas, evolução, antecedentes e contexto regional, o Ariad cruza essas informações com bases de doenças raras e apresenta as condições com maior plausibilidade. Cada hipótese vem acompanhada do raciocínio que a gerou.',
  },
  {
    pergunta: 'O Ariad está registrado na Anvisa?',
    resposta:
      'O Ariad é desenvolvido desde o início em conformidade com os requisitos de Software como Dispositivo Médico (SaMD) e com as diretrizes da Anvisa. Responsabilidade regulatória não é uma etapa futura, é parte do processo desde o primeiro dia.',
  },
  {
    pergunta: 'Meus dados e os dados dos pacientes são seguros?',
    resposta:
      'Sim. A plataforma segue os requisitos da LGPD e adota práticas de segurança adequadas ao contexto de saúde digital. Os dados clínicos inseridos são tratados com os mesmos cuidados exigidos de qualquer sistema médico.',
  },
]

export default function Contato() {
  const [form, setForm] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    assunto: ASSUNTOS[0].value,
    mensagem: '',
  })
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)

  const set = (campo: keyof typeof form, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!form.nome.trim()) return setErro('Informe seu nome completo.')
    if (!validateEmail(form.email)) return setErro('Informe um email válido.')
    if (!form.mensagem.trim()) return setErro('Escreva sua mensagem.')
    setEnviado(true)
  }

  return (
    <PublicLayout>
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Contato" as="h1" className="mb-6">
            Fale com a gente
          </SectionHeading>
          <p className="text-lg mb-20 max-w-2xl pb-10">
            Tire suas dúvidas ou envie sugestões pelos canais abaixo
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl mb-6">
                Nossos canais
              </h2>
              <div className="space-y-4">
                {canais.map((c) => (
                  <Card key={c.titulo} className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-lg bg-ariad-green-water flex items-center justify-center">
                      <i
                        className={`bi ${c.icone} text-white`}
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <div className="font-semibold">
                        {c.titulo}
                      </div>
                      {c.linhas.map((l) => (
                        <div key={l} className="text-sm">
                          {l}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl mb-6">
                Envie uma mensagem
              </h2>
              <Card>
                {enviado ? (
                  <div className="text-center py-8">
                    <i
                      className="bi bi-check-circle text-4xl text-ariad-green-water"
                      aria-hidden="true"
                    />
                    <h3 className="text-2xl mt-4 mb-2">
                      Mensagem recebida
                    </h3>
                    <p>
                      Obrigado, {form.nome.split(' ')[0]}. Retornaremos pelo
                      email informado.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Nome completo *"
                      value={form.nome}
                      onChange={(e) => set('nome', e.target.value)}
                    />
                    <Input
                      label="Empresa"
                      value={form.empresa}
                      onChange={(e) => set('empresa', e.target.value)}
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                    />
                    <Input
                      label="Telefone"
                      placeholder="(11) 99999-9999"
                      value={form.telefone}
                      onChange={(e) => set('telefone', e.target.value)}
                    />
                    <Select
                      label="Assunto *"
                      options={ASSUNTOS}
                      value={form.assunto}
                      onChange={(e) => set('assunto', e.target.value)}
                    />
                    <div>
                      <Textarea
                        label={`Mensagem * (${form.mensagem.length}/${MAX_CHARS_MENSAGEM} caracteres)`}
                        rows={4}
                        maxLength={MAX_CHARS_MENSAGEM}
                        placeholder="Escreva sua mensagem..."
                        value={form.mensagem}
                        onChange={(e) => set('mensagem', e.target.value)}
                      />
                    </div>
                    {erro && <p className="text-red-500 text-sm">{erro}</p>}
                    <Button type="submit" variant="primary" className="w-full">
                      <i className="bi bi-send mr-2" aria-hidden="true" />
                      Enviar mensagem
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl md:text-4xl mb-8">
              Dúvidas frequentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faq.map((item) => (
                <Card key={item.pergunta}>
                  <h3 className="text-lg flex items-start gap-2 font-semibold text-ariad-green-water mb-2">
                    <i className="bi bi-question-circle-fill" aria-hidden="true" />
                    {item.pergunta}
                  </h3>
                  <p>{item.resposta}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
