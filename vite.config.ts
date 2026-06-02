import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage } from 'http'
import fs from 'fs'
import path from 'path'

const apiDir = path.resolve(__dirname, 'api')

function resolverArquivoApi(pathname: string): string | null {
  const segs = pathname
    .replace(/^\/api\//, '')
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean)

  let dir = apiDir
  for (let i = 0; i < segs.length; i++) {
    const ultimo = i === segs.length - 1
    const entradas = fs.readdirSync(dir)
    if (ultimo) {
      const literal = entradas.find((e) => e === `${segs[i]}.ts`)
      if (literal) return path.join(dir, literal)
      const param = entradas.find((e) => /^\[.+\]\.ts$/.test(e))
      return param ? path.join(dir, param) : null
    }
    if (entradas.includes(segs[i]) && fs.statSync(path.join(dir, segs[i])).isDirectory()) {
      dir = path.join(dir, segs[i])
      continue
    }
    const paramDir = entradas.find(
      (e) => /^\[.+\]$/.test(e) && fs.statSync(path.join(dir, e)).isDirectory(),
    )
    if (!paramDir) return null
    dir = path.join(dir, paramDir)
  }
  return null
}

function lerBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function apiDevServer(): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        const arquivo = resolverArquivoApi(new URL(req.url, 'http://localhost').pathname)
        if (!arquivo) return next()

        try {
          const mod = await server.ssrLoadModule(arquivo)
          const handler = mod.default as (request: Request) => Promise<Response>

          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) {
            if (Array.isArray(v)) v.forEach((x) => headers.append(k, x))
            else if (v != null) headers.set(k, v)
          }

          const comBody = !['GET', 'HEAD'].includes(req.method ?? 'GET')
          const body = comBody ? await lerBody(req) : undefined

          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers,
            body: body && body.length ? body : undefined,
          })

          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevServer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
})

