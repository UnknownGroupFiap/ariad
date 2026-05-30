import { sql } from './_lib/sql'

export const config = { runtime: 'edge' }

export default async function handler(_request: Request): Promise<Response> {
  try {
    await sql`select 1`
    return Response.json({ health: 'ok' })
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'erro desconhecido'
    return Response.json({ health: 'fail', erro: mensagem }, { status: 500 })
  }
}
