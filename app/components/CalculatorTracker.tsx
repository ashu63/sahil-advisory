'use client'

import { useRef, type ReactNode } from 'react'
import { track } from '@/app/lib/analytics'

// Wraps a calculator and reports the first time the visitor changes any
// input. One event per page load, so it measures "used it", not keystrokes.
export default function CalculatorTracker({ slug, children }: { slug: string; children: ReactNode }) {
  const fired = useRef(false)
  return (
    <div
      onInputCapture={() => {
        if (fired.current) return
        fired.current = true
        track('calculator_used', { calculator: slug })
      }}
    >
      {children}
    </div>
  )
}
