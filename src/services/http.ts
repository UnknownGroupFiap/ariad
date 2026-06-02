import { obterToken } from '@/lib/auth-client'

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await obterToken()
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Erro ${response.status}`)
  }
  return response.json() as Promise<T>
}
