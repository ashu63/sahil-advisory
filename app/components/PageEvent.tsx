'use client'

import { useEffect } from 'react'
import { track, type AnalyticsEvent, type AnalyticsProps } from '@/app/lib/analytics'

// Fires one event when a page mounts. Renders nothing. For "plan_view",
// "pricing_view" and similar page-level signals a server component cannot
// send itself.
export default function PageEvent({ event, props }: { event: AnalyticsEvent; props?: AnalyticsProps }) {
  useEffect(() => {
    track(event, props)
    // Props are static per page; re-firing on prop identity changes would
    // double count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])
  return null
}
