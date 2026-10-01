import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorText, setErrorText] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Please enter your name.'
    if (!form.email.trim()) errors.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
    if (!form.subject.trim()) errors.subject = 'Please enter a subject.'
    if (!form.message.trim()) errors.message = 'Please enter a message.'
    else if (form.message.trim().length < 10) errors.message = 'Message is too short — add a bit more detail.'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setStatus('error')
      setErrorText('Please fix the highlighted fields below.')
      return
    }

    setStatus('sending')
    setErrorText('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      let result = null
      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (response.ok && result?.success) {
        setStatus('success')
        setFieldErrors({})
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setFieldErrors(result?.fieldErrors || {})
        setErrorText(result?.error || 'Something went wrong sending your message. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorText('Could not reach the server. Check your connection and try again.')
    }
  }

  return (
    <section id="contact" className="section">
      <div className="wrap">
        <div className="eyebrow">// 05 contact</div>
        <h2 className="title">
          Let&apos;s <span className="accent">Connect</span>
        </h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p>
              I&apos;m looking for opportunities to <b>apply my skills in AI and tech</b>, collaborate on exciting
              projects, and grow alongside experienced professionals. Whether you&apos;re <b>hiring</b>, have an exciting
              idea, or simply want to talk technology — I&apos;d love to connect. Let&apos;s build something great
              together.
            </p>
            <div className="contact-links">
              <a className="contact-link" href="mailto:345mandalmahesh@gmail.com">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 6l8 7 8-7" />
                  </svg>
                </span>
                <span className="meta">
                  <small>EMAIL</small>
                  <span>345mandalmahesh@gmail.com</span>
                </span>
              </a>
              <a className="contact-link" href="tel:+9779814778226">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <span className="meta">
                  <small>PHONE</small>
                  <span>+977-9814778226</span>
                </span>
              </a>
              <a className="contact-link" href="https://github.com/maheshwor01" target="_blank" rel="noopener">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.61.69.5C19.13 20.61 22 16.78 22 12.25 22 6.58 17.52 2 12 2z" />
                  </svg>
                </span>
                <span className="meta">
                  <small>GITHUB</small>
                  <span>github.com/maheshwor01</span>
                </span>
              </a>
              <a className="contact-link" href="https://linkedin.com/in/maheshwor-mandal-93040a293" target="_blank" rel="noopener">
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.94 5a2 2 0 11-4-.02 2 2 0 014 .02zM7 8.48H3V21h4V8.48zM13.5 8.48h-3.8V21h3.8v-6.4c0-3.57 4.6-3.86 4.6 0V21H22v-7.2c0-6.2-6.86-5.97-8.5-2.92V8.48z" />
                  </svg>
                </span>
                <span className="meta">
                  <small>LINKEDIN</small>
                  <span>linkedin.com/in/maheshwor-mandal-93040a293</span>
                </span>
              </a>
              <a className="contact-link" href="#" onClick={(e) => e.preventDefault()}>
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <span className="meta">
                  <small>LOCATION</small>
                  <span>New Baneshwor, Kathmandu, Nepal 🇳🇵</span>
                </span>
              </a>
            </div>
          </div>

          <div className="form-card">
            <form id="contactForm" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="cName">Your Name</label>
                <input
                  type="text"
                  id="cName"
                  name="name"
                  placeholder="e.g. Jane Smith"
                  required
                  value={form.name}
                  onChange={handleChange}
                  style={fieldErrors.name ? { borderColor: '#e05555' } : undefined}
                />
                {fieldErrors.name && (
                  <small style={{ color: '#e05555', display: 'block', marginTop: 4 }}>{fieldErrors.name}</small>
                )}
              </div>
              <div className="form-row">
                <label htmlFor="cEmail">Email Address</label>
                <input
                  type="email"
                  id="cEmail"
                  name="email"
                  placeholder="jane@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  style={fieldErrors.email ? { borderColor: '#e05555' } : undefined}
                />
                {fieldErrors.email && (
                  <small style={{ color: '#e05555', display: 'block', marginTop: 4 }}>{fieldErrors.email}</small>
                )}
              </div>
              <div className="form-row">
                <label htmlFor="cSubject">Subject</label>
                <input
                  type="text"
                  id="cSubject"
                  name="subject"
                  placeholder="Internship Opportunity / Collaboration"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  style={fieldErrors.subject ? { borderColor: '#e05555' } : undefined}
                />
                {fieldErrors.subject && (
                  <small style={{ color: '#e05555', display: 'block', marginTop: 4 }}>{fieldErrors.subject}</small>
                )}
              </div>
              <div className="form-row">
                <label htmlFor="cMessage">Message</label>
                <textarea
                  id="cMessage"
                  name="message"
                  rows={4}
                  placeholder="Tell me about the opportunity or project…"
                  required
                  value={form.message}
                  onChange={handleChange}
                  style={fieldErrors.message ? { borderColor: '#e05555' } : undefined}
                />
                {fieldErrors.message && (
                  <small style={{ color: '#e05555', display: 'block', marginTop: 4 }}>{fieldErrors.message}</small>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
              {status === 'success' && (
                <p className="form-note" style={{ color: '#4ade80' }}>
                  ✓ Message sent! I&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="form-note" style={{ color: '#e05555' }}>
                  {errorText || 'Something went wrong. Please try again.'}
                </p>
              )}
              {status === 'idle' && <p className="form-note">Sends directly to my inbox.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
