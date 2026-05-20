import type { Hipotese, Investigacao } from '@/types'
import { CASO_MOCK_1, CASO_MOCK_2 } from '@/utils/mockData'

export const VERSAO_ENGINE = 'mock-0.1.0'

type Padrao = {
  termos: string[]
  hipoteses: Hipotese[]
  investigacoes: Investigacao[]
}

const PADROES: Padrao[] = [
  {
    termos: [
      'tremor',
      'bradicinesia',
      'rigidez',
      'parkinson',
      'instabilidade postural',
    ],
    hipoteses: CASO_MOCK_1.hipoteses,
    investigacoes: CASO_MOCK_1.investigacoes,
  },
  {
    termos: [
      'fraqueza ascendente',
      'arreflexia',
      'parestesia',
      'guillain',
      'gastroenterite',
      'fraqueza',
    ],
    hipoteses: CASO_MOCK_2.hipoteses,
    investigacoes: CASO_MOCK_2.investigacoes,
  },
]

const FALLBACK: Pick<Padrao, 'hipoteses' | 'investigacoes'> = {
  hipoteses: [
    {
      id: 'hip-generica',
      nome: 'Investigação em andamento',
      probabilidade: 0,
      evidencias: [
        'Quadro ainda não correlacionado a um padrão conhecido pela base.',
        'Mais dados clínicos podem refinar as hipóteses.',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-generica-1',
      tipo: 'pergunta',
      descricao:
        'Detalhar tempo de evolução, fatores de melhora/piora e antecedentes familiares.',
    },
    {
      id: 'inv-generica-2',
      tipo: 'exame',
      descricao: 'Solicitar exames laboratoriais gerais para triagem inicial.',
    },
  ],
}

function pontuar(texto: string, termos: string[]): number {
  return termos.reduce((acc, t) => (texto.includes(t) ? acc + 1 : acc), 0)
}

export function gerarDiagnostico(
  sintomas: string,
  evolucao: string,
): { hipoteses: Hipotese[]; investigacoes: Investigacao[] } {
  const texto = `${sintomas} ${evolucao}`.toLowerCase()

  let melhor: Padrao | null = null
  let melhorScore = 0

  for (const padrao of PADROES) {
    const score = pontuar(texto, padrao.termos)
    if (score > melhorScore) {
      melhorScore = score
      melhor = padrao
    }
  }

  if (!melhor || melhorScore < 2) {
    return {
      hipoteses: FALLBACK.hipoteses,
      investigacoes: FALLBACK.investigacoes,
    }
  }

  return { hipoteses: melhor.hipoteses, investigacoes: melhor.investigacoes }
}
