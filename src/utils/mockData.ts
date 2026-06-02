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
      probabilidade: 78,
      evidencias: [
        'Tremor de repouso característico',
        'Bradicinesia confirmada ao exame',
        'Rigidez muscular em roda denteada',
        'Idade e progressão compatíveis',
      ],
      investigacoes: [
        {
          id: 'inv-001',
          tipo: 'pergunta',
          descricao: 'Investigar resposta a levodopa (teste terapêutico)',
        },
        {
          id: 'inv-002',
          tipo: 'exame',
          descricao:
            'Ressonância magnética de crânio para descartar causas secundárias',
        },
        {
          id: 'inv-003',
          tipo: 'exame',
          descricao:
            'DAT-Scan (cintilografia de transportador de dopamina) se disponível',
        },
      ],
    },
    {
      id: 'hip-002',
      nome: 'Parkinsonismo atípico',
      probabilidade: 15,
      evidencias: [
        'Sintomas motores presentes',
        'Necessário acompanhamento para descartar',
      ],
      investigacoes: [
        {
          id: 'inv-004',
          tipo: 'pergunta',
          descricao:
            'Avaliar sintomas não-motores: constipação, hiposmia, distúrbios do sono REM',
        },
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-001',
      tipo: 'pergunta',
      descricao: 'Investigar resposta a levodopa (teste terapêutico)',
    },
    {
      id: 'inv-002',
      tipo: 'exame',
      descricao:
        'Ressonância magnética de crânio para descartar causas secundárias',
    },
    {
      id: 'inv-003',
      tipo: 'exame',
      descricao:
        'DAT-Scan (cintilografia de transportador de dopamina) se disponível',
    },
    {
      id: 'inv-004',
      tipo: 'pergunta',
      descricao:
        'Avaliar presença de sintomas não-motores: constipação, hiposmia, distúrbios do sono REM',
    },
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
        {
          id: 'inv-005',
          tipo: 'exame',
          descricao:
            'Punção lombar com análise de líquor (dissociação albumino-citológica)',
        },
        {
          id: 'inv-007',
          tipo: 'exame',
          descricao:
            'Gasometria arterial e espirometria (monitorar função respiratória)',
        },
      ],
    },
    {
      id: 'hip-004',
      nome: 'Polirradiculoneuropatia desmielinizante',
      probabilidade: 20,
      evidencias: [
        'Padrão de fraqueza compatível',
        'Necessário eletroneuromiografia para confirmar',
      ],
      investigacoes: [
        {
          id: 'inv-006',
          tipo: 'exame',
          descricao: 'Eletroneuromiografia (padrão desmielinizante)',
        },
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-005',
      tipo: 'exame',
      descricao:
        'Punção lombar com análise de líquor (dissociação albumino-citológica)',
    },
    {
      id: 'inv-006',
      tipo: 'exame',
      descricao: 'Eletroneuromiografia (padrão desmielinizante)',
    },
    {
      id: 'inv-007',
      tipo: 'exame',
      descricao:
        'Gasometria arterial e espirometria (monitorar função respiratória)',
    },
    {
      id: 'inv-008',
      tipo: 'pergunta',
      descricao:
        'Avaliar progressão da fraqueza e capacidade vital forçada diariamente',
    },
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
      id: 'hip-005',
      nome: 'Doença de Wilson',
      probabilidade: 84,
      evidencias: [
        'Anel de Kayser-Fleischer presente',
        'Ceruloplasmina sérica reduzida',
        'Sintomas neuropsiquiátricos com hepatopatia',
        'Idade de início compatível',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-009',
      tipo: 'exame',
      descricao: 'Cobre urinário de 24h e ceruloplasmina sérica',
    },
    {
      id: 'inv-010',
      tipo: 'exame',
      descricao: 'Ressonância magnética de crânio (gânglios da base)',
    },
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
      id: 'hip-006',
      nome: 'Esclerose Lateral Amiotrófica',
      probabilidade: 61,
      evidencias: [
        'Sinais de 1º e 2º neurônio motor concomitantes',
        'Fraqueza progressiva sem alteração sensitiva',
        'Fasciculações e atrofia',
      ],
    },
    {
      id: 'hip-007',
      nome: 'Neuropatia motora multifocal',
      probabilidade: 18,
      evidencias: [
        'Fraqueza assimétrica',
        'Necessário eletroneuromiografia para diferenciar',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-011',
      tipo: 'exame',
      descricao: 'Eletroneuromiografia de quatro membros',
    },
    {
      id: 'inv-012',
      tipo: 'pergunta',
      descricao: 'Avaliar sintomas bulbares (disfagia, disartria)',
    },
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
      id: 'hip-008',
      nome: 'Síndrome de Behçet',
      probabilidade: 57,
      evidencias: [
        'Úlceras orais e genitais recorrentes',
        'Acometimento ocular (uveíte)',
        'Lesões cutâneas associadas',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-013',
      tipo: 'exame',
      descricao: 'Teste de patergia e avaliação oftalmológica',
    },
    {
      id: 'inv-014',
      tipo: 'exame',
      descricao: 'HLA-B51 e provas inflamatórias',
    },
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
      id: 'hip-009',
      nome: 'Doença de Fabry',
      probabilidade: 72,
      evidencias: [
        'Acroparestesias desde a juventude',
        'Angioqueratomas característicos',
        'Hipertrofia ventricular esquerda',
        'História familiar ligada ao X',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-015',
      tipo: 'exame',
      descricao: 'Dosagem da enzima alfa-galactosidase A',
    },
    { id: 'inv-016', tipo: 'exame', descricao: 'Teste genético do gene GLA' },
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
      id: 'hip-010',
      nome: 'Miastenia Gravis',
      probabilidade: 66,
      evidencias: [
        'Fraqueza muscular flutuante e fatigável',
        'Ptose e diplopia',
        'Piora vespertina com melhora ao repouso',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-017',
      tipo: 'exame',
      descricao: 'Anticorpos anti-receptor de acetilcolina',
    },
    {
      id: 'inv-018',
      tipo: 'exame',
      descricao: 'Eletroneuromiografia com estimulação repetitiva',
    },
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
      id: 'hip-011',
      nome: 'Ataxia de Friedreich',
      probabilidade: 70,
      evidencias: [
        'Ataxia progressiva de início juvenil',
        'Arreflexia com sinal de Babinski',
        'Escoliose e consanguinidade parental',
      ],
    },
  ],
  investigacoes: [
    {
      id: 'inv-019',
      tipo: 'exame',
      descricao: 'Teste genético para expansão GAA no gene FXN',
    },
    {
      id: 'inv-020',
      tipo: 'exame',
      descricao: 'Ecocardiograma (miocardiopatia hipertrófica)',
    },
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
