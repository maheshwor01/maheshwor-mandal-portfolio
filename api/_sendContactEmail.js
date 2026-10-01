// Shared logic for handling a contact-form submission and emailing it via Resend.
import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_TO = '345mandalmahesh@gmail.com'
const DEFAULT_FROM = 'Portfolio Contact Form <onboarding@resend.dev>'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatSubmittedAt(date) {
  const iso = date.toISOString()
  let kathmandu = iso
  try {
    kathmandu = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kathmandu',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(date)
  } catch {
    kathmandu = date.toUTCString()
  }
  return { iso, display: kathmandu }
}

export function validateContactPayload(payload) {
  const { name, email, subject, message } = payload || {}

  const cleanName = typeof name === 'string' ? name.trim() : ''
  const cleanEmail = typeof email === 'string' ? email.trim() : ''
  const cleanSubject = typeof subject === 'string' ? subject.trim() : ''
  const cleanMessage = typeof message === 'string' ? message.trim() : ''

  const errors = {}
  if (!cleanName) errors.name = 'Name is required.'
  else if (cleanName.length > 120) errors.name = 'Name is too long.'
  if (!cleanEmail) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(cleanEmail)) errors.email = 'Enter a valid email address.'
  if (!cleanSubject) errors.subject = 'Subject is required.'
  else if (cleanSubject.length > 200) errors.subject = 'Subject is too long.'
  if (!cleanMessage) errors.message = 'Message is required.'
  else if (cleanMessage.length < 10) errors.message = 'Message is too short — add a bit more detail.'
  else if (cleanMessage.length > 5000) errors.message = 'Message is too long.'

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    fields: {
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    },
  }
}

export async function sendContactEmail(fields, env = {}) {
  const apiKey = env.RESEND_API_KEY
  const toAddress = env.CONTACT_TO_EMAIL || DEFAULT_TO
  const fromAddress = env.RESEND_FROM || DEFAULT_FROM

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set. Add it to the host environment variables.')
    return {
      ok: false,
      statusCode: 500,
      error: 'Email service is not configured on the server.',
    }
  }

  const submittedAt = formatSubmittedAt(new Date())
  const resend = new Resend(apiKey)
  const finalSubject = fields.subject

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: fields.email,
      subject: `[Portfolio] ${finalSubject}`,
      text: [
        `New portfolio contact form submission`,
        ``,
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Subject: ${finalSubject}`,
        `Submitted: ${submittedAt.display}`,
        `Submitted (UTC): ${submittedAt.iso}`,
        ``,
        `Message:`,
        fields.message,
        ``,
        `Reply directly to this email to respond to ${fields.name}.`,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #1a1a1a; line-height: 1.5;">
          <h2 style="color: #111; font-size: 18px;">New portfolio inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(fields.email)}">${escapeHtml(fields.email)}</a></p>
          <p><strong>Subject:</strong> ${escapeHtml(finalSubject)}</p>
          <p><strong>Submitted:</strong> ${escapeHtml(submittedAt.display)}</p>
          <p><strong>Submitted (UTC):</strong> ${escapeHtml(submittedAt.iso)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f6f6f6; padding: 12px 14px; border-radius: 8px;">${escapeHtml(fields.message)}</p>
          <p style="color: #555; font-size: 13px;">Reply to this email to respond directly to ${escapeHtml(fields.name)}.</p>
        </div>
      `,
    })

    if (error) {
      console.error('[contact] Resend rejected the email:', error)
      return {
        ok: false,
        statusCode: 502,
        error: 'The email service rejected the message. Please try again later.',
        submittedAt,
      }
    }

    console.log(`[contact] Email accepted by Resend. id=${data?.id} to=${toAddress}`)
    return { ok: true, id: data?.id, submittedAt }
  } catch (err) {
    console.error('Unexpected error sending email:', err)
    return {
      ok: false,
      statusCode: 500,
      error: 'Unexpected server error. Please try again later.',
      submittedAt,
    }
  }
}
