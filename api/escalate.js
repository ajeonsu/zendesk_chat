const { getAccessToken } = require('../lib/zendeskOAuth')

/**
 * Create a Zendesk Support ticket from custom chat handoff.
 * POST {
 *   name?: string,
 *   email?: string,
 *   message: string,
 *   transcript?: { role: string, content: string }[]
 * }
 */
function formatTranscript(transcript) {
  if (!Array.isArray(transcript) || transcript.length === 0) return ''
  return transcript
    .map((m) => {
      const role = m?.role === 'assistant' ? 'Bot' : m?.role === 'user' ? 'Customer' : 'System'
      return `${role}: ${String(m?.content || '').trim()}`
    })
    .filter((line) => line.length > 8)
    .join('\n\n')
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  const transcript = req.body?.transcript

  if (!message) {
    return res.status(400).json({ error: 'body.message is required' })
  }

  try {
    const { accessToken, subdomain } = await getAccessToken()
    const history = formatTranscript(transcript)
    const bodyText = [
      'Handoff from owned Schenley chat (not Zendesk AI / no AR).',
      '',
      `Customer message: ${message}`,
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      history ? `\n--- Transcript ---\n${history}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const ticketPayload = {
      ticket: {
        subject: `Chat handoff: ${message.slice(0, 60)}${message.length > 60 ? '…' : ''}`,
        comment: { body: bodyText },
        tags: ['owned-chat', 'oauth-handoff'],
      },
    }

    if (email) {
      ticketPayload.ticket.requester = {
        email,
        name: name || email.split('@')[0],
      }
    }

    const ticketRes = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketPayload),
    })
    const ticketData = await ticketRes.json()

    if (!ticketRes.ok) {
      return res.status(ticketRes.status).json({
        error: 'Failed to create Zendesk ticket',
        details: ticketData,
      })
    }

    return res.status(200).json({
      ok: true,
      ticketId: ticketData.ticket?.id,
      ticketUrl: ticketData.ticket?.url,
    })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({
      error: err.message || 'Escalate failed',
      details: err.details,
    })
  }
}
