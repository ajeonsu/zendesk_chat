"""
One-time Zendesk OAuth token exchange.

1. Register Redirect URI in Zendesk (must match redirect_uri below exactly):
   https://zendesk-chat-ruby.vercel.app/api/zendesk/callback

2. Open this authorize URL in a browser (as Zendesk admin), click Allow:
   https://YOUR_SUBDOMAIN.zendesk.com/oauth/authorizations/new
     ?response_type=code
     &client_id=YOUR_CLIENT_ID
     &redirect_uri=https%3A%2F%2Fzendesk-chat-ruby.vercel.app%2Fapi%2Fzendesk%2Fcallback
     &scope=read%20write

3. Copy ?code= from the callback JSON (or browser URL), paste below, run:
   python scripts/zendesk_oauth_exchange.py

Store access_token / refresh_token in a secret manager — never in the Vite app.
"""

from __future__ import annotations

import requests

subdomain = "YOUR_SUBDOMAIN"
client_id = "YOUR_CLIENT_ID"
client_secret = "YOUR_CLIENT_SECRET"
redirect_uri = "https://zendesk-chat-ruby.vercel.app/api/zendesk/callback"
authorization_code = "AUTH_CODE_FROM_CALLBACK"

url = f"https://{subdomain}.zendesk.com/oauth/tokens"

payload = {
    "grant_type": "authorization_code",
    "code": authorization_code,
    "client_id": client_id,
    "client_secret": client_secret,
    "redirect_uri": redirect_uri,
    "scope": "read write",
}

response = requests.post(url, data=payload, timeout=30)
token_data = response.json()

print("HTTP", response.status_code)
print("Access Token:", token_data.get("access_token"))
print("Refresh Token:", token_data.get("refresh_token"))
if response.status_code >= 400:
    print("Error body:", token_data)
