import { useEffect, useState } from 'react'
import { loadZendeskMessenger, openZendeskMessenger } from '../zendesk/loadZendesk'

export type ZendeskStatus = 'loading' | 'ready' | 'missing-key' | 'error'

export function useZendeskMessenger() {
  const key = import.meta.env.VITE_ZENDESK_WIDGET_KEY?.trim()
  const [status, setStatus] = useState<ZendeskStatus>(() =>
    key ? 'loading' : 'missing-key',
  )

  useEffect(() => {
    if (!key) return

    let cancelled = false

    loadZendeskMessenger()
      .then(() => {
        if (!cancelled) setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [key])

  return { status, openMessenger: openZendeskMessenger, hasKey: Boolean(key) }
}
