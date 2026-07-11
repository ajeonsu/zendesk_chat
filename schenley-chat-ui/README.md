# Schenley test chat UI (Zendesk Messaging)

One-page React app that hosts **Zendesk Messaging** for testing the Schenley AI CSR agent. Brand reference: [schenleytech.com](https://schenleytech.com/).

Full Zendesk setup steps: [../ZENDESK-AI-CSR-SETUP.md](../ZENDESK-AI-CSR-SETUP.md)

## Local development

```bash
npm install
cp .env.example .env
# Set VITE_ZENDESK_WIDGET_KEY from Zendesk Admin → Messaging → Installation
npm run dev
```

Open http://localhost:5173 and click **Start chat**. Conversations appear in Zendesk like any other Messaging ticket.

## Vercel deploy

1. Import this repo; set **Root Directory** to `schenley-chat-ui`.
2. Add environment variable `VITE_ZENDESK_WIDGET_KEY`.
3. Deploy; add the `*.vercel.app` URL under Zendesk Messaging allowed domains.

## Zendesk OAuth callback (ticket API / handoff)

For a **custom** AI bot that creates Zendesk tickets (not Zendesk AR billing), register this Redirect URI on the OAuth client:

```text
https://zendesk-chat-ruby.vercel.app/api/zendesk/callback
```

Handler: `api/zendesk/callback.js` (also mirrored at repo root for empty Root Directory deploys).

1. Deploy so `/api/zendesk/callback` is live.
2. Admin Center → Apps and integrations → APIs → OAuth clients → add that Redirect URI.
3. Open the authorize URL as admin → Allow → callback returns `{ "code": "..." }`.
4. Exchange the code with [`../scripts/zendesk_oauth_exchange.py`](../scripts/zendesk_oauth_exchange.py).

Optional Vercel env (auto-exchange on callback): `ZENDESK_SUBDOMAIN`, `ZENDESK_OAUTH_CLIENT_ID`, `ZENDESK_OAUTH_CLIENT_SECRET`, `ZENDESK_OAUTH_REDIRECT_URI`. Set `ZENDESK_OAUTH_EXPOSE_TOKENS=true` only once to print tokens in the response, then turn it off.

OAuth does **not** replace `VITE_ZENDESK_WIDGET_KEY`. The widget key is still required if you embed Zendesk Messaging.

## Notes

- The AI agent and knowledge base are configured in **Zendesk**, not in this codebase.
- Sample prompts on the page open the messenger; type the same question in the Zendesk panel.
- For a fully custom in-page transcript (no Zendesk launcher), you would need Sunshine Conversations APIs and server-side auth—out of scope for this test UI.
