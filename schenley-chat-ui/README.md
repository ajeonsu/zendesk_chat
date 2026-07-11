# Schenley test chat UI (owned chat → Zendesk handoff)

One-page React app with a **custom chat** (no Zendesk Messaging widget / no AR). Bot replies come from `/api/chat`. **Talk to a human** creates a Zendesk ticket via OAuth (`/api/escalate`).

Brand reference: [schenleytech.com](https://schenleytech.com/).

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173. API routes (`/api/chat`, `/api/escalate`) run on Vercel — for local APIs use `vercel dev` from the **repo root**, or test against the deployed site.

## Vercel deploy (repo root)

1. Root Directory empty; root `vercel.json` builds this app.
2. Set server env (not `VITE_`):
   - `ZENDESK_SUBDOMAIN`
   - `ZENDESK_OAUTH_CLIENT_ID`
   - `ZENDESK_OAUTH_CLIENT_SECRET`
   - `ZENDESK_OAUTH_REFRESH_TOKEN`
   - `ZENDESK_OAUTH_REDIRECT_URI`
3. Redeploy after env changes.

## APIs

| Route | Purpose |
|--------|---------|
| `POST /api/chat` | Stub bot reply (replace later with real RAG/LLM) |
| `POST /api/escalate` | Refresh OAuth token → create Zendesk ticket |
| `GET /api/zendesk/callback` | OAuth redirect handshake |

## Notes

- This path avoids Zendesk Automated Resolution billing for bot answers.
- Zendesk is used only when the customer asks for a human (ticket handoff).
- Next upgrade: swap the `/api/chat` stub for your RAG/LLM pipeline.
