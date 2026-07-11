/**
 * Exchange Zendesk OAuth refresh token for a short-lived access token.
 * Env: ZENDESK_SUBDOMAIN, ZENDESK_OAUTH_CLIENT_ID, ZENDESK_OAUTH_CLIENT_SECRET,
 *      ZENDESK_OAUTH_REFRESH_TOKEN
 */
async function getAccessToken() {
  const subdomain = process.env.ZENDESK_SUBDOMAIN?.trim()
  const clientId = process.env.ZENDESK_OAUTH_CLIENT_ID?.trim()
  const clientSecret = process.env.ZENDESK_OAUTH_CLIENT_SECRET?.trim()
  const refreshToken = process.env.ZENDESK_OAUTH_REFRESH_TOKEN?.trim()

  if (!subdomain || !clientId || !clientSecret || !refreshToken) {
    const missing = [
      !subdomain && 'ZENDESK_SUBDOMAIN',
      !clientId && 'ZENDESK_OAUTH_CLIENT_ID',
      !clientSecret && 'ZENDESK_OAUTH_CLIENT_SECRET',
      !refreshToken && 'ZENDESK_OAUTH_REFRESH_TOKEN',
    ].filter(Boolean)
    throw new Error(`Missing env: ${missing.join(', ')}`)
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'read write',
  })

  const res = await fetch(`https://${subdomain}.zendesk.com/oauth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json()
  if (!res.ok || !data.access_token) {
    const err = new Error('Failed to refresh Zendesk access token')
    err.details = data
    err.status = res.status
    throw err
  }

  return { accessToken: data.access_token, subdomain }
}

module.exports = { getAccessToken }
