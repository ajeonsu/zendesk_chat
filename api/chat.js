/**
 * Custom AI chat stub (no Zendesk AR).
 * POST { message: string, history?: { role, content }[] }
 * → { reply: string, suggestHandoff?: boolean }
 */
function stubReply(message) {
  const text = String(message || '').toLowerCase()

  if (!text.trim()) {
    return {
      reply: 'Send a message and I’ll try to help with Schenley product questions.',
      suggestHandoff: false,
    }
  }

  if (/human|agent|person|representative|talk to/.test(text)) {
    return {
      reply:
        'I can connect you with a human. Click “Talk to a human” and leave your email so our team can follow up in Zendesk.',
      suggestHandoff: true,
    }
  }

  if (/return|refund|warranty/.test(text)) {
    return {
      reply:
        'Schenley typically offers a 30-day return window and a one-year warranty on eligible products. For order-specific refunds I need a human agent — use “Talk to a human”.',
      suggestHandoff: true,
    }
  }

  if (/hestia|iris|hera|doris|tethys|hygea|steam|mop|vacuum/.test(text)) {
    return {
      reply:
        'I can share general product guidance from our public site. For model-specific fit, accessories, or order status, a human can dig into your account — use “Talk to a human” if you need that.',
      suggestHandoff: false,
    }
  }

  if (/shipping|delivery|ship/.test(text)) {
    return {
      reply:
        'Shipping details depend on your region and order. I don’t look up live orders yet — use “Talk to a human” with your order email for tracking help.',
      suggestHandoff: true,
    }
  }

  return {
    reply:
      'Thanks for your message. This is our owned chat (not Zendesk AI), so it doesn’t use Automated Resolutions. Ask about products, returns, or warranty — or click “Talk to a human” to open a Zendesk ticket.',
    suggestHandoff: false,
  }
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

  const message = req.body?.message
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'body.message must be a string' })
  }

  const result = stubReply(message)
  return res.status(200).json(result)
}
