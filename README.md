# Schenley Zendesk AI CSR

| Path | Purpose |
|------|---------|
| [ZENDESK-AI-CSR-SETUP.md](./ZENDESK-AI-CSR-SETUP.md) | Steps, checklist, and items to collect from your boss |
| [schenley-chat-ui/](./schenley-chat-ui/) | Vite test chat page (Zendesk Web Widget) |

Quick start: read the setup guide, publish Help Center articles, configure the AI agent in Zendesk, then run the chat UI with your Web Widget key.

## Deploy on Vercel

1. Import [github.com/ajeonsu/zendesk_chat](https://github.com/ajeonsu/zendesk_chat).
2. Leave **Root Directory** empty (repo root). Root `vercel.json` builds `schenley-chat-ui/`.
   - Or set **Root Directory** to `schenley-chat-ui` and use the `vercel.json` inside that folder only (not both).
3. **Environment variables:** `VITE_ZENDESK_WIDGET_KEY` = your Messaging Web Widget key.
4. Redeploy after env changes.
5. In Zendesk Messaging, add your Vercel URL (e.g. `https://zendesk-chat-ruby.vercel.app`) to **allowed domains**.
