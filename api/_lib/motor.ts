type Investigacao = {
  id: string
  tipo: 'pergunta' | 'exame'
  descricao: string
}

type Hipotese = {
  id: string
  nome: string
  probabilidade: number
  evidencias: string[]
  investigacoes?: Investigacao[]
}

type Padrao = {
  termos: string[]
  hipoteses: Hipotese[]
  investigacoes: Investigacao[]
}

const PADRAO_PARKINSON: Padrao = {
  termos: ['tremor', 'bradicinesia', 'rigidez', 'parkinson', 'instabilidade postural'],
  hipoteses: [
    {
      id: 'hip-001',
      nome: 'Doença de Parkinson',
      probabilidade: 78,
      evidencias: [
        'Tremor de repouso característico',
        'Bradicinesia confirmada ao exame',
        'Rigidez muscular em roda denteada',
        'Idade e progressão compatíveis',
      ],
      investigacoes: [
        { id: 'inv-001', tipo: 'pergunta', descricao: 'Investigar resposta a levodopa (teste terapêutico)' },
        { id: 'inv-002', tipo: 'exame', descricao: 'Ressonância magnética de crânio para descartar causas secundárias' },
        { id: 'inv-003', tipo: 'exame', descricao: 'DAT-Scan (cintilografia de transportador de dopamina) se disponível' },
      ],
    },
    {
      id: 'hip-002',
      nome: 'Parkinsonismo atípico',
      probabilidade: 15,
      evidencias: ['Sintomas motores presentes', 'Necessário acompanhamento para descartar'],
      investigacoes: [
        { id: 'inv-004', tipo: 'pergunta', descricao: 'Avaliar sintomas não-motores: constipação, hiposmia, distúrbios do sono REM' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-001', tipo: 'pergunta', descricao: 'Investigar resposta a levodopa (teste terapêutico)' },
    { id: 'inv-002', tipo: 'exame', descricao: 'Ressonância magnética de crânio para descartar causas secundárias' },
    { id: 'inv-003', tipo: 'exame', descricao: 'DAT-Scan (cintilografia de transportador de dopamina) se disponível' },
    { id: 'inv-004', tipo: 'pergunta', descricao: 'Avaliar presença de sintomas não-motores: constipação, hiposmia, distúrbios do sono REM' },
  ],
}

const PADRAO_GUILLAIN: Padrao = {
  termos: ['fraqueza ascendente', 'arreflexia', 'parestesia', 'guillain', 'gastroenterite', 'fraqueza'],
  hipoteses: [
    {
      id: 'hip-003',
      nome: 'Síndrome de Guillain-Barré',
      probabilidade: 65,
      evidencias: [
        'Fraqueza ascendente bilateral',
        'Arreflexia',
        'Antecedente de infecção gastrointestinal',
        'Parestesias distais',
      ],
      investigacoes: [
        { id: 'inv-005', tipo: 'exame', descricao: 'Punção lombar com análise de líquor (dissociação albumino-citológica)' },
        { id: 'inv-007', tipo: 'exame', descricao: 'Gasometria arterial e espirometria (monitorar função respiratória)' },
      ],
    },
    {
      id: 'hip-004',
      nome: 'Polirradiculoneuropatia desmielinizante',
      probabilidade: 20,
      evidencias: ['Padrão de fraqueza compatível', 'Necessário eletroneuromiografia para confirmar'],
      investigacoes: [
        { id: 'inv-006', tipo: 'exame', descricao: 'Eletroneuromiografia (padrão desmielinizante)' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-005', tipo: 'exame', descricao: 'Punção lombar com análise de líquor (dissociação albumino-citológica)' },
    { id: 'inv-006', tipo: 'exame', descricao: 'Eletroneuromiografia (padrão desmielinizante)' },
    { id: 'inv-007', tipo: 'exame', descricao: 'Gasometria arterial e espirometria (monitorar função respiratória)' },
    { id: 'inv-008', tipo: 'pergunta', descricao: 'Avaliar progressão da fraqueza e capacidade vital forçada diariamente' },
  ],
}

const PADROES: Padrao[] = [PADRAO_PARKINSON, PADRAO_GUILLAIN]

const FALLBACK = {
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
    { id: 'inv-generica-1', tipo: 'pergunta' as const, descricao: 'Detalhar tempo de evolução, fatores de melhora/piora e antecedentes familiares.' },
    { id: 'inv-generica-2', tipo: 'exame' as const, descricao: 'Solicitar exames laboratoriais gerais para triagem inicial.' },
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
    return { hipoteses: FALLBACK.hipoteses, investigacoes: FALLBACK.investigacoes }
  }

  return { hipoteses: melhor.hipoteses, investigacoes: melhor.investigacoes }
}
