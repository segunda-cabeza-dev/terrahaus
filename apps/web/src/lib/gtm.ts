const GTM_ID = 'GTM-NR3LCKJD'

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
