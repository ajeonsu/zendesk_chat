const SNIPPET_ID = 'ze-snippet'
const ZE_POLL_MS = 200
const ZE_MAX_ATTEMPTS = 75

let loadPromise: Promise<void> | null = null

function waitForZendeskApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const tick = () => {
      if (typeof window.zE === 'function') {
        try {
          window.zE('messenger:set', 'cookies', 'all')
          window.zE('messenger', 'show')
          window.zE('messenger', 'open')
          resolve()
        } catch (error) {
          reject(error)
        }
        return
      }

      attempts += 1
      if (attempts >= ZE_MAX_ATTEMPTS) {
        reject(new Error('Zendesk messenger did not initialize in time'))
        return
      }
      setTimeout(tick, ZE_POLL_MS)
    }

    tick()
  })
}

export function loadZendeskMessenger(): Promise<void> {
  const key = import.meta.env.VITE_ZENDESK_WIDGET_KEY?.trim()
  if (!key) {
    return Promise.reject(new Error('Missing VITE_ZENDESK_WIDGET_KEY'))
  }

  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const finish = () => {
      waitForZendeskApi().then(resolve).catch(reject)
    }

    const existing = document.getElementById(SNIPPET_ID)
    if (existing) {
      finish()
      return
    }

    const script = document.createElement('script')
    script.id = SNIPPET_ID
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${encodeURIComponent(key)}`
    script.async = true
    script.onload = finish
    script.onerror = () => reject(new Error('Failed to load Zendesk snippet'))

    document.body.appendChild(script)
  })

  return loadPromise
}

export function openZendeskMessenger() {
  if (typeof window.zE !== 'function') return
  window.zE('messenger:set', 'cookies', 'all')
  window.zE('messenger', 'show')
  window.zE('messenger', 'open')
}
