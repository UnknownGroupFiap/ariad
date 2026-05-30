import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL nao definida. Configure em .env.local (dev) ou nas env vars da Vercel (prod).',
  )
}

export const sql = neon(databaseUrl)
