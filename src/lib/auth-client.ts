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
  try {
    const session = await Promise.race([
      authClient.getSession(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('session timeout')), 5000),
      ),
    ])
    const sessionObj = session.data?.session as Record<string, unknown> | undefined
    return typeof sessionObj?.token === 'string' ? sessionObj.token : null
  } catch {
    return null
  }
}
