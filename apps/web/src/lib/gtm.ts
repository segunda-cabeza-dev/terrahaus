const GTM_ID = import.meta.env.VITE_GTM_ID?.trim()

let gtmInitialized = false
let lastTrackedPath = ''

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>
  }
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function isGtmEnabled() {
  return Boolean(GTM_ID)
}

export function initializeGtm() {
  if (!GTM_ID || gtmInitialized || typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
  document.head.appendChild(script)

  gtmInitialized = true
}

export function trackPageView() {
  if (!GTM_ID || typeof window === 'undefined') {
    return
  }

  const pagePath = getCurrentPath()
  if (lastTrackedPath === pagePath) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'page_view',
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  })

  lastTrackedPath = pagePath
}
