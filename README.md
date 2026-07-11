# Schenley Zendesk AI CSR

| Path | Purpose |
|------|---------|
| [ZENDESK-AI-AGENT-ARCHITECTURE-REPORT.md](./ZENDESK-AI-AGENT-ARCHITECTURE-REPORT.md) | Technical report: how Zendesk AI agent works (RAG, flows) for AI engineers |
| [zendesk-ai-architecture-report.html](./zendesk-ai-architecture-report.html) | Architecture report — scrollable whitepaper UI |
| [zendesk-ai-pricing-and-engine-report.html](./zendesk-ai-pricing-and-engine-report.html) | **Part 1** — 2026 Zendesk pricing + RAG engine (12 slides) |
| [index.html](./index.html) | **Part 2** — build feasibility, stack, cloud, ask (18 slides; after Part 1) |
| [PROPOSAL-BPO-AI-CSR-PLATFORM.md](./PROPOSAL-BPO-AI-CSR-PLATFORM.md) | BPO proposal: owned AI CSR platform vs Zendesk (pricing, architecture) |
| [owned-ai-csr-n8n-architecture.html](./owned-ai-csr-n8n-architecture.html) | **n8n setup deck** — platform topology, WF-A ingest / WF-B RAG / WF-C assist flowcharts (13 slides) |
| [bpo-ai-csr-proposal-presentation.html](./bpo-ai-csr-proposal-presentation.html) | **Proposal deck** — how owned platform works + cost vs Zendesk (19 slides; open after `zendesk-ai-agent-how-it-works.html`) |
| [zendesk-ai-agent-how-it-works.html](./zendesk-ai-agent-how-it-works.html) | Zendesk-only technical deck — architecture, Copilot, pricing |
| [zendesk-ai-agent-llm-architecture-inside-out.html](./reports/zendesk-ai-agent-llm-architecture-inside-out.html) | **LLM vendors** — 17 slides, Zendesk-disclosed providers + roles (cited per slide) |
| [ZENDESK-AI-CSR-SETUP.md](./ZENDESK-AI-CSR-SETUP.md) | Steps, checklist, and items to collect from your boss |
| [schenley-chat-ui/](./schenley-chat-ui/) | Vite test chat page (Zendesk Web Widget) |

Quick start: read the setup guide, publish Help Center articles, configure the AI agent in Zendesk, then run the chat UI with your Web Widget key.

## Deploy on Vercel

1. Import [github.com/ajeonsu/zendesk_chat](https://github.com/ajeonsu/zendesk_chat).
2. Leave **Root Directory** empty (repo root). Root `vercel.json` builds `schenley-chat-ui/`.
   - Or set **Root Directory** to `schenley-chat-ui` and use the `vercel.json` inside that folder only (not both).
3. **Environment variables (server):**  
   `ZENDESK_SUBDOMAIN`, `ZENDESK_OAUTH_CLIENT_ID`, `ZENDESK_OAUTH_CLIENT_SECRET`, `ZENDESK_OAUTH_REFRESH_TOKEN`, `ZENDESK_OAUTH_REDIRECT_URI`
4. Redeploy after env changes.
5. Open the site → use the **owned chat** → **Talk to a human** creates a Zendesk ticket (no Zendesk AI / AR on bot replies).

OAuth callback: `https://zendesk-chat-ruby.vercel.app/api/zendesk/callback`  
Details: `schenley-chat-ui/README.md`, `scripts/zendesk_oauth_exchange.py`.
