import { sql } from './_lib/sql'

export const config = { runtime: 'edge' }

export default async function handler(_request: Request): Promise<Response> {
  try {
    await sql`select 1`
    return Response.json({ health: 'ok' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    return Response.json({ health: 'fail', error: message }, { status: 500 })
  }
}
