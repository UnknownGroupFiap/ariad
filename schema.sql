CREATE TABLE IF NOT EXISTS medicos (
  id              TEXT PRIMARY KEY,
  nome            TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  crm             TEXT NOT NULL DEFAULT '',
  uf              TEXT NOT NULL DEFAULT '',
  especialidade   TEXT NOT NULL DEFAULT '',
  nome_clinica    TEXT NOT NULL DEFAULT '',
  is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
  organizacao_id  TEXT NOT NULL,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS casos (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medico_id                TEXT NOT NULL REFERENCES medicos(id),
  paciente_nome            TEXT NOT NULL,
  paciente_cpf_hash        TEXT NOT NULL,
  paciente_idade           TEXT NOT NULL,
  paciente_sexo            TEXT NOT NULL CHECK (paciente_sexo IN ('masculino','feminino','outro')),
  paciente_regiao          TEXT NOT NULL,
  paciente_especialidade   TEXT NOT NULL,
  historico_familiar       TEXT NOT NULL,
  status                   TEXT NOT NULL CHECK (status IN ('em_analise','aguardando_exames','finalizado')),
  hipoteses                JSONB NOT NULL DEFAULT '[]'::jsonb,
  investigacoes            JSONB NOT NULL DEFAULT '[]'::jsonb,
  criado_em                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS casos_medico_id_idx ON casos (medico_id);
CREATE INDEX IF NOT EXISTS casos_cpf_hash_idx ON casos (paciente_cpf_hash);

CREATE TABLE IF NOT EXISTS consultas (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caso_id             UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
  data                TIMESTAMPTZ NOT NULL,
  primeira_consulta   BOOLEAN NOT NULL DEFAULT FALSE,
  sintomas            TEXT NOT NULL,
  evolucao            TEXT NOT NULL,
  status              TEXT CHECK (status IN ('em_analise','aguardando_exames','finalizado')),
  transcricao         TEXT
);

CREATE INDEX IF NOT EXISTS consultas_caso_id_idx ON consultas (caso_id);
