import type { Caso } from '@shared/types'

export const CASO_MOCK_1: Caso = {
  id: 'caso-001',
  pacienteNome: 'Antônio Silva',
  pacienteIdade: '62 anos',
  pacienteSexo: 'masculino',
  pacienteRegiao: 'São Paulo, SP',
  pacienteEspecialidade: 'neurologia',
  historicoFamiliar:
    'Sem histórico familiar conhecido de doenças neurológicas. Pais falecidos por causas cardiovasculares.',
  medicoId: 'medico-001',
  status: 'em_analise',
  criadoEm: new Date('2026-04-15'),
  atualizadoEm: new Date('2026-04-15'),
  consultas: [
    {
      id: 'consulta-001',
      data: new Date('2026-04-15'),
      primeiraConsulta: true,
      sintomas:
        'Tremor em repouso na mão direita, bradicinesia, rigidez muscular, instabilidade postural',
      evolucao:
        'Paciente de 62 anos com tremor progressivo há 8 meses. Iniciou com tremor unilateral em membro superior direito, principalmente em repouso. Relata lentidão progressiva nos movimentos e dificuldade para iniciar caminhada. Sem histórico familiar de doenças neurológicas.',
    },
  ],
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

export const CASO_MOCK_2: Caso = {
  id: 'caso-002',
  pacienteNome: 'Maria Lima',
  pacienteIdade: '34 anos',
  pacienteSexo: 'feminino',
  pacienteRegiao: 'Rio de Janeiro, RJ',
  pacienteEspecialidade: 'neurologia',
  historicoFamiliar:
    'Nega doenças autoimunes ou neuromusculares na família. Irmã com hipotireoidismo.',
  medicoId: 'medico-001',
  status: 'aguardando_exames',
  criadoEm: new Date('2026-04-14'),
  atualizadoEm: new Date('2026-04-14'),
  consultas: [
    {
      id: 'consulta-002',
      data: new Date('2026-04-14'),
      primeiraConsulta: true,
      sintomas:
        'Fraqueza muscular ascendente bilateral, parestesia em extremidades, arreflexia, dificuldade respiratória leve',
      evolucao:
        'Paciente de 34 anos com quadro de fraqueza progressiva há 5 dias, iniciando em membros inferiores e ascendendo. Relata formigamento em mãos e pés. Há 2 semanas apresentou quadro de gastroenterite. Reflexos tendinosos ausentes. Força muscular grau 3 em MMII.',
    },
  ],
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

export const CASO_MOCK_3: Caso = {
  id: 'caso-003',
  pacienteNome: 'Beatriz Andrade',
  pacienteIdade: '24 anos',
  pacienteSexo: 'feminino',
  pacienteRegiao: 'Belo Horizonte, MG',
  pacienteEspecialidade: 'neurologia',
  historicoFamiliar:
    'Irmão com hepatopatia de causa não esclarecida na infância.',
  medicoId: 'medico-001',
  status: 'finalizado',
  criadoEm: new Date('2026-04-04'),
  atualizadoEm: new Date('2026-04-30'),
  consultas: [
    {
      id: 'consulta-003',
      data: new Date('2026-04-04'),
      primeiraConsulta: true,
      sintomas:
        'Tremor postural, disartria, alteração de comportamento, icterícia leve',
      evolucao:
        'Mulher de 24 anos com tremor e alterações de fala há 6 meses, associada a transaminases elevadas e anel de Kayser-Fleischer ao exame oftalmológico.',
      status: 'finalizado',
    },
  ],
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
    },
  ],
  investigacoes: [
    { id: 'inv-010', tipo: 'exame', descricao: 'Ceruloplasmina sérica (esperado < 20 mg/dL)' },
    { id: 'inv-011', tipo: 'exame', descricao: 'Cobre urinário de 24h (esperado > 100 µg/dia)' },
    { id: 'inv-012', tipo: 'exame', descricao: 'Teste genético do gene ATP7B' },
    { id: 'inv-013', tipo: 'exame', descricao: 'Teste de filipina ou oxysterois plasmáticos para Niemann-Pick C' },
  ],
}

export const CASO_MOCK_4: Caso = {
  id: 'caso-004',
  pacienteNome: 'Carlos Mendes',
  pacienteIdade: '57 anos',
  pacienteSexo: 'masculino',
  pacienteRegiao: 'Curitiba, PR',
  pacienteEspecialidade: 'neurologia',
  historicoFamiliar: 'Sem histórico familiar de doenças neuromusculares.',
  medicoId: 'medico-001',
  status: 'em_analise',
  criadoEm: new Date('2026-04-21'),
  atualizadoEm: new Date('2026-04-21'),
  consultas: [
    {
      id: 'consulta-004',
      data: new Date('2026-04-21'),
      primeiraConsulta: true,
      sintomas:
        'Fraqueza assimétrica em membro superior, fasciculações, atrofia muscular, cãibras',
      evolucao:
        'Homem de 57 anos com fraqueza progressiva indolor há 7 meses, fasciculações difusas e hiper-reflexia, sem déficit sensitivo.',
      status: 'em_analise',
    },
  ],
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
    },
  ],
  investigacoes: [
    { id: 'inv-015', tipo: 'exame', descricao: 'Eletroneuromiografia de quatro membros' },
    { id: 'inv-016', tipo: 'exame', descricao: 'Ressonância magnética cervical e torácica' },
    { id: 'inv-017', tipo: 'pergunta', descricao: 'Avaliar sintomas bulbares: disfagia, disartria, sialorreia' },
    { id: 'inv-019', tipo: 'exame', descricao: 'Anticorpos anti-GM1 (IgM) para neuropatia motora multifocal' },
  ],
}

export const CASO_MOCK_5: Caso = {
  id: 'caso-005',
  pacienteNome: 'Daniela Rocha',
  pacienteIdade: '29 anos',
  pacienteSexo: 'feminino',
  pacienteRegiao: 'Salvador, BA',
  pacienteEspecialidade: 'clinica_geral',
  historicoFamiliar: 'Mãe com diagnóstico de espondiloartrite.',
  medicoId: 'medico-001',
  status: 'aguardando_exames',
  criadoEm: new Date('2026-04-27'),
  atualizadoEm: new Date('2026-05-02'),
  consultas: [
    {
      id: 'consulta-005',
      data: new Date('2026-04-27'),
      primeiraConsulta: true,
      sintomas:
        'Úlceras orais recorrentes, úlceras genitais, uveíte, lesões cutâneas',
      evolucao:
        'Mulher de 29 anos com aftas orais recorrentes há mais de 1 ano, episódios de úlceras genitais e quadro de uveíte anterior.',
      status: 'aguardando_exames',
    },
  ],
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
    },
  ],
  investigacoes: [
    { id: 'inv-021', tipo: 'exame', descricao: 'Teste de patergia' },
    { id: 'inv-022', tipo: 'exame', descricao: 'HLA-B51' },
    { id: 'inv-023', tipo: 'exame', descricao: 'Avaliação oftalmológica completa com biomicroscopia' },
    { id: 'inv-024', tipo: 'exame', descricao: 'FAN, anti-DNA e complemento sérico para descartar LES' },
  ],
}

export const CASO_MOCK_6: Caso = {
  id: 'caso-006',
  pacienteNome: 'Eduardo Pinto',
  pacienteIdade: '41 anos',
  pacienteSexo: 'masculino',
  pacienteRegiao: 'Recife, PE',
  pacienteEspecialidade: 'cardiologia',
  historicoFamiliar:
    'Tio materno com doença renal crônica de causa indeterminada.',
  medicoId: 'medico-001',
  status: 'finalizado',
  criadoEm: new Date('2026-05-05'),
  atualizadoEm: new Date('2026-05-14'),
  consultas: [
    {
      id: 'consulta-006',
      data: new Date('2026-05-05'),
      primeiraConsulta: true,
      sintomas:
        'Acroparestesias, angioqueratomas, hipohidrose, hipertrofia ventricular',
      evolucao:
        'Homem de 41 anos com dor neuropática em extremidades desde a adolescência, angioqueratomas em região inguinal e hipertrofia de ventrículo esquerdo ao ecocardiograma.',
      status: 'finalizado',
    },
  ],
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
    },
  ],
  investigacoes: [
    { id: 'inv-026', tipo: 'exame', descricao: 'Dosagem da enzima alfa-galactosidase A (leucócitos)' },
    { id: 'inv-027', tipo: 'exame', descricao: 'Teste genético do gene GLA' },
    { id: 'inv-028', tipo: 'exame', descricao: 'Lyso-Gb3 plasmático (biomarcador)' },
    { id: 'inv-029', tipo: 'exame', descricao: 'Baciloscopia de linfa para descartar hanseníase' },
  ],
}

export const CASO_MOCK_7: Caso = {
  id: 'caso-007',
  pacienteNome: 'Fernanda Souza',
  pacienteIdade: '38 anos',
  pacienteSexo: 'feminino',
  pacienteRegiao: 'Porto Alegre, RS',
  pacienteEspecialidade: 'neurologia',
  historicoFamiliar: 'Sem doenças autoimunes conhecidas na família.',
  medicoId: 'medico-001',
  status: 'em_analise',
  criadoEm: new Date('2026-05-12'),
  atualizadoEm: new Date('2026-05-12'),
  consultas: [
    {
      id: 'consulta-007',
      data: new Date('2026-05-12'),
      primeiraConsulta: true,
      sintomas:
        'Ptose flutuante, diplopia, fadiga muscular ao esforço, fraqueza vespertina',
      evolucao:
        'Mulher de 38 anos com ptose palpebral que piora ao fim do dia, diplopia intermitente e fraqueza que melhora com repouso.',
      status: 'em_analise',
    },
  ],
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
    },
  ],
  investigacoes: [
    { id: 'inv-033', tipo: 'exame', descricao: 'Anticorpos anti-receptor de acetilcolina (AChR)' },
    { id: 'inv-034', tipo: 'exame', descricao: 'Eletroneuromiografia com estimulação repetitiva' },
    { id: 'inv-035', tipo: 'exame', descricao: 'TC de tórax (pesquisa de timoma)' },
    { id: 'inv-037', tipo: 'exame', descricao: 'Anticorpos anti-MuSK e anti-LRP4 se AChR negativo' },
  ],
}

export const CASO_MOCK_8: Caso = {
  id: 'caso-008',
  pacienteNome: 'Gabriel Teixeira',
  pacienteIdade: '19 anos',
  pacienteSexo: 'masculino',
  pacienteRegiao: 'Fortaleza, CE',
  pacienteEspecialidade: 'neurologia',
  historicoFamiliar: 'Pais consanguíneos (primos de primeiro grau).',
  medicoId: 'medico-001',
  status: 'finalizado',
  criadoEm: new Date('2026-05-16'),
  atualizadoEm: new Date('2026-05-17'),
  consultas: [
    {
      id: 'consulta-008',
      data: new Date('2026-05-16'),
      primeiraConsulta: true,
      sintomas:
        'Ataxia de marcha progressiva, arreflexia, disartria, escoliose',
      evolucao:
        'Adolescente de 19 anos com instabilidade de marcha progressiva desde os 13 anos, arreflexia em membros inferiores, disartria e escoliose. Pais consanguíneos.',
      status: 'finalizado',
    },
  ],
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
    },
  ],
  investigacoes: [
    { id: 'inv-038', tipo: 'exame', descricao: 'Teste genético para expansão GAA no gene FXN' },
    { id: 'inv-039', tipo: 'exame', descricao: 'Ecocardiograma (miocardiopatia hipertrófica)' },
    { id: 'inv-041', tipo: 'exame', descricao: 'Dosagem de vitamina E sérica' },
    { id: 'inv-043', tipo: 'exame', descricao: 'Painel genético para SCAs' },
  ],
}

export const CASOS_DEMO: Caso[] = [
  CASO_MOCK_1,
  CASO_MOCK_2,
  CASO_MOCK_3,
  CASO_MOCK_4,
  CASO_MOCK_5,
  CASO_MOCK_6,
  CASO_MOCK_7,
  CASO_MOCK_8,
]

export const CASOS_TEMPLATES = {
  parkinson: {
    pacienteNome: 'Antônio Silva',
    pacienteCpf: '123.456.789-00',
    pacienteIdade: '62 anos',
    pacienteSexo: 'masculino' as const,
    pacienteRegiao: 'São Paulo, SP',
    pacienteEspecialidade: 'neurologia',
    historicoFamiliar:
      'Sem histórico familiar conhecido de doenças neurológicas.',
    sintomas:
      'Tremor em repouso na mão direita, bradicinesia, rigidez muscular, instabilidade postural',
    evolucao:
      'Paciente de 62 anos com tremor progressivo há 8 meses. Iniciou com tremor unilateral em membro superior direito, principalmente em repouso. Relata lentidão progressiva nos movimentos e dificuldade para iniciar caminhada.',
  },
  guillain: {
    pacienteNome: 'Maria Lima',
    pacienteCpf: '987.654.321-00',
    pacienteIdade: '34 anos',
    pacienteSexo: 'feminino' as const,
    pacienteRegiao: 'Rio de Janeiro, RJ',
    pacienteEspecialidade: 'neurologia',
    historicoFamiliar: 'Nega doenças autoimunes ou neuromusculares na família.',
    sintomas:
      'Fraqueza muscular ascendente bilateral, parestesia em extremidades, arreflexia, dificuldade respiratória leve',
    evolucao:
      'Paciente de 34 anos com quadro de fraqueza progressiva há 5 dias, iniciando em membros inferiores e ascendendo. Relata formigamento em mãos e pés. Há 2 semanas apresentou quadro de gastroenterite. Reflexos tendinosos ausentes. Força muscular grau 3 em MMII.',
  },
}
