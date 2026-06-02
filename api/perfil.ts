import { sql } from './_lib/sql'
import { verificarMedico, respostaNaoAutorizado, NaoAutorizado, type Medico } from './_lib/auth'

export const config = { runtime: 'edge' }

type AtualizarBody = {
  nome?: string
  crm?: string
  uf?: string
  especialidade?: string
  nomeClinica?: string
}

export default async function handler(request: Request): Promise<Response> {
  let medico: Medico
  try {
    medico = await verificarMedico(request)
  } catch (error) {
    if (error instanceof NaoAutorizado) return respostaNaoAutorizado()
    throw error
  }

  if (request.method === 'GET') return obter(medico)
  if (request.method === 'PUT') return atualizar(request, medico)
  return Response.json({ error: 'metodo nao permitido' }, { status: 405 })
}

async function obter(medico: Medico): Promise<Response> {
  try {
    await sql`
      INSERT INTO medicos (id, nome, email, organizacao_id, is_admin)
      VALUES (
        ${medico.id},
        ${medico.nome},
        ${medico.email},
        ${'org-' + crypto.randomUUID()},
        TRUE
      )
      ON CONFLICT (id) DO NOTHING
    `
    const rows = await sql`
      SELECT
        id, nome, email, crm, uf, especialidade,
        nome_clinica   AS "nomeClinica",
        is_admin       AS "isAdmin",
        organizacao_id AS "organizacaoId"
      FROM medicos WHERE id = ${medico.id}
    `
    return Response.json(rows[0])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}

async function atualizar(request: Request, medico: Medico): Promise<Response> {
  const body = (await request.json()) as AtualizarBody

  if (!body.crm?.trim() || !body.especialidade?.trim()) {
    return Response.json(
      { error: 'CRM e especialidade sao obrigatorios' },
      { status: 400 },
    )
  }

  try {
    const rows = await sql`
      UPDATE medicos SET
        nome          = COALESCE(${body.nome ?? null}, nome),
        crm           = ${body.crm},
        uf            = ${body.uf ?? ''},
        especialidade = ${body.especialidade},
        nome_clinica  = ${body.nomeClinica ?? ''}
      WHERE id = ${medico.id}
      RETURNING
        id, nome, email, crm, uf, especialidade,
        nome_clinica   AS "nomeClinica",
        is_admin       AS "isAdmin",
        organizacao_id AS "organizacaoId"
    `
    if (rows.length === 0) {
      return Response.json({ error: 'medico nao encontrado' }, { status: 404 })
    }
    return Response.json(rows[0])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
