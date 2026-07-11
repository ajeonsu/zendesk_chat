import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Role = 'user' | 'assistant' | 'system'
type ChatMessage = { id: string; role: Role; content: string }

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data as T
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi — I’m Schenley Customer Care (owned chat). Ask about products, returns, or warranty. This path does not use Zendesk Automated Resolutions.',
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [handoffOpen, setHandoffOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [ticketId, setTicketId] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, handoffOpen])

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const text = input.trim()
    if (!text || busy) return

    setError(null)
    setInput('')
    const userMsg: ChatMessage = { id: newId(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setBusy(true)

    try {
      const data = await postJson<{ reply: string; suggestHandoff?: boolean }>(
        '/api/chat',
        { message: text },
      )
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', content: data.reply },
      ])
      if (data.suggestHandoff) setHandoffOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat request failed')
    } finally {
      setBusy(false)
    }
  }

  async function escalate(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)

    const lastUser =
      [...messages].reverse().find((m) => m.role === 'user')?.content ||
      'Customer requested human help'

    try {
      const data = await postJson<{ ticketId: number }>('/api/escalate', {
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        message: lastUser,
        transcript: messages
          .filter((m) => m.role !== 'system')
          .map(({ role, content }) => ({ role, content })),
      })
      setTicketId(data.ticketId)
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: 'assistant',
          content: `Thanks — I created Zendesk ticket #${data.ticketId} for our human team. They’ll follow up from there.`,
        },
      ])
      setHandoffOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Handoff failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <p className="eyebrow">Schenley · Owned chat (no AR)</p>
            <h1>Be Simple, Be Graceful.</h1>
          </div>
        </div>
        <a
          className="site-link"
          href="https://schenleytech.com/"
          target="_blank"
          rel="noreferrer"
        >
          schenleytech.com
        </a>
      </header>

      <main className="main">
        <p className="notice">
          Custom chat on your stack. Bot answers here; “Talk to a human” opens a
          Zendesk ticket via OAuth.
        </p>

        <section className="chat" aria-label="Support chat">
          <div className="chat-log">
            {messages.map((m) => (
              <div key={m.id} className={`bubble bubble-${m.role}`}>
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="composer" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, returns, warranty…"
              disabled={busy}
              aria-label="Message"
            />
            <button type="submit" disabled={busy || !input.trim()}>
              Send
            </button>
          </form>

          <div className="chat-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setHandoffOpen((v) => !v)}
              disabled={busy}
            >
              Talk to a human
            </button>
            {ticketId != null && (
              <span className="ticket-pill">Ticket #{ticketId} created</span>
            )}
          </div>

          {handoffOpen && (
            <form className="handoff" onSubmit={escalate}>
              <p className="handoff-title">Create a Zendesk ticket</p>
              <label>
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  disabled={busy}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={busy}
                />
              </label>
              <button type="submit" disabled={busy}>
                Send to human team
              </button>
            </form>
          )}

          {error && <p className="notice notice-error">{error}</p>}
        </section>
      </main>
    </div>
  )
}

export default App
