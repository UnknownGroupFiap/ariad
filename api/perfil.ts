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
    const orgId = 'org-' + crypto.randomUUID()
    await sql`
      INSERT INTO medicos (id, nome, email, organizacao_id, is_admin)
      VALUES (${medico.id}, ${medico.nome}, ${medico.email}, ${orgId}, TRUE)
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
    const orgId = 'org-' + crypto.randomUUID()
    const rows = await sql`
      INSERT INTO medicos (id, nome, email, crm, uf, especialidade, nome_clinica, organizacao_id, is_admin)
      VALUES (
        ${medico.id}, ${body.nome ?? medico.nome}, ${medico.email},
        ${body.crm}, ${body.uf ?? ''}, ${body.especialidade}, ${body.nomeClinica ?? ''},
        ${orgId}, TRUE
      )
      ON CONFLICT (id) DO UPDATE SET
        nome          = COALESCE(EXCLUDED.nome, medicos.nome),
        crm           = EXCLUDED.crm,
        uf            = EXCLUDED.uf,
        especialidade = EXCLUDED.especialidade,
        nome_clinica  = EXCLUDED.nome_clinica
      RETURNING
        id, nome, email, crm, uf, especialidade,
        nome_clinica   AS "nomeClinica",
        is_admin       AS "isAdmin",
        organizacao_id AS "organizacaoId"
    `
    return Response.json(rows[0])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ error: message }, { status: 500 })
  }
}
