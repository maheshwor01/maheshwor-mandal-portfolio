import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { sendContactEmail, validateContactPayload } from './api/_sendContactEmail.js'

function contactApiPlugin(env) {
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Method not allowed.' }))
          return
        }

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        let payload = {}
        try {
          payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Invalid request body.' }))
          return
        }

        const validated = validateContactPayload(payload)
        if (!validated.ok) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              success: false,
              error: 'Please fix the highlighted fields.',
              fieldErrors: validated.errors,
            }),
          )
          return
        }

        const sent = await sendContactEmail(validated.fields, env)
        if (!sent.ok) {
          res.statusCode = sent.statusCode || 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: sent.error }))
          return
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: true, id: sent.id }))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.RESEND_API_KEY) {
    console.log('[contact] .env loaded: RESEND_API_KEY found.')
  } else {
    console.warn(
      `[contact] RESEND_API_KEY NOT found. Looked for a ".env" file in: ${process.cwd()}\n` +
        '          Create it there (file name exactly ".env"), add RESEND_API_KEY=re_..., then restart.',
    )
  }
  return {
    plugins: [react(), contactApiPlugin(env)],
    server: {
      port: 5173,
      strictPort: false,
    },
  }
})
