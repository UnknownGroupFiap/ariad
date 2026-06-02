import { createRemoteJWKSet, jwtVerify } from 'jose'

const authUrl = (
  process.env.NEON_AUTH_BASE_URL ||
  process.env.NEON_AUTH_URL ||
  ''
).trim()

if (!authUrl) {
  throw new Error(
    'NEON_AUTH_BASE_URL nao definida. Configure em .env.local (dev) ou nas env vars da Vercel (prod).',
  )
}

const jwksUrl = (
  process.env.NEON_AUTH_JWKS_URL ||
  `${authUrl.replace(/\/$/, '')}/.well-known/jwks.json`
).trim()
const jwks = createRemoteJWKSet(new URL(jwksUrl))

export type Medico = { id: string; email: string; nome: string }

export class NaoAutorizado extends Error {}

export async function verificarMedico(request: Request): Promise<Medico> {
  const header = request.headers.get('authorization') ?? ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    throw new NaoAutorizado('token ausente')
  }

  try {
    const { payload } = await jwtVerify(token, jwks)
    if (!payload.sub) throw new NaoAutorizado('token sem sub')
    return {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
      nome: typeof payload.name === 'string' ? payload.name : '',
    }
  } catch (error) {
    if (error instanceof NaoAutorizado) throw error
    throw new NaoAutorizado('token invalido')
  }
}

export function respostaNaoAutorizado(): Response {
  return Response.json({ error: 'nao autorizado' }, { status: 401 })
}
