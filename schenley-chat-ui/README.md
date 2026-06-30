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

## Notes

- The AI agent and knowledge base are configured in **Zendesk**, not in this codebase.
- Sample prompts on the page open the messenger; type the same question in the Zendesk panel.
- For a fully custom in-page transcript (no Zendesk launcher), you would need Sunshine Conversations APIs and server-side auth—out of scope for this test UI.
