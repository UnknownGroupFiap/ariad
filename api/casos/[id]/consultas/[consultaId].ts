import { sql } from '../../../_lib/sql'
import { verificarMedico, respostaNaoAutorizado, NaoAutorizado, type Medico } from '../../../_lib/auth'

export const config = { runtime: 'edge' }

type Body = {
  transcricao?: string
}

function extrairIds(request: Request): { casoId: string; consultaId: string } {
  const parts = new URL(request.url).pathname.split('/')
  return { casoId: parts[3] ?? '', consultaId: parts[5] ?? '' }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'PATCH') {
    return Response.json({ error: 'metodo nao permitido' }, { status: 405 })
  }

  let medico: Medico
  try {
    medico = await verificarMedico(request)
  } catch (error) {
    if (error instanceof NaoAutorizado) return respostaNaoAutorizado()
    throw error
  }

  const { casoId, consultaId } = extrairIds(request)
  if (!casoId || !consultaId) {
    return Response.json({ error: 'ids obrigatorios' }, { status: 400 })
  }

  const body = (await request.json()) as Body

  try {
    const dono = await sql`
      SELECT 1 FROM casos WHERE id = ${casoId} AND medico_id = ${medico.id} LIMIT 1
    `
    if (dono.length === 0) {
      return Response.json({ error: 'caso nao encontrado' }, { status: 404 })
    }

    const updated = await sql`
      UPDATE consultas SET
        transcricao = COALESCE(${body.transcricao ?? null}, transcricao)
      WHERE id = ${consultaId} AND caso_id = ${casoId}
      RETURNING id
    `
    if (updated.length === 0) {
      return Response.json({ error: 'consulta nao encontrada' }, { status: 404 })
    }

    await sql`
      UPDATE casos SET atualizado_em = NOW() WHERE id = ${casoId}
    `

    const casoRows = await sql`
      SELECT
        id,
        medico_id              AS "medicoId",
        paciente_nome          AS "pacienteNome",
        paciente_idade         AS "pacienteIdade",
        paciente_sexo          AS "pacienteSexo",
        paciente_regiao        AS "pacienteRegiao",
        paciente_especialidade AS "pacienteEspecialidade",
        historico_familiar     AS "historicoFamiliar",
        status, hipoteses, investigacoes,
        criado_em              AS "criadoEm",
        atualizado_em          AS "atualizadoEm"
      FROM casos
      WHERE id = ${casoId}
    `

    const consultaRows = await sql`
      SELECT
        id, data,
        primeira_consulta AS "primeiraConsulta",
        sintomas, evolucao, status, transcricao
      FROM consultas
      WHERE caso_id = ${casoId}
      ORDER BY data ASC
    `

    return Response.json({ ...casoRows[0], consultas: consultaRows })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
