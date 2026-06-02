const pepper = process.env.CPF_PEPPER

if (!pepper) {
  throw new Error(
    'CPF_PEPPER nao definida. Configure em .env.local (dev) ou nas env vars da Vercel (prod)',
  )
}

const encoder = new TextEncoder()

export async function hashCpf(cpf: string): Promise<string> {
  const digitos = cpf.replace(/\D/g, '')
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(pepper),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const assinatura = await crypto.subtle.sign('HMAC', key, encoder.encode(digitos))
  return [...new Uint8Array(assinatura)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
