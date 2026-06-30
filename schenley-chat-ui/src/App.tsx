import { useZendeskMessenger } from './hooks/useZendeskMessenger'
import './App.css'

function App() {
  const { status, openMessenger, hasKey } = useZendeskMessenger()

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <p className="eyebrow">Schenley · Customer support (test)</p>
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
        {status === 'missing-key' && (
          <p className="notice notice-error">
            Add <code>VITE_ZENDESK_WIDGET_KEY</code> to <code>.env</code> and restart
            the dev server.
          </p>
        )}
        {status === 'loading' && (
          <p className="notice">Opening Schenley Customer Care…</p>
        )}
        {status === 'ready' && (
          <p className="notice">
            Chat should open automatically. If you closed it, use the button below or
            the launcher in the corner.
          </p>
        )}
        {status === 'error' && (
          <div className="notice notice-error">
            <p>Chat did not load. Check:</p>
            <ul>
              <li>
                Zendesk <strong>allowed domains</strong> includes{' '}
                <code>{window.location.origin}</code> (use port <strong>5173</strong>{' '}
                — restart dev server if you were on 5174).
              </li>
              <li>
                <code>VITE_ZENDESK_WIDGET_KEY</code> in <code>.env</code> matches
                Admin → Messaging → Installation.
              </li>
              <li>Ad blockers off for this page and zendesk.com.</li>
            </ul>
          </div>
        )}

        {hasKey && status !== 'loading' && (
          <button type="button" className="open-chat" onClick={openMessenger}>
            Open chat
          </button>
        )}
      </main>
    </div>
  )
}

export default App
