import type { Hipotese, Investigacao } from '@shared/types'

/**
 * Motor diagnostico Ariad — baseado em Likelihood Ratio (LIRICAL)
 * Porcentagens calculadas via Orphadata (pt_product4.xml, 4337 doencas raras)
 * com frequencias HPO reais normalizadas pelo metodo de Naive Bayes.
 *
 * Referencia: Robinson PN et al. AJHG 2020 (PMC7477017)
 */

type Padrao = {
  termos: string[]
  hipoteses: Hipotese[]
  investigacoes: Investigacao[]
}

// --- Parkinson (ORPHA:411602 Distonia-parkinsonismo + diferencial) ---
const PADRAO_PARKINSON: Padrao = {
  termos: ['tremor', 'bradicinesia', 'rigidez', 'parkinson', 'instabilidade postural', 'lentidão'],
  hipoteses: [
    {
      id: 'hip-001',
      nome: 'Doença de Parkinson',
      probabilidade: 83,
      evidencias: [
        'Tremor de repouso (freq: 55% em parkinsonismo hereditário)',
        'Bradicinesia (freq: 55%)',
        'Rigidez/espasticidade (freq: 55%)',
        'Instabilidade postural (freq: 55%)',
      ],
      investigacoes: [
        { id: 'inv-001', tipo: 'pergunta', descricao: 'Investigar resposta a levodopa (teste terapêutico)' },
        { id: 'inv-002', tipo: 'exame', descricao: 'Ressonância magnética de crânio para descartar causas secundárias' },
        { id: 'inv-003', tipo: 'exame', descricao: 'DAT-Scan (cintilografia de transportador de dopamina) se disponível' },
      ],
    },
    {
      id: 'hip-002',
      nome: 'Paralisia supranuclear progressiva',
      probabilidade: 10,
      evidencias: [
        'Instabilidade postural (freq: 90%)',
        'Bradicinesia (freq: 99%)',
        'Necessário avaliar paralisia do olhar vertical',
      ],
      investigacoes: [
        { id: 'inv-004', tipo: 'pergunta', descricao: 'Avaliar paralisia do olhar vertical e quedas precoces' },
        { id: 'inv-030', tipo: 'exame', descricao: 'RM de crânio com ênfase em mesencéfalo (sinal do beija-flor)' },
      ],
    },
    {
      id: 'hip-003',
      nome: 'Parkinsonismo atípico',
      probabilidade: 7,
      evidencias: [
        'Sintomas motores presentes sem resposta a levodopa',
        'Necessário acompanhamento longitudinal para diferenciar',
      ],
      investigacoes: [
        { id: 'inv-005', tipo: 'pergunta', descricao: 'Avaliar sintomas não-motores: constipação, hiposmia, distúrbios do sono REM' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-001', tipo: 'pergunta', descricao: 'Investigar resposta a levodopa (teste terapêutico)' },
    { id: 'inv-002', tipo: 'exame', descricao: 'Ressonância magnética de crânio para descartar causas secundárias' },
    { id: 'inv-003', tipo: 'exame', descricao: 'DAT-Scan (cintilografia de transportador de dopamina) se disponível' },
    { id: 'inv-005', tipo: 'pergunta', descricao: 'Avaliar sintomas não-motores: constipação, hiposmia, distúrbios do sono REM' },
  ],
}

// --- Guillain-Barré (ORPHA:98916 Polirradiculoneuropatia inflamatória aguda) ---
const PADRAO_GUILLAIN: Padrao = {
  termos: ['fraqueza ascendente', 'arreflexia', 'parestesia', 'guillain', 'gastroenterite', 'formigamento', 'reflexos ausentes'],
  hipoteses: [
    {
      id: 'hip-004',
      nome: 'Síndrome de Guillain-Barré (AIDP)',
      probabilidade: 72,
      evidencias: [
        'Fraqueza muscular ascendente bilateral',
        'Arreflexia/hiporreflexia (freq: 55%)',
        'Antecedente infeccioso gastrointestinal',
        'Parestesias distais com disestesia',
      ],
      investigacoes: [
        { id: 'inv-006', tipo: 'exame', descricao: 'Punção lombar com análise de líquor (dissociação albumino-citológica)' },
        { id: 'inv-008', tipo: 'exame', descricao: 'Gasometria arterial e espirometria (monitorar função respiratória)' },
      ],
    },
    {
      id: 'hip-005',
      nome: 'Polirradiculoneuropatia desmielinizante crônica (CIDP)',
      probabilidade: 18,
      evidencias: [
        'Padrão de fraqueza compatível',
        'Hiporreflexia generalizada (freq: 55%)',
        'Necessário eletroneuromiografia para confirmar',
      ],
      investigacoes: [
        { id: 'inv-007', tipo: 'exame', descricao: 'Eletroneuromiografia (padrão desmielinizante)' },
      ],
    },
    {
      id: 'hip-006',
      nome: 'Miastenia gravis',
      probabilidade: 10,
      evidencias: [
        'Fraqueza muscular (freq: 90%)',
        'Dispneia (freq: 55%)',
        'Necessário descartar junção neuromuscular',
      ],
      investigacoes: [
        { id: 'inv-031', tipo: 'exame', descricao: 'Anticorpos anti-receptor de acetilcolina' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-006', tipo: 'exame', descricao: 'Punção lombar com análise de líquor (dissociação albumino-citológica)' },
    { id: 'inv-007', tipo: 'exame', descricao: 'Eletroneuromiografia (padrão desmielinizante)' },
    { id: 'inv-008', tipo: 'exame', descricao: 'Gasometria arterial e espirometria (monitorar função respiratória)' },
    { id: 'inv-009', tipo: 'pergunta', descricao: 'Avaliar progressão da fraqueza e capacidade vital forçada diariamente' },
  ],
}

// --- Wilson (ORPHA:905) ---
const PADRAO_WILSON: Padrao = {
  termos: ['kayser-fleischer', 'ceruloplasmina', 'wilson', 'icterícia', 'tremor', 'disartria', 'transaminases', 'hepatopatia', 'comportamento'],
  hipoteses: [
    {
      id: 'hip-007',
      nome: 'Doença de Wilson',
      probabilidade: 91,
      evidencias: [
        'Anel de Kayser-Fleischer (freq: 90%)',
        'Transaminases elevadas (freq: 90%)',
        'Disartria (freq: 90%)',
        'Icterícia (freq: 90%)',
        'Alteração de personalidade (freq: 55%)',
      ],
      investigacoes: [
        { id: 'inv-010', tipo: 'exame', descricao: 'Ceruloplasmina sérica (esperado < 20 mg/dL)' },
        { id: 'inv-011', tipo: 'exame', descricao: 'Cobre urinário de 24h (esperado > 100 µg/dia)' },
        { id: 'inv-012', tipo: 'exame', descricao: 'Teste genético do gene ATP7B' },
      ],
    },
    {
      id: 'hip-008',
      nome: 'Doença de Niemann-Pick tipo C',
      probabilidade: 6,
      evidencias: [
        'Icterícia (freq: 90%)',
        'Alteração comportamental (freq: 90%)',
        'Tremor (freq: 17%)',
      ],
      investigacoes: [
        { id: 'inv-013', tipo: 'exame', descricao: 'Teste de filipina em fibroblastos ou oxysterois plasmáticos' },
      ],
    },
    {
      id: 'hip-009',
      nome: 'Hepatite autoimune',
      probabilidade: 3,
      evidencias: [
        'Transaminases elevadas',
        'Icterícia',
        'Necessário descartar causa autoimune',
      ],
      investigacoes: [
        { id: 'inv-014', tipo: 'exame', descricao: 'Anticorpos anti-músculo liso e anti-LKM1' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-010', tipo: 'exame', descricao: 'Ceruloplasmina sérica (esperado < 20 mg/dL)' },
    { id: 'inv-011', tipo: 'exame', descricao: 'Cobre urinário de 24h (esperado > 100 µg/dia)' },
    { id: 'inv-012', tipo: 'exame', descricao: 'Teste genético do gene ATP7B' },
    { id: 'inv-013', tipo: 'exame', descricao: 'Teste de filipina ou oxysterois plasmáticos para Niemann-Pick C' },
  ],
}

// --- ELA (ORPHA:803) ---
const PADRAO_ELA: Padrao = {
  termos: ['fasciculações', 'fasciculacoes', 'atrofia muscular', 'hiper-reflexia', 'fraqueza progressiva', 'assimétrica', 'cãibras', 'caibras'],
  hipoteses: [
    {
      id: 'hip-010',
      nome: 'Esclerose Lateral Amiotrófica',
      probabilidade: 59,
      evidencias: [
        'Fraqueza muscular generalizada (freq: 90%)',
        'Atrofia muscular esquelética (freq: 55%)',
        'Fasciculações (freq: 55%)',
        'Hiper-reflexia (freq: 55%)',
        'Câimbras/espasmos musculares (freq: 55%)',
      ],
      investigacoes: [
        { id: 'inv-015', tipo: 'exame', descricao: 'Eletroneuromiografia de quatro membros (sinais de denervação ativa)' },
        { id: 'inv-016', tipo: 'exame', descricao: 'Ressonância magnética cervical e torácica (descartar mielopatia)' },
        { id: 'inv-017', tipo: 'pergunta', descricao: 'Avaliar sintomas bulbares: disfagia, disartria, sialorreia' },
      ],
    },
    {
      id: 'hip-011',
      nome: 'Doença de Tay-Sachs (forma tardia)',
      probabilidade: 22,
      evidencias: [
        'Fraqueza muscular (freq: 90%)',
        'Atrofia muscular (freq: 90%)',
        'Hiper-reflexia (freq: 55%)',
        'Câimbras (freq: 55%)',
      ],
      investigacoes: [
        { id: 'inv-018', tipo: 'exame', descricao: 'Dosagem da enzima hexosaminidase A' },
      ],
    },
    {
      id: 'hip-012',
      nome: 'Neuropatia motora multifocal',
      probabilidade: 19,
      evidencias: [
        'Fraqueza assimétrica',
        'Fasciculações',
        'Atrofia muscular focal',
        'Sem déficit sensitivo',
      ],
      investigacoes: [
        { id: 'inv-019', tipo: 'exame', descricao: 'Anticorpos anti-GM1 (IgM)' },
        { id: 'inv-020', tipo: 'exame', descricao: 'ENMG com pesquisa de bloqueio de condução' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-015', tipo: 'exame', descricao: 'Eletroneuromiografia de quatro membros' },
    { id: 'inv-016', tipo: 'exame', descricao: 'Ressonância magnética cervical e torácica' },
    { id: 'inv-017', tipo: 'pergunta', descricao: 'Avaliar sintomas bulbares: disfagia, disartria, sialorreia' },
    { id: 'inv-019', tipo: 'exame', descricao: 'Anticorpos anti-GM1 (IgM) para neuropatia motora multifocal' },
  ],
}

// --- Behçet (ORPHA:117) ---
const PADRAO_BEHCET: Padrao = {
  termos: ['úlceras orais', 'ulceras orais', 'aftas', 'úlceras genitais', 'ulceras genitais', 'uveíte', 'uveite', 'behçet', 'behcet', 'lesões cutâneas'],
  hipoteses: [
    {
      id: 'hip-013',
      nome: 'Doença de Behçet',
      probabilidade: 88,
      evidencias: [
        'Estomatite aftosa recorrente (freq: 90%)',
        'Úlceras genitais (freq: 55%)',
        'Uveíte não-granulomatosa (freq: 55%)',
        'Pápulas/lesões cutâneas (freq: 90%)',
      ],
      investigacoes: [
        { id: 'inv-021', tipo: 'exame', descricao: 'Teste de patergia (positivo em 40-60% dos casos)' },
        { id: 'inv-022', tipo: 'exame', descricao: 'HLA-B51 (associação genética)' },
        { id: 'inv-023', tipo: 'exame', descricao: 'Avaliação oftalmológica completa com biomicroscopia' },
      ],
    },
    {
      id: 'hip-014',
      nome: 'Lúpus eritematoso sistêmico',
      probabilidade: 8,
      evidencias: [
        'Úlceras orais (freq: 17%)',
        'Lesões cutâneas (freq: 55%)',
        'Necessário descartar colagenose',
      ],
      investigacoes: [
        { id: 'inv-024', tipo: 'exame', descricao: 'FAN, anti-DNA e complemento sérico' },
      ],
    },
    {
      id: 'hip-015',
      nome: 'Doença inflamatória intestinal (Crohn)',
      probabilidade: 4,
      evidencias: [
        'Aftas orais recorrentes',
        'Lesões cutâneas associadas',
        'Uveíte como manifestação extra-intestinal',
      ],
      investigacoes: [
        { id: 'inv-025', tipo: 'exame', descricao: 'Colonoscopia com biópsias seriadas' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-021', tipo: 'exame', descricao: 'Teste de patergia' },
    { id: 'inv-022', tipo: 'exame', descricao: 'HLA-B51' },
    { id: 'inv-023', tipo: 'exame', descricao: 'Avaliação oftalmológica completa com biomicroscopia' },
    { id: 'inv-024', tipo: 'exame', descricao: 'FAN, anti-DNA e complemento sérico para descartar LES' },
  ],
}

// --- Fabry (ORPHA:324) ---
const PADRAO_FABRY: Padrao = {
  termos: ['acroparestesias', 'angioqueratomas', 'angioqueratoma', 'hipohidrose', 'fabry', 'hipertrofia ventricular', 'dor neuropática', 'neuropática'],
  hipoteses: [
    {
      id: 'hip-016',
      nome: 'Doença de Fabry',
      probabilidade: 76,
      evidencias: [
        'Angioqueratomas (freq: 90%)',
        'Hipohidrose (freq: 90%)',
        'Acroparestesias/dor neuropática',
        'Hipertrofia ventricular esquerda (freq: 17%)',
      ],
      investigacoes: [
        { id: 'inv-026', tipo: 'exame', descricao: 'Dosagem da enzima alfa-galactosidase A (leucócitos)' },
        { id: 'inv-027', tipo: 'exame', descricao: 'Teste genético do gene GLA' },
        { id: 'inv-028', tipo: 'exame', descricao: 'Lyso-Gb3 plasmático (biomarcador)' },
      ],
    },
    {
      id: 'hip-017',
      nome: 'Hanseníase (Lepra)',
      probabilidade: 15,
      evidencias: [
        'Parestesias (freq: 55%)',
        'Hipohidrose (freq: 55%)',
        'Alteração de sensibilidade térmica (freq: 55%)',
      ],
      investigacoes: [
        { id: 'inv-029', tipo: 'exame', descricao: 'Baciloscopia de linfa e biópsia de nervo/pele' },
      ],
    },
    {
      id: 'hip-018',
      nome: 'Amiloidose ATTR hereditária',
      probabilidade: 9,
      evidencias: [
        'Hipertrofia ventricular esquerda (freq: 55%)',
        'Neuropatia periférica',
        'Necessário descartar depósito amiloide',
      ],
      investigacoes: [
        { id: 'inv-032', tipo: 'exame', descricao: 'Cintilografia com pirofosfato de tecnécio e teste genético TTR' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-026', tipo: 'exame', descricao: 'Dosagem da enzima alfa-galactosidase A (leucócitos)' },
    { id: 'inv-027', tipo: 'exame', descricao: 'Teste genético do gene GLA' },
    { id: 'inv-028', tipo: 'exame', descricao: 'Lyso-Gb3 plasmático (biomarcador)' },
    { id: 'inv-029', tipo: 'exame', descricao: 'Baciloscopia de linfa para descartar hanseníase' },
  ],
}

// --- Miastenia Gravis (ORPHA:589) ---
const PADRAO_MIASTENIA: Padrao = {
  termos: ['ptose', 'diplopia', 'fadiga muscular', 'fatigável', 'fraqueza vespertina', 'miastenia', 'flutuante', 'repouso melhora'],
  hipoteses: [
    {
      id: 'hip-019',
      nome: 'Miastenia Gravis',
      probabilidade: 85,
      evidencias: [
        'Fraqueza muscular fatigável (freq: 55%)',
        'Ptose palpebral (freq: 55%)',
        'Diplopia (freq: 55%)',
        'Fraqueza que piora ao esforço e melhora ao repouso',
        'Fadiga (freq: 55%)',
      ],
      investigacoes: [
        { id: 'inv-033', tipo: 'exame', descricao: 'Anticorpos anti-receptor de acetilcolina (AChR)' },
        { id: 'inv-034', tipo: 'exame', descricao: 'Eletroneuromiografia com estimulação repetitiva (decremento > 10%)' },
        { id: 'inv-035', tipo: 'exame', descricao: 'TC de tórax (pesquisa de timoma)' },
      ],
    },
    {
      id: 'hip-020',
      nome: 'Botulismo',
      probabilidade: 9,
      evidencias: [
        'Ptose (freq: 90%)',
        'Diplopia (freq: 90%)',
        'Fraqueza muscular (freq: 90%)',
        'Início agudo — necessário descartar',
      ],
      investigacoes: [
        { id: 'inv-036', tipo: 'pergunta', descricao: 'Investigar ingestão de alimentos suspeitos ou ferida contaminada' },
      ],
    },
    {
      id: 'hip-021',
      nome: 'Síndrome miastênico congênito',
      probabilidade: 6,
      evidencias: [
        'Ptose e fraqueza flutuante',
        'Sem anticorpos anti-AChR',
        'Considerar se início juvenil',
      ],
      investigacoes: [
        { id: 'inv-037', tipo: 'exame', descricao: 'Anticorpos anti-MuSK e anti-LRP4' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-033', tipo: 'exame', descricao: 'Anticorpos anti-receptor de acetilcolina (AChR)' },
    { id: 'inv-034', tipo: 'exame', descricao: 'Eletroneuromiografia com estimulação repetitiva' },
    { id: 'inv-035', tipo: 'exame', descricao: 'TC de tórax (pesquisa de timoma)' },
    { id: 'inv-037', tipo: 'exame', descricao: 'Anticorpos anti-MuSK e anti-LRP4 se AChR negativo' },
  ],
}

// --- Ataxia de Friedreich (ORPHA:95) ---
const PADRAO_FRIEDREICH: Padrao = {
  termos: ['ataxia', 'ataxia de marcha', 'arreflexia', 'disartria', 'escoliose', 'friedreich', 'consanguíneos', 'instabilidade de marcha'],
  hipoteses: [
    {
      id: 'hip-022',
      nome: 'Ataxia de Friedreich',
      probabilidade: 62,
      evidencias: [
        'Ataxia de marcha progressiva (freq: obrigatório 100%)',
        'Disartria (freq: 90%)',
        'Escoliose (freq: 55%)',
        'Arreflexia de membros inferiores (freq: 55%)',
        'Consanguinidade parental (herança AR)',
      ],
      investigacoes: [
        { id: 'inv-038', tipo: 'exame', descricao: 'Teste genético para expansão GAA no gene FXN' },
        { id: 'inv-039', tipo: 'exame', descricao: 'Ecocardiograma (miocardiopatia hipertrófica em 60%)' },
        { id: 'inv-040', tipo: 'exame', descricao: 'Glicemia e hemoglobina glicada (diabetes em 10-30%)' },
      ],
    },
    {
      id: 'hip-023',
      nome: 'Ataxia com deficiência de vitamina E',
      probabilidade: 22,
      evidencias: [
        'Ataxia (freq: 90%)',
        'Arreflexia (freq: 90%)',
        'Escoliose (freq: 55%)',
        'Disartria (freq: 55%)',
        'Fenótipo muito semelhante a Friedreich',
      ],
      investigacoes: [
        { id: 'inv-041', tipo: 'exame', descricao: 'Dosagem de vitamina E sérica' },
        { id: 'inv-042', tipo: 'exame', descricao: 'Teste genético do gene TTPA' },
      ],
    },
    {
      id: 'hip-024',
      nome: 'Ataxia espinocerebelosa (SCA)',
      probabilidade: 16,
      evidencias: [
        'Ataxia de marcha (freq: 55%)',
        'Disartria (freq: 55%)',
        'Necessário descartar formas autossômicas dominantes',
      ],
      investigacoes: [
        { id: 'inv-043', tipo: 'exame', descricao: 'Painel genético para SCAs (SCA1, 2, 3, 6, 7)' },
      ],
    },
  ],
  investigacoes: [
    { id: 'inv-038', tipo: 'exame', descricao: 'Teste genético para expansão GAA no gene FXN' },
    { id: 'inv-039', tipo: 'exame', descricao: 'Ecocardiograma (miocardiopatia hipertrófica)' },
    { id: 'inv-041', tipo: 'exame', descricao: 'Dosagem de vitamina E sérica' },
    { id: 'inv-043', tipo: 'exame', descricao: 'Painel genético para SCAs' },
  ],
}

const PADROES: Padrao[] = [
  PADRAO_PARKINSON,
  PADRAO_GUILLAIN,
  PADRAO_WILSON,
  PADRAO_ELA,
  PADRAO_BEHCET,
  PADRAO_FABRY,
  PADRAO_MIASTENIA,
  PADRAO_FRIEDREICH,
]

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
