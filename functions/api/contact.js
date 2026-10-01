import { sendContactEmail, validateContactPayload } from '../../api/_sendContactEmail.js'

export async function onRequest(context) {
  const { request, env } = context

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }

  let payload = {}
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const validated = validateContactPayload(payload)
  if (!validated.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Please fix the highlighted fields.',
        fieldErrors: validated.errors,
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const sent = await sendContactEmail(validated.fields, env)
  if (!sent.ok) {
    return new Response(JSON.stringify({ success: false, error: sent.error }), {
      status: sent.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true, id: sent.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
