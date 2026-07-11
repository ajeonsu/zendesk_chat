/**
 * Zendesk OAuth redirect handler (one-time admin handshake).
 *
 * Redirect URI to register in Zendesk Admin → OAuth clients:
 *   https://zendesk-chat-ruby.vercel.app/api/zendesk/callback
 *
 * Use this copy when Vercel Root Directory = schenley-chat-ui.
 * (Repo-root api/zendesk/callback.js is used when Root Directory is empty.)
 *
 * Optional auto-exchange env vars:
 *   ZENDESK_SUBDOMAIN, ZENDESK_OAUTH_CLIENT_ID, ZENDESK_OAUTH_CLIENT_SECRET
 *   ZENDESK_OAUTH_REDIRECT_URI, ZENDESK_OAUTH_EXPOSE_TOKENS
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const code = typeof req.query.code === 'string' ? req.query.code : null
  const error = typeof req.query.error === 'string' ? req.query.error : null
  const errorDescription =
    typeof req.query.error_description === 'string'
      ? req.query.error_description
      : null

  if (error) {
    return res.status(400).json({
      error,
      error_description: errorDescription,
    })
  }

  if (!code) {
    return res.status(400).json({
      error: 'Missing authorization code from Zendesk',
      hint: 'Open the Zendesk authorize URL first, then Allow access.',
    })
  }

  const subdomain = process.env.ZENDESK_SUBDOMAIN?.trim()
  const clientId = process.env.ZENDESK_OAUTH_CLIENT_ID?.trim()
  const clientSecret = process.env.ZENDESK_OAUTH_CLIENT_SECRET?.trim()
  const redirectUri =
    process.env.ZENDESK_OAUTH_REDIRECT_URI?.trim() ||
    `https://${req.headers.host}/api/zendesk/callback`

  if (subdomain && clientId && clientSecret) {
    try {
      const tokenUrl = `https://${subdomain}.zendesk.com/oauth/tokens`
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        scope: 'read write',
      })

      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      const tokenData = await tokenRes.json()

      if (!tokenRes.ok) {
        return res.status(tokenRes.status).json({
          error: 'Token exchange failed',
          details: tokenData,
        })
      }

      const expose = process.env.ZENDESK_OAUTH_EXPOSE_TOKENS === 'true'
      if (expose) {
        return res.status(200).json({
          message:
            'Token exchange OK. Copy tokens now, then set ZENDESK_OAUTH_EXPOSE_TOKENS=false.',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        })
      }

      return res.status(200).json({
        message:
          'Token exchange OK. Tokens were received server-side but not returned in this response.',
        hint: 'For a one-time setup dump, set ZENDESK_OAUTH_EXPOSE_TOKENS=true, redeploy, repeat Allow once, then turn it off.',
        has_access_token: Boolean(tokenData.access_token),
        has_refresh_token: Boolean(tokenData.refresh_token),
        scope: tokenData.scope,
      })
    } catch (err) {
      return res.status(500).json({
        error: 'Token exchange request failed',
        details: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return res.status(200).json({
    message:
      'Handshake successful. Paste this code into your token-exchange script.',
    code,
    redirect_uri_used: redirectUri,
    next: [
      'POST https://YOUR_SUBDOMAIN.zendesk.com/oauth/tokens',
      'grant_type=authorization_code',
      'Use the same redirect_uri registered in Zendesk',
    ],
  })
}
