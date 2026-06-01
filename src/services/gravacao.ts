import type { EtapaProcessamento, ResultadoTranscricao } from '@shared/types'

type PadraoTranscricao = {
  termos: string[]
  resultado: ResultadoTranscricao
}

const PADROES: PadraoTranscricao[] = [
  {
    termos: ['tremor', 'bradicinesia', 'rigidez', 'parkinson', 'instabilidade postural'],
    resultado: {
      transcricao:
        'Doutor, esse tremor na minha mão direita tá piorando. Começou há uns oito meses, ' +
        'mas agora tá mais forte, principalmente quando estou em repouso. Também estou ' +
        'percebendo que demoro mais pra fazer as coisas, abotoar camisa ficou difícil. ' +
        'Minha esposa falou que eu ando mais devagar e meio curvado. Às vezes tropeço, ' +
        'mas não caí ainda. O senhor sente rigidez nos braços ou pernas? Sim, de manhã ' +
        'principalmente, parece que o braço tá duro. E a letra da minha escrita tá ficando ' +
        'pequena, minha filha reparou. Sono tá ruim também, me mexo muito dormindo.',
      sintomasExtraidos: [
        'Tremor em repouso',
        'Bradicinesia',
        'Rigidez muscular matinal',
        'Instabilidade postural',
        'Micrografia',
        'Distúrbio do sono REM',
      ],
      evolucaoExtraida:
        'Paciente de 62 anos com tremor progressivo em membro superior direito há 8 meses, ' +
        'com piora gradual. Apresenta bradicinesia com dificuldade para atividades motoras ' +
        'finas (abotoar camisas), rigidez matinal em membros superiores, lentidão da marcha ' +
        'com postura fletida e micrografia. Refere distúrbio comportamental do sono REM. ' +
        'Sem quedas até o momento. Sem alteração cognitiva aparente.',
    },
  },
  {
    termos: ['fraqueza ascendente', 'arreflexia', 'parestesia', 'guillain', 'fraqueza'],
    resultado: {
      transcricao:
        'Doutora, comecei a sentir um formigamento nos pés uns dez dias atrás, depois de ' +
        'uma virose que tive. Achei que era normal, mas aí a fraqueza foi subindo. Primeiro ' +
        'as pernas ficaram pesadas, agora mal consigo levantar da cadeira sozinho. Ontem ' +
        'comecei a sentir os braços mais fracos também. Sente dor? Sim, nas costas e nas ' +
        'pernas, uma dor meio profunda. O senhor consegue andar? Com muita dificuldade, ' +
        'preciso de apoio. Vou testar seus reflexos aqui... Os reflexos patelares e aquileus ' +
        'estão abolidos bilateralmente.',
      sintomasExtraidos: [
        'Fraqueza muscular ascendente',
        'Parestesia distal',
        'Arreflexia',
        'Dor neuropática',
        'Dificuldade de marcha',
      ],
      evolucaoExtraida:
        'Paciente com quadro de fraqueza muscular ascendente progressiva há 10 dias, ' +
        'precedida por episódio viral. Iniciou com parestesia em extremidades inferiores, ' +
        'evoluindo para fraqueza proximal e distal em membros inferiores, e agora acometendo ' +
        'membros superiores. Arreflexia bilateral em patelares e aquileus. Dor neuropática ' +
        'lombar e em membros inferiores. Necessita de apoio para deambulação.',
    },
  },
  {
    termos: ['hepatomegalia', 'kayser', 'wilson', 'cobre', 'ceruloplasmin'],
    resultado: {
      transcricao:
        'O paciente é jovem, 19 anos, encaminhado pela hepatologia. Apresenta tremor de ' +
        'intenção e disartria progressiva há seis meses. Na avaliação hepática já identificaram ' +
        'hepatomegalia e alteração de enzimas hepáticas. A lâmpada de fenda revelou anéis de ' +
        'Kayser-Fleischer. A mãe relata que o filho mudou o comportamento, ficou mais irritado ' +
        'e com dificuldade na escola. Ceruloplasmina sérica veio baixa, 8 mg/dL. Cobre ' +
        'urinário de 24h está elevado.',
      sintomasExtraidos: [
        'Tremor de intenção',
        'Disartria',
        'Hepatomegalia',
        'Anéis de Kayser-Fleischer',
        'Alteração comportamental',
        'Ceruloplasmina baixa',
      ],
      evolucaoExtraida:
        'Paciente masculino, 19 anos, com tremor de intenção e disartria progressivos há ' +
        '6 meses. Hepatomegalia com elevação de enzimas hepáticas. Anéis de Kayser-Fleischer ' +
        'confirmados por lâmpada de fenda. Ceruloplasmina sérica: 8 mg/dL (baixa). Cobre ' +
        'urinário 24h elevado. Alteração comportamental relatada pela mãe. Quadro compatível ' +
        'com doença de Wilson.',
    },
  },
  {
    termos: ['úlceras', 'uveíte', 'lesões cutâneas', 'behçet', 'oral'],
    resultado: {
      transcricao:
        'Doutora, essas feridas na boca aparecem toda hora, pelo menos uma vez por mês, ' +
        'já faz mais de um ano. São muito dolorosas. Também tive umas feridas parecidas na ' +
        'região genital duas vezes. E meu olho ficou muito vermelho e doendo, o oftalmologista ' +
        'disse que era uveíte. Tenho umas lesões na pele que parecem espinhas inflamadas nos ' +
        'braços e pernas. Alguém da sua família tem algo parecido? Não, ninguém. O senhor ' +
        'viajou recentemente ou mora em alguma região específica? Nasci em São Paulo mesmo.',
      sintomasExtraidos: [
        'Úlceras orais recorrentes',
        'Úlceras genitais',
        'Uveíte anterior',
        'Lesões cutâneas papulopustulosas',
      ],
      evolucaoExtraida:
        'Paciente com úlceras orais recorrentes há mais de 12 meses, com frequência mensal, ' +
        'associadas a úlceras genitais de repetição (2 episódios). Episódio de uveíte anterior ' +
        'diagnosticada por oftalmologista. Lesões cutâneas papulopustulosas em membros. ' +
        'Sem histórico familiar. Quadro clínico sugere investigação para doença de Behçet.',
    },
  },
]

const FALLBACK: ResultadoTranscricao = {
  transcricao:
    'Doutor, estou aqui porque não tenho me sentido bem ultimamente. Comecei com um cansaço ' +
    'que não passa, já faz umas semanas. Também tenho sentido dores pelo corpo, principalmente ' +
    'nas articulações. Meu sono piorou bastante e perdi um pouco de apetite. Alguém na sua ' +
    'família tem alguma doença crônica? Minha mãe tem pressão alta e meu pai é diabético. ' +
    'Vamos investigar melhor, vou solicitar alguns exames iniciais.',
  sintomasExtraidos: [
    'Fadiga crônica',
    'Artralgia difusa',
    'Distúrbio do sono',
    'Hiporexia',
  ],
  evolucaoExtraida:
    'Paciente com queixa de fadiga persistente há semanas, acompanhada de artralgias difusas, ' +
    'distúrbio do sono e redução do apetite. Histórico familiar de hipertensão materna e ' +
    'diabetes paterno. Necessário investigação complementar com exames laboratoriais gerais.',
}

function pontuar(texto: string, termos: string[]): number {
  return termos.reduce((acc, t) => (texto.includes(t) ? acc + 1 : acc), 0)
}

export function gerarTranscricaoMock(
  sintomas: string,
  evolucao: string,
): ResultadoTranscricao {
  const texto = `${sintomas} ${evolucao}`.toLowerCase()

  let melhor: PadraoTranscricao | null = null
  let melhorScore = 0

  for (const padrao of PADROES) {
    const score = pontuar(texto, padrao.termos)
    if (score > melhorScore) {
      melhorScore = score
      melhor = padrao
    }
  }

  if (!melhor || melhorScore < 1) return FALLBACK
  return melhor.resultado
}

const ETAPAS_TEMPLATE: Omit<EtapaProcessamento, 'status'>[] = [
  { id: 'audio', label: 'Processando áudio...' },
  { id: 'transcricao', label: 'Transcrevendo fala...' },
  { id: 'sintomas', label: 'Extraindo sintomas...' },
  { id: 'evolucao', label: 'Gerando evolução clínica...' },
]

const DELAYS = [1500, 2000, 1500, 1000]

export function simularProcessamento(
  onEtapa: (etapas: EtapaProcessamento[]) => void,
  onCompleto: (resultado: ResultadoTranscricao) => void,
  sintomas: string,
  evolucao: string,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = []
  let cancelado = false

  const etapas: EtapaProcessamento[] = ETAPAS_TEMPLATE.map((e) => ({
    ...e,
    status: 'pendente' as const,
  }))

  onEtapa([...etapas])

  let acumulado = 0
  ETAPAS_TEMPLATE.forEach((_, i) => {
    // Marca como "processando"
    const inicioDelay = acumulado
    timers.push(
      setTimeout(() => {
        if (cancelado) return
        etapas[i] = { ...etapas[i], status: 'processando' }
        onEtapa([...etapas])
      }, inicioDelay),
    )

    // Marca como "concluido"
    acumulado += DELAYS[i]
    timers.push(
      setTimeout(() => {
        if (cancelado) return
        etapas[i] = { ...etapas[i], status: 'concluido' }
        onEtapa([...etapas])

        // Última etapa: chama onCompleto
        if (i === ETAPAS_TEMPLATE.length - 1) {
          const resultado = gerarTranscricaoMock(sintomas, evolucao)
          onCompleto(resultado)
        }
      }, acumulado),
    )
  })

  return () => {
    cancelado = true
    timers.forEach(clearTimeout)
  }
}
