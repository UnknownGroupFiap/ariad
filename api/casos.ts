import { sql } from './_lib/sql'
import { gerarDiagnostico } from './_lib/motor'

export const config = { runtime: 'edge' }

type DadosPaciente = {
  pacienteNome: string
  pacienteCpf: string
  pacienteIdade: string
  pacienteSexo: 'masculino' | 'feminino' | 'outro'
  pacienteRegiao: string
  pacienteEspecialidade: string
  historicoFamiliar: string
}

type CriarCasoBody = DadosPaciente & {
  medicoId: string
  sintomas: string
  evolucao: string
  primeiraConsulta: boolean
  data: string
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'GET') return listar(request)
  if (request.method === 'POST') return criar(request)
  return Response.json({ error: 'metodo nao permitido' }, { status: 405 })
}

async function listar(request: Request): Promise<Response> {
  const medicoId = new URL(request.url).searchParams.get('medicoId')
  if (!medicoId) {
    return Response.json({ error: 'medicoId obrigatorio' }, { status: 400 })
  }

  try {
    const rows = await sql`
      SELECT
        c.id,
        c.medico_id              AS "medicoId",
        c.paciente_nome          AS "pacienteNome",
        c.paciente_cpf           AS "pacienteCpf",
        c.paciente_idade         AS "pacienteIdade",
        c.paciente_sexo          AS "pacienteSexo",
        c.paciente_regiao        AS "pacienteRegiao",
        c.paciente_especialidade AS "pacienteEspecialidade",
        c.historico_familiar     AS "historicoFamiliar",
        c.status,
        c.hipoteses,
        c.investigacoes,
        c.criado_em              AS "criadoEm",
        c.atualizado_em          AS "atualizadoEm",
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', cs.id,
                'data', cs.data,
                'primeiraConsulta', cs.primeira_consulta,
                'sintomas', cs.sintomas,
                'evolucao', cs.evolucao,
                'status', cs.status,
                'transcricao', cs.transcricao
              ) ORDER BY cs.data ASC
            )
            FROM consultas cs
            WHERE cs.caso_id = c.id
          ),
          '[]'::json
        ) AS consultas
      FROM casos c
      WHERE c.medico_id = ${medicoId}
      ORDER BY c.atualizado_em DESC
    `
    return Response.json(rows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}

async function criar(request: Request): Promise<Response> {
  const body = (await request.json()) as CriarCasoBody

  if (
    !body.medicoId ||
    !body.pacienteNome ||
    !body.pacienteCpf ||
    !body.pacienteIdade ||
    !body.pacienteSexo ||
    !body.pacienteRegiao ||
    !body.pacienteEspecialidade ||
    !body.sintomas
  ) {
    return Response.json(
      { error: 'campos obrigatorios faltando' },
      { status: 400 },
    )
  }

  const { hipoteses, investigacoes } = gerarDiagnostico(body.sintomas, body.evolucao)

  try {
    const casoRows = await sql`
      INSERT INTO casos (
        medico_id, paciente_nome, paciente_cpf, paciente_idade,
        paciente_sexo, paciente_regiao, paciente_especialidade,
        historico_familiar, status, hipoteses, investigacoes
      )
      VALUES (
        ${body.medicoId}, ${body.pacienteNome}, ${body.pacienteCpf},
        ${body.pacienteIdade}, ${body.pacienteSexo}, ${body.pacienteRegiao},
        ${body.pacienteEspecialidade}, ${body.historicoFamiliar},
        'em_analise',
        ${JSON.stringify(hipoteses)}::jsonb,
        ${JSON.stringify(investigacoes)}::jsonb
      )
      RETURNING
        id,
        medico_id              AS "medicoId",
        paciente_nome          AS "pacienteNome",
        paciente_cpf           AS "pacienteCpf",
        paciente_idade         AS "pacienteIdade",
        paciente_sexo          AS "pacienteSexo",
        paciente_regiao        AS "pacienteRegiao",
        paciente_especialidade AS "pacienteEspecialidade",
        historico_familiar     AS "historicoFamiliar",
        status, hipoteses, investigacoes,
        criado_em              AS "criadoEm",
        atualizado_em          AS "atualizadoEm"
    `

    const consultaRows = await sql`
      INSERT INTO consultas (
        caso_id, data, primeira_consulta, sintomas, evolucao, status
      )
      VALUES (
        ${casoRows[0].id}, ${body.data}::timestamptz,
        ${body.primeiraConsulta}, ${body.sintomas}, ${body.evolucao}, 'em_analise'
      )
      RETURNING
        id, data,
        primeira_consulta AS "primeiraConsulta",
        sintomas, evolucao, status, transcricao
    `

    return Response.json({ ...casoRows[0], consultas: consultaRows }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
