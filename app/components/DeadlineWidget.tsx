'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { CalendarClock } from 'lucide-react'

export type DeadlineItem = { key: string; label: string; slug: string; dueIso: string }

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
}

function daysLeft(iso: string, now: number) {
  return Math.ceil((new Date(iso).getTime() - now) / 86_400_000)
}

// The clock is an external system, so it is read through useSyncExternalStore
// rather than an effect. The snapshot is floored to the minute so repeated
// reads inside one render pass return an identical value; the server snapshot
// is null so the markup matches on hydration and the countdown fills in after.
function subscribeToClock(onChange: () => void) {
  const id = setInterval(onChange, 30_000)
  return () => clearInterval(id)
}
const getClockSnapshot = () => Math.floor(Date.now() / 60_000)
const getServerClockSnapshot = () => null

export default function DeadlineWidget({ items, title = 'Your next deadlines' }: { items: DeadlineItem[]; title?: string }) {
  const minutes = useSyncExternalStore(subscribeToClock, getClockSnapshot, getServerClockSnapshot)
  const now = minutes === null ? null : minutes * 60_000

  if (!items.length) return null
  return (
    <div className="rounded-2xl border border-border bg-navy-900 p-5 text-white">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">{title}</p>
        <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> LIVE
        </span>
      </div>
      <ul className={`mt-3 grid gap-3 ${items.length > 1 ? 'grid-cols-2' : ''}`}>
        {items.map((it) => {
          const d = now ? daysLeft(it.dueIso, now) : null
          const urgent = d !== null && d <= 7
          return (
            <li key={it.key}>
              <Link href={`/due-dates/${it.slug}`} className="block rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white/60">
                  <CalendarClock className="h-3.5 w-3.5" /> {it.label}
                </p>
                <p className="mt-1 font-mono text-base font-bold tabular">{fmt(it.dueIso)}</p>
                <p className={`mt-0.5 text-xs font-semibold ${urgent ? 'text-red-400' : 'text-green-500'}`}>
                  {d === null ? ' ' : d < 0 ? 'Passed' : d === 0 ? 'Due today' : `${d} day${d === 1 ? '' : 's'} left`}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
