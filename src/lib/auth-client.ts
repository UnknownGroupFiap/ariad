import { createAuthClient } from '@neondatabase/auth'
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL

if (!authUrl) {
  throw new Error('VITE_NEON_AUTH_URL nao definida. Configure em .env.local.')
}

export const authClient = createAuthClient(authUrl, {
  adapter: BetterAuthReactAdapter(),
})

export async function obterToken(): Promise<string | null> {
  const session = await authClient.getSession()
  const token = (session.data?.session as { token?: string } | undefined)?.token
  return token ?? null
}
