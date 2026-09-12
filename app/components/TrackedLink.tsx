'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { track, type AnalyticsEvent, type AnalyticsProps } from '@/app/lib/analytics'

// An <a> that reports its click. Used for wa.me, tel: and plan CTAs so the
// funnel has every exit to a human, not only the form. Server components can
// render it; only the click handler is client-side.
export default function TrackedLink({
  event,
  props,
  children,
  ...rest
}: { event: AnalyticsEvent; props?: AnalyticsProps; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...rest} onClick={(e) => { track(event, props); rest.onClick?.(e) }}>
      {children}
    </a>
  )
}
