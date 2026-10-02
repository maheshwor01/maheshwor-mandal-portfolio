// Cloudflare Worker: contact form only.
//   POST /api/contact  -> validates the form and emails it through Resend
//   everything else    -> served from the built site in ./dist (ASSETS binding)
//
// Needs these set in Cloudflare (Worker -> Settings -> Variables and Secrets):
//   RESEND_API_KEY    (Secret)  your Resend API key
//   CONTACT_TO_EMAIL  (Text)    where messages are delivered (optional)

const DEFAULT_TO = '345mandalmahesh@gmail.com'
const FROM = 'Portfolio Contact Form <onboarding@resend.dev>'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  })

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

function validate(p) {
  const clean = (v) => (typeof v === 'string' ? v.trim() : '')
  const f = { name: clean(p?.name), email: clean(p?.email), subject: clean(p?.subject), message: clean(p?.message) }
  const e = {}
  if (!f.name) e.name = 'Name is required.'
  else if (f.name.length > 120) e.name = 'Name is too long.'
  if (!f.email) e.email = 'Email is required.'
  else if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address.'
  if (!f.subject) e.subject = 'Subject is required.'
  else if (f.subject.length > 200) e.subject = 'Subject is too long.'
  if (!f.message) e.message = 'Message is required.'
  else if (f.message.length < 10) e.message = 'Message is too short — add a bit more detail.'
  else if (f.message.length > 5000) e.message = 'Message is too long.'
  return { fields: f, errors: e }
}

async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' })
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ success: false, error: 'Invalid request body.' }, 400)
  }

  const { fields, errors } = validate(payload)
  if (Object.keys(errors).length) {
    return json({ success: false, error: 'Please fix the highlighted fields.', fieldErrors: errors }, 400)
  }

  if (!env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is missing in the Worker settings.')
    return json({ success: false, error: 'Email service is not configured on the server.' }, 500)
  }

  const to = env.CONTACT_TO_EMAIL || DEFAULT_TO
  const when = new Date().toUTCString()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: fields.email,
        subject: `[Portfolio] ${fields.subject}`,
        text: `New portfolio contact form submission\n\nName: ${fields.name}\nEmail: ${fields.email}\nSubject: ${fields.subject}\nSubmitted (UTC): ${when}\n\nMessage:\n${fields.message}\n`,
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a">
          <h2 style="font-size:18px">New portfolio inquiry</h2>
          <p><strong>Name:</strong> ${esc(fields.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${esc(fields.email)}">${esc(fields.email)}</a></p>
          <p><strong>Subject:</strong> ${esc(fields.subject)}</p>
          <p><strong>Submitted (UTC):</strong> ${esc(when)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;background:#f6f6f6;padding:12px 14px;border-radius:8px">${esc(fields.message)}</p>
        </div>`,
      }),
    })

    if (!res.ok) {
      console.error('[contact] Resend rejected the email:', res.status, await res.text())
      return json({ success: false, error: 'The email service rejected the message. Please try again later.' }, 502)
    }

    const data = await res.json().catch(() => ({}))
    console.log(`[contact] Email accepted by Resend. id=${data?.id} to=${to}`)
    return json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return json({ success: false, error: 'Unexpected server error. Please try again later.' }, 500)
  }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/api/contact') return handleContact(request, env)
    return env.ASSETS.fetch(request)
  },
}
