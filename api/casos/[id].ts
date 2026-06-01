import { sql } from '../_lib/sql'

export const config = { runtime: 'edge' }

type AtualizarBody = {
  medicoId: string
  status?: 'em_analise' | 'aguardando_exames' | 'finalizado'
}

function extrairId(request: Request): string {
  return new URL(request.url).pathname.split('/')[3] ?? ''
}

export default async function handler(request: Request): Promise<Response> {
  const id = extrairId(request)
  if (!id) {
    return Response.json({ error: 'id obrigatorio' }, { status: 400 })
  }

  if (request.method === 'GET') return obter(request, id)
  if (request.method === 'PATCH') return atualizar(request, id)
  return Response.json({ error: 'metodo nao permitido' }, { status: 405 })
}

async function obter(request: Request, id: string): Promise<Response> {
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
        c.status, c.hipoteses, c.investigacoes,
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
      WHERE c.id = ${id} AND c.medico_id = ${medicoId}
      LIMIT 1
    `

    if (rows.length === 0) {
      return Response.json({ error: 'caso nao encontrado' }, { status: 404 })
    }

    return Response.json(rows[0])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}

async function atualizar(request: Request, id: string): Promise<Response> {
  const body = (await request.json()) as AtualizarBody

  if (!body.medicoId) {
    return Response.json({ error: 'medicoId obrigatorio' }, { status: 400 })
  }

  try {
    const rows = await sql`
      UPDATE casos SET
        status        = COALESCE(${body.status ?? null}, status),
        atualizado_em = NOW()
      WHERE id = ${id} AND medico_id = ${body.medicoId}
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

    if (rows.length === 0) {
      return Response.json({ error: 'caso nao encontrado' }, { status: 404 })
    }

    const consultaRows = await sql`
      SELECT
        id, data,
        primeira_consulta AS "primeiraConsulta",
        sintomas, evolucao, status, transcricao
      FROM consultas
      WHERE caso_id = ${id}
      ORDER BY data ASC
    `

    return Response.json({ ...rows[0], consultas: consultaRows })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
