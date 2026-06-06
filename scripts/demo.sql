-- =============================================================================
-- Ariad Demo Data
-- =============================================================================
-- Popula o banco com um medico demo e 12 casos clinicos variados.
--
-- INSTRUCOES:
--   1. Crie a conta demo no Neon Auth: demo@ariad.med.br / Demo@2026
--   2. Faca login uma vez para o sistema criar o medico automaticamente
--   3. Pegue o ID do medico: SELECT id FROM medicos WHERE email = 'demo@ariad.med.br';
--   4. Substitua '__DEMO_MEDICO_ID__' pelo ID real abaixo
--   5. Execute: psql $DATABASE_URL -f scripts/demo.sql
-- =============================================================================

-- Variavel do medico demo (substituir pelo ID real do Neon Auth)
\set demo_id '__DEMO_MEDICO_ID__'

-- Atualiza perfil do medico demo
UPDATE medicos SET
  nome = 'Dr. Rafael Demo',
  crm = '123456',
  uf = 'SP',
  especialidade = 'neurologia',
  nome_clinica = 'Clínica Ariad Demo'
WHERE id = :'demo_id';

-- Limpa casos antigos do demo (idempotente)
DELETE FROM casos WHERE medico_id = :'demo_id';

-- =============================================================================
-- Caso 1: Parkinson (em_analise)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000001', :'demo_id',
  'Antônio Silva', 'demo_hash_001', '62 anos', 'masculino', 'São Paulo, SP', 'neurologia',
  'Sem histórico familiar conhecido de doenças neurológicas. Pais falecidos por causas cardiovasculares.',
  'em_analise',
  '[{"id":"hip-001","nome":"Doença de Parkinson","probabilidade":83,"evidencias":["Tremor de repouso (freq: 55% em parkinsonismo hereditário)","Bradicinesia (freq: 55%)","Rigidez/espasticidade (freq: 55%)","Instabilidade postural (freq: 55%)"],"investigacoes":[{"id":"inv-001","tipo":"exame","descricao":"Ressonância magnética de crânio"},{"id":"inv-002","tipo":"exame","descricao":"DAT-Scan se disponível"},{"id":"inv-003","tipo":"pergunta","descricao":"Investigar resposta a levodopa"}]},{"id":"hip-002","nome":"Paralisia supranuclear progressiva","probabilidade":10,"evidencias":["Instabilidade postural (freq: 90%)","Bradicinesia (freq: 99%)"],"investigacoes":[{"id":"inv-004","tipo":"pergunta","descricao":"Avaliar paralisia do olhar vertical"}]},{"id":"hip-003","nome":"Parkinsonismo atípico","probabilidade":7,"evidencias":["Sintomas motores sem resposta a levodopa","Acompanhamento longitudinal necessário"],"investigacoes":[{"id":"inv-005","tipo":"pergunta","descricao":"Avaliar constipação, hiposmia, distúrbios do sono REM"}]}]'::jsonb,
  '[{"id":"inv-001","tipo":"exame","descricao":"Ressonância magnética de crânio"},{"id":"inv-002","tipo":"exame","descricao":"DAT-Scan se disponível"},{"id":"inv-003","tipo":"pergunta","descricao":"Investigar resposta a levodopa"},{"id":"inv-005","tipo":"pergunta","descricao":"Avaliar constipação, hiposmia, distúrbios do sono REM"}]'::jsonb,
  '2026-04-15'::timestamptz, '2026-04-15'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000001', '2026-04-15'::timestamptz, TRUE,
  'Tremor em repouso na mão direita, bradicinesia, rigidez muscular, instabilidade postural',
  'Paciente de 62 anos com tremor progressivo há 8 meses. Iniciou com tremor unilateral em membro superior direito, principalmente em repouso. Relata lentidão progressiva nos movimentos e dificuldade para iniciar caminhada.',
  'em_analise'
);

-- =============================================================================
-- Caso 2: Guillain-Barré (aguardando_exames)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000002', :'demo_id',
  'Maria Lima', 'demo_hash_002', '34 anos', 'feminino', 'Rio de Janeiro, RJ', 'neurologia',
  'Nega doenças autoimunes ou neuromusculares na família. Irmã com hipotireoidismo.',
  'aguardando_exames',
  '[{"id":"hip-004","nome":"Síndrome de Guillain-Barré (AIDP)","probabilidade":72,"evidencias":["Fraqueza muscular ascendente bilateral","Arreflexia/hiporreflexia (freq: 55%)","Antecedente infeccioso gastrointestinal","Parestesias distais"],"investigacoes":[{"id":"inv-006","tipo":"exame","descricao":"Punção lombar (dissociação albumino-citológica)"},{"id":"inv-008","tipo":"exame","descricao":"Gasometria arterial e espirometria"}]},{"id":"hip-005","nome":"CIDP","probabilidade":18,"evidencias":["Padrão de fraqueza compatível","Hiporreflexia generalizada"],"investigacoes":[{"id":"inv-007","tipo":"exame","descricao":"Eletroneuromiografia"}]},{"id":"hip-006","nome":"Miastenia gravis","probabilidade":10,"evidencias":["Fraqueza muscular (freq: 90%)","Dispneia (freq: 55%)"],"investigacoes":[{"id":"inv-031","tipo":"exame","descricao":"Anticorpos anti-AChR"}]}]'::jsonb,
  '[{"id":"inv-006","tipo":"exame","descricao":"Punção lombar (dissociação albumino-citológica)"},{"id":"inv-007","tipo":"exame","descricao":"Eletroneuromiografia"},{"id":"inv-008","tipo":"exame","descricao":"Gasometria arterial e espirometria"}]'::jsonb,
  '2026-04-14'::timestamptz, '2026-04-16'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000002', '2026-04-14'::timestamptz, TRUE,
  'Fraqueza muscular ascendente bilateral, parestesia em extremidades, arreflexia, dificuldade respiratória leve',
  'Paciente de 34 anos com quadro de fraqueza progressiva há 5 dias, iniciando em membros inferiores e ascendendo. Relata formigamento em mãos e pés. Há 2 semanas apresentou quadro de gastroenterite. Reflexos tendinosos ausentes.',
  'aguardando_exames'
);

-- =============================================================================
-- Caso 3: Wilson (finalizado)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000003', :'demo_id',
  'Beatriz Andrade', 'demo_hash_003', '24 anos', 'feminino', 'Belo Horizonte, MG', 'neurologia',
  'Irmão com hepatopatia de causa não esclarecida na infância.',
  'finalizado',
  '[{"id":"hip-007","nome":"Doença de Wilson","probabilidade":91,"evidencias":["Anel de Kayser-Fleischer (freq: 90%)","Transaminases elevadas (freq: 90%)","Disartria (freq: 90%)","Icterícia (freq: 90%)","Alteração de personalidade (freq: 55%)"],"investigacoes":[]},{"id":"hip-008","nome":"Doença de Niemann-Pick tipo C","probabilidade":6,"evidencias":["Icterícia (freq: 90%)","Alteração comportamental (freq: 90%)"],"investigacoes":[]},{"id":"hip-009","nome":"Hepatite autoimune","probabilidade":3,"evidencias":["Transaminases elevadas","Icterícia"],"investigacoes":[]}]'::jsonb,
  '[{"id":"inv-010","tipo":"exame","descricao":"Ceruloplasmina sérica (esperado < 20 mg/dL)"},{"id":"inv-011","tipo":"exame","descricao":"Cobre urinário de 24h (esperado > 100 µg/dia)"},{"id":"inv-012","tipo":"exame","descricao":"Teste genético do gene ATP7B"}]'::jsonb,
  '2026-04-04'::timestamptz, '2026-04-30'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000003', '2026-04-04'::timestamptz, TRUE,
  'Tremor postural, disartria, alteração de comportamento, icterícia leve',
  'Mulher de 24 anos com tremor e alterações de fala há 6 meses, associada a transaminases elevadas e anel de Kayser-Fleischer ao exame oftalmológico.',
  'finalizado'
);

-- =============================================================================
-- Caso 4: ELA (em_analise)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000004', :'demo_id',
  'Carlos Mendes', 'demo_hash_004', '57 anos', 'masculino', 'Curitiba, PR', 'neurologia',
  'Sem histórico familiar de doenças neuromusculares.',
  'em_analise',
  '[{"id":"hip-010","nome":"Esclerose Lateral Amiotrófica","probabilidade":59,"evidencias":["Fraqueza muscular generalizada (freq: 90%)","Atrofia muscular (freq: 55%)","Fasciculações (freq: 55%)","Hiper-reflexia (freq: 55%)","Câimbras (freq: 55%)"],"investigacoes":[{"id":"inv-015","tipo":"exame","descricao":"ENMG de quatro membros"}]},{"id":"hip-011","nome":"Doença de Tay-Sachs (forma tardia)","probabilidade":22,"evidencias":["Fraqueza muscular (freq: 90%)","Atrofia muscular (freq: 90%)","Hiper-reflexia (freq: 55%)"],"investigacoes":[]},{"id":"hip-012","nome":"Neuropatia motora multifocal","probabilidade":19,"evidencias":["Fraqueza assimétrica","Fasciculações","Atrofia focal"],"investigacoes":[{"id":"inv-019","tipo":"exame","descricao":"Anticorpos anti-GM1"}]}]'::jsonb,
  '[{"id":"inv-015","tipo":"exame","descricao":"Eletroneuromiografia de quatro membros"},{"id":"inv-016","tipo":"exame","descricao":"Ressonância magnética cervical e torácica"},{"id":"inv-017","tipo":"pergunta","descricao":"Avaliar sintomas bulbares: disfagia, disartria, sialorreia"},{"id":"inv-019","tipo":"exame","descricao":"Anticorpos anti-GM1 (IgM)"}]'::jsonb,
  '2026-04-21'::timestamptz, '2026-04-21'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000004', '2026-04-21'::timestamptz, TRUE,
  'Fraqueza assimétrica em membro superior, fasciculações, atrofia muscular, cãibras',
  'Homem de 57 anos com fraqueza progressiva indolor há 7 meses, fasciculações difusas e hiper-reflexia, sem déficit sensitivo.',
  'em_analise'
);

-- =============================================================================
-- Caso 5: Behçet (aguardando_exames)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000005', :'demo_id',
  'Daniela Rocha', 'demo_hash_005', '29 anos', 'feminino', 'Salvador, BA', 'clinica_geral',
  'Mãe com diagnóstico de espondiloartrite.',
  'aguardando_exames',
  '[{"id":"hip-013","nome":"Doença de Behçet","probabilidade":88,"evidencias":["Estomatite aftosa recorrente (freq: 90%)","Úlceras genitais (freq: 55%)","Uveíte não-granulomatosa (freq: 55%)","Lesões cutâneas (freq: 90%)"],"investigacoes":[{"id":"inv-021","tipo":"exame","descricao":"Teste de patergia"}]},{"id":"hip-014","nome":"Lúpus eritematoso sistêmico","probabilidade":8,"evidencias":["Úlceras orais (freq: 17%)","Lesões cutâneas (freq: 55%)"],"investigacoes":[{"id":"inv-024","tipo":"exame","descricao":"FAN, anti-DNA e complemento"}]},{"id":"hip-015","nome":"Doença de Crohn","probabilidade":4,"evidencias":["Aftas orais recorrentes","Lesões cutâneas","Uveíte extra-intestinal"],"investigacoes":[]}]'::jsonb,
  '[{"id":"inv-021","tipo":"exame","descricao":"Teste de patergia"},{"id":"inv-022","tipo":"exame","descricao":"HLA-B51"},{"id":"inv-023","tipo":"exame","descricao":"Avaliação oftalmológica com biomicroscopia"},{"id":"inv-024","tipo":"exame","descricao":"FAN, anti-DNA e complemento sérico"}]'::jsonb,
  '2026-04-27'::timestamptz, '2026-05-02'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000005', '2026-04-27'::timestamptz, TRUE,
  'Úlceras orais recorrentes, úlceras genitais, uveíte, lesões cutâneas',
  'Mulher de 29 anos com aftas orais recorrentes há mais de 1 ano, episódios de úlceras genitais e quadro de uveíte anterior.',
  'aguardando_exames'
);

-- =============================================================================
-- Caso 6: Fabry (finalizado)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000006', :'demo_id',
  'Eduardo Pinto', 'demo_hash_006', '41 anos', 'masculino', 'Recife, PE', 'cardiologia',
  'Tio materno com doença renal crônica de causa indeterminada.',
  'finalizado',
  '[{"id":"hip-016","nome":"Doença de Fabry","probabilidade":76,"evidencias":["Angioqueratomas (freq: 90%)","Hipohidrose (freq: 90%)","Acroparestesias/dor neuropática","Hipertrofia ventricular esquerda (freq: 17%)"],"investigacoes":[]},{"id":"hip-017","nome":"Hanseníase","probabilidade":15,"evidencias":["Parestesias (freq: 55%)","Hipohidrose (freq: 55%)"],"investigacoes":[{"id":"inv-029","tipo":"exame","descricao":"Baciloscopia de linfa"}]},{"id":"hip-018","nome":"Amiloidose ATTR hereditária","probabilidade":9,"evidencias":["Hipertrofia ventricular (freq: 55%)","Neuropatia periférica"],"investigacoes":[]}]'::jsonb,
  '[{"id":"inv-026","tipo":"exame","descricao":"Dosagem alfa-galactosidase A"},{"id":"inv-027","tipo":"exame","descricao":"Teste genético do gene GLA"},{"id":"inv-028","tipo":"exame","descricao":"Lyso-Gb3 plasmático"},{"id":"inv-029","tipo":"exame","descricao":"Baciloscopia de linfa"}]'::jsonb,
  '2026-05-05'::timestamptz, '2026-05-14'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000006', '2026-05-05'::timestamptz, TRUE,
  'Acroparestesias, angioqueratomas, hipohidrose, hipertrofia ventricular',
  'Homem de 41 anos com dor neuropática em extremidades desde a adolescência, angioqueratomas em região inguinal e hipertrofia de ventrículo esquerdo ao ecocardiograma.',
  'finalizado'
);

-- =============================================================================
-- Caso 7: Miastenia Gravis (em_analise)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000007', :'demo_id',
  'Fernanda Souza', 'demo_hash_007', '38 anos', 'feminino', 'Porto Alegre, RS', 'neurologia',
  'Sem doenças autoimunes conhecidas na família.',
  'em_analise',
  '[{"id":"hip-019","nome":"Miastenia Gravis","probabilidade":85,"evidencias":["Fraqueza muscular fatigável (freq: 55%)","Ptose palpebral (freq: 55%)","Diplopia (freq: 55%)","Fadiga (freq: 55%)"],"investigacoes":[{"id":"inv-033","tipo":"exame","descricao":"Anticorpos anti-AChR"}]},{"id":"hip-020","nome":"Botulismo","probabilidade":9,"evidencias":["Ptose (freq: 90%)","Diplopia (freq: 90%)","Fraqueza muscular (freq: 90%)"],"investigacoes":[]},{"id":"hip-021","nome":"Síndrome miastênico congênito","probabilidade":6,"evidencias":["Ptose e fraqueza flutuante","Considerar se início juvenil"],"investigacoes":[]}]'::jsonb,
  '[{"id":"inv-033","tipo":"exame","descricao":"Anticorpos anti-AChR"},{"id":"inv-034","tipo":"exame","descricao":"ENMG com estimulação repetitiva"},{"id":"inv-035","tipo":"exame","descricao":"TC de tórax (timoma)"},{"id":"inv-037","tipo":"exame","descricao":"Anti-MuSK e anti-LRP4 se AChR negativo"}]'::jsonb,
  '2026-05-12'::timestamptz, '2026-05-12'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000007', '2026-05-12'::timestamptz, TRUE,
  'Ptose flutuante, diplopia, fadiga muscular ao esforço, fraqueza vespertina',
  'Mulher de 38 anos com ptose palpebral que piora ao fim do dia, diplopia intermitente e fraqueza que melhora com repouso.',
  'em_analise'
);

-- =============================================================================
-- Caso 8: Ataxia de Friedreich (finalizado)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000008', :'demo_id',
  'Gabriel Teixeira', 'demo_hash_008', '19 anos', 'masculino', 'Fortaleza, CE', 'neurologia',
  'Pais consanguíneos (primos de primeiro grau).',
  'finalizado',
  '[{"id":"hip-022","nome":"Ataxia de Friedreich","probabilidade":62,"evidencias":["Ataxia de marcha progressiva (freq: 100%)","Disartria (freq: 90%)","Escoliose (freq: 55%)","Arreflexia (freq: 55%)","Consanguinidade (herança AR)"],"investigacoes":[]},{"id":"hip-023","nome":"Ataxia com deficiência de vitamina E","probabilidade":22,"evidencias":["Ataxia (freq: 90%)","Arreflexia (freq: 90%)","Escoliose (freq: 55%)"],"investigacoes":[{"id":"inv-041","tipo":"exame","descricao":"Vitamina E sérica"}]},{"id":"hip-024","nome":"Ataxia espinocerebelosa (SCA)","probabilidade":16,"evidencias":["Ataxia de marcha (freq: 55%)","Disartria (freq: 55%)"],"investigacoes":[{"id":"inv-043","tipo":"exame","descricao":"Painel genético SCAs"}]}]'::jsonb,
  '[{"id":"inv-038","tipo":"exame","descricao":"Teste genético expansão GAA (gene FXN)"},{"id":"inv-039","tipo":"exame","descricao":"Ecocardiograma (miocardiopatia hipertrófica)"},{"id":"inv-041","tipo":"exame","descricao":"Vitamina E sérica"},{"id":"inv-043","tipo":"exame","descricao":"Painel genético SCAs"}]'::jsonb,
  '2026-05-16'::timestamptz, '2026-05-17'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000008', '2026-05-16'::timestamptz, TRUE,
  'Ataxia de marcha progressiva, arreflexia, disartria, escoliose',
  'Adolescente de 19 anos com instabilidade de marcha progressiva desde os 13 anos, arreflexia em membros inferiores, disartria e escoliose. Pais consanguíneos.',
  'finalizado'
);

-- =============================================================================
-- Caso 9: Esclerose Múltipla (em_analise)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000009', :'demo_id',
  'Isabela Ferreira', 'demo_hash_009', '31 anos', 'feminino', 'Florianópolis, SC', 'neurologia',
  'Tia materna com lúpus eritematoso sistêmico.',
  'em_analise',
  '[{"id":"hip-025","nome":"Esclerose Múltipla","probabilidade":74,"evidencias":["Neurite óptica (freq: 55%)","Parestesias disseminadas","Fadiga crônica (freq: 55%)","Surtos e remissões típicas","Idade e sexo compatíveis"],"investigacoes":[{"id":"inv-044","tipo":"exame","descricao":"RNM de crânio e medula com gadolínio"}]},{"id":"hip-026","nome":"Neuromielite óptica (Devic)","probabilidade":16,"evidencias":["Neurite óptica bilateral","Mielite transversa"],"investigacoes":[{"id":"inv-045","tipo":"exame","descricao":"Anticorpo anti-aquaporina 4"}]},{"id":"hip-027","nome":"Deficiência de vitamina B12","probabilidade":10,"evidencias":["Parestesias","Fadiga","Necessário dosagem sérica"],"investigacoes":[{"id":"inv-046","tipo":"exame","descricao":"Vitamina B12 e ácido metilmalônico"}]}]'::jsonb,
  '[{"id":"inv-044","tipo":"exame","descricao":"RNM de crânio e medula com gadolínio"},{"id":"inv-045","tipo":"exame","descricao":"Anticorpo anti-aquaporina 4"},{"id":"inv-046","tipo":"exame","descricao":"Vitamina B12 e ácido metilmalônico"},{"id":"inv-047","tipo":"exame","descricao":"Líquor com bandas oligoclonais"}]'::jsonb,
  '2026-05-20'::timestamptz, '2026-05-20'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000009', '2026-05-20'::timestamptz, TRUE,
  'Visão turva unilateral, parestesias em membros inferiores, fadiga intensa, episódios prévios de dormência',
  'Mulher de 31 anos com episódio de perda visual no olho esquerdo há 3 semanas com recuperação parcial. Relata episódio prévio de dormência em pernas há 1 ano que resolveu espontaneamente. Fadiga crônica importante.',
  'em_analise'
);

-- =============================================================================
-- Caso 10: Porfiria Aguda Intermitente (aguardando_exames)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000010', :'demo_id',
  'Juliana Costa', 'demo_hash_010', '27 anos', 'feminino', 'Brasília, DF', 'clinica_geral',
  'Avó materna com crises de dor abdominal inexplicadas.',
  'aguardando_exames',
  '[{"id":"hip-028","nome":"Porfiria Aguda Intermitente","probabilidade":68,"evidencias":["Dor abdominal recorrente intensa","Neuropatia periférica (freq: 55%)","Sintomas psiquiátricos (freq: 55%)","Urina escurecida (freq: 90%)","Sexo feminino, idade fértil"],"investigacoes":[{"id":"inv-048","tipo":"exame","descricao":"Porfobilinogênio urinário (PBG)"}]},{"id":"hip-029","nome":"Tirosinemia tipo 1","probabilidade":18,"evidencias":["Dor abdominal (freq: 55%)","Neuropatia periférica (freq: 55%)"],"investigacoes":[]},{"id":"hip-030","nome":"Saturnismo (intoxicação por chumbo)","probabilidade":14,"evidencias":["Dor abdominal","Neuropatia periférica","Alterações psiquiátricas"],"investigacoes":[{"id":"inv-049","tipo":"exame","descricao":"Chumbo sérico e ALA urinário"}]}]'::jsonb,
  '[{"id":"inv-048","tipo":"exame","descricao":"Porfobilinogênio urinário (PBG) durante crise"},{"id":"inv-049","tipo":"exame","descricao":"Chumbo sérico e ALA urinário"},{"id":"inv-050","tipo":"exame","descricao":"Teste genético HMBS"},{"id":"inv-051","tipo":"pergunta","descricao":"Relação das crises com ciclo menstrual ou medicamentos"}]'::jsonb,
  '2026-05-25'::timestamptz, '2026-05-28'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000010', '2026-05-25'::timestamptz, TRUE,
  'Dor abdominal intensa recorrente, fraqueza em membros, confusão mental, urina escurecida',
  'Mulher de 27 anos com 4 episódios de dor abdominal intensa nos últimos 6 meses, sem causa cirúrgica identificada. No último episódio apresentou fraqueza em membros superiores e confusão. Notou urina avermelhada durante as crises. Crises parecem piorar no período pré-menstrual.',
  'aguardando_exames'
);

-- =============================================================================
-- Caso 11: Doença de Huntington (em_analise)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000011', :'demo_id',
  'Roberto Almeida', 'demo_hash_011', '44 anos', 'masculino', 'Manaus, AM', 'neurologia',
  'Pai faleceu aos 52 anos com quadro demencial e movimentos involuntários. Avô paterno com quadro semelhante.',
  'em_analise',
  '[{"id":"hip-031","nome":"Doença de Huntington","probabilidade":79,"evidencias":["Coreia (freq: 90%)","Alteração de personalidade (freq: 90%)","Declínio cognitivo (freq: 55%)","Histórico familiar autossômico dominante","Idade de início compatível"],"investigacoes":[{"id":"inv-052","tipo":"exame","descricao":"Teste genético HTT (expansão CAG)"}]},{"id":"hip-032","nome":"Neuroacantocitose","probabilidade":13,"evidencias":["Coreia (freq: 90%)","Alterações comportamentais (freq: 55%)","Discinesias orofaciais"],"investigacoes":[{"id":"inv-053","tipo":"exame","descricao":"Esfregaço de sangue periférico (acantócitos)"}]},{"id":"hip-033","nome":"Doença de Wilson (tardia)","probabilidade":8,"evidencias":["Movimentos involuntários","Alteração comportamental","Necessário descartar"],"investigacoes":[{"id":"inv-054","tipo":"exame","descricao":"Ceruloplasmina sérica"}]}]'::jsonb,
  '[{"id":"inv-052","tipo":"exame","descricao":"Teste genético HTT (expansão CAG > 36 repeats)"},{"id":"inv-053","tipo":"exame","descricao":"Esfregaço de sangue periférico"},{"id":"inv-054","tipo":"exame","descricao":"Ceruloplasmina sérica"},{"id":"inv-055","tipo":"exame","descricao":"RNM de crânio (atrofia do caudado)"}]'::jsonb,
  '2026-05-30'::timestamptz, '2026-05-30'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000011', '2026-05-30'::timestamptz, TRUE,
  'Movimentos involuntários coreiformes, irritabilidade, lapsos de memória, dificuldade no trabalho',
  'Homem de 44 anos com movimentos involuntários em membros há 1 ano, progressivos. Esposa relata irritabilidade crescente e esquecimentos frequentes. Demitido do trabalho por baixo rendimento. Pai faleceu com quadro semelhante.',
  'em_analise'
);

-- =============================================================================
-- Caso 12: Síndrome de Marfan (aguardando_exames)
-- =============================================================================
INSERT INTO casos (id, medico_id, paciente_nome, paciente_cpf_hash, paciente_idade, paciente_sexo, paciente_regiao, paciente_especialidade, historico_familiar, status, hipoteses, investigacoes, criado_em, atualizado_em)
VALUES (
  'a0000001-0000-0000-0000-000000000012', :'demo_id',
  'Lucas Barbosa', 'demo_hash_012', '22 anos', 'masculino', 'Goiânia, GO', 'cardiologia',
  'Mãe alta com prolapso de válvula mitral. Tio materno operou aorta aos 35 anos.',
  'aguardando_exames',
  '[{"id":"hip-034","nome":"Síndrome de Marfan","probabilidade":82,"evidencias":["Estatura alta e longilínea","Aracnodactilia (freq: 90%)","Ectopia lentis (freq: 55%)","Dilatação da raiz aórtica","Histórico familiar compatível"],"investigacoes":[{"id":"inv-056","tipo":"exame","descricao":"Ecocardiograma com medida da raiz aórtica"}]},{"id":"hip-035","nome":"Síndrome de Loeys-Dietz","probabilidade":12,"evidencias":["Aneurisma aórtico","Hipermobilidade articular","Sem ectopia lentis típica"],"investigacoes":[{"id":"inv-057","tipo":"exame","descricao":"Teste genético TGFBR1/TGFBR2"}]},{"id":"hip-036","nome":"Homocistinúria","probabilidade":6,"evidencias":["Estatura alta","Ectopia lentis","Hábito marfanoide"],"investigacoes":[{"id":"inv-058","tipo":"exame","descricao":"Homocisteína plasmática"}]}]'::jsonb,
  '[{"id":"inv-056","tipo":"exame","descricao":"Ecocardiograma com medida da raiz aórtica (Z-score)"},{"id":"inv-057","tipo":"exame","descricao":"Teste genético FBN1 / TGFBR1/TGFBR2"},{"id":"inv-058","tipo":"exame","descricao":"Homocisteína plasmática"},{"id":"inv-059","tipo":"exame","descricao":"Avaliação oftalmológica (subluxação de cristalino)"}]'::jsonb,
  '2026-06-01'::timestamptz, '2026-06-03'::timestamptz
);

INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000012', '2026-06-01'::timestamptz, TRUE,
  'Estatura alta desproporcional, dedos longos, dor torácica leve, subluxação de cristalino',
  'Homem de 22 anos, 1,96m, envergadura maior que altura, encaminhado pela oftalmologia após achado de subluxação de cristalino bilateral. Ecocardiograma mostrou raiz aórtica de 42mm. Mãe com fenótipo semelhante.',
  'aguardando_exames'
);

-- Retorno de consulta no caso 12
INSERT INTO consultas (caso_id, data, primeira_consulta, sintomas, evolucao, status)
VALUES (
  'a0000001-0000-0000-0000-000000000012', '2026-06-03'::timestamptz, FALSE,
  'Retorno com exames complementares',
  'Score sistêmico de Ghent: 9 pontos. AngioTC confirmou dilatação aórtica (Z-score 3.2). Aguardando resultado do teste genético FBN1.',
  'aguardando_exames'
);

-- =============================================================================
-- Resultado
-- =============================================================================
SELECT
  count(*) AS total_casos,
  count(*) FILTER (WHERE status = 'em_analise') AS em_analise,
  count(*) FILTER (WHERE status = 'aguardando_exames') AS aguardando,
  count(*) FILTER (WHERE status = 'finalizado') AS finalizados
FROM casos WHERE medico_id = :'demo_id';
