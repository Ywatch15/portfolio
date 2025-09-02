import nodemailer from 'nodemailer'

export function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST) {
    // Fallback: stream to console in dev
    return nodemailer.createTransport({ jsonTransport: true })
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  })
}

export async function sendContactEmail({ to, from, name, email, subject, message }) {
  const transport = buildTransport()
  const info = await transport.sendMail({
    to,
    from: from || (process.env.SMTP_USER || 'no-reply@example.com'),
    replyTo: email,
    subject: subject && subject.trim() ? `[Contact] ${subject}` : 'New contact message',
    text: `From: ${name} <${email}>::\n\n${message}`,
  })
  return info
}
