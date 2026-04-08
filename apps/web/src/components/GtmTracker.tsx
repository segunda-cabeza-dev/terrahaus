import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { isGtmEnabled, trackPageView } from '../lib/gtm'

export function GtmTracker() {
  const location = useLocation()

  useEffect(() => {
    if (!isGtmEnabled()) {
      return
    }

    trackPageView()
  }, [location])

  return null
}
