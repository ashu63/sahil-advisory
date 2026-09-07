'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export type FinderOption = { label: string; desc: string; slug: string }

// Recommends the highest-ranked SKU among the selected options. Order in
// `options` is the priority order (most complex last wins).
export default function PlanFinder({
  title,
  subtitle,
  options,
  basePath,
  priority,
  names,
}: {
  title: string
  subtitle: string
  options: FinderOption[]
  basePath: string
  priority: string[]
  names: Record<string, string>
}) {
  const [sel, setSel] = useState<Set<string>>(new Set())
  const rec = useMemo(() => {
    if (!sel.size) return null
    const slugs = options.filter((o) => sel.has(o.label)).map((o) => o.slug)
    let best = slugs[0]
    let bestIdx = -1
    for (const s of slugs) {
      const i = priority.indexOf(s)
      if (i > bestIdx) {
        bestIdx = i
        best = s
      }
    }
    return best
  }, [sel, options, priority])

  return (
    <div className="rounded-3xl bg-navy-900 p-6 sm:p-8 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-white/65">{subtitle}</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((o) => {
          const on = sel.has(o.label)
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => {
                const n = new Set(sel)
                if (on) n.delete(o.label)
                else n.add(o.label)
                setSel(n)
              }}
              aria-pressed={on}
              className={`flex items-start gap-3 rounded-xl p-3.5 text-left ring-1 transition-colors ${on ? 'bg-green-600/20 ring-green-500' : 'bg-white/5 ring-white/10 hover:bg-white/10'}`}
            >
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${on ? 'border-green-500 bg-green-500 text-navy-900' : 'border-white/30'}`}>
                {on && <Check className="h-3.5 w-3.5" />}
              </span>
              <span>
                <span className="block text-sm font-semibold">{o.label}</span>
                <span className="block text-xs text-white/60">{o.desc}</span>
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-6 min-h-[64px] rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
        {rec ? (
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm">
              <span className="text-white/60">Recommended plan: </span>
              <span className="font-bold text-green-500">{names[rec] ?? rec}</span>
            </p>
            <Link href={`${basePath}/${rec}`} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              View plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <p className="text-sm text-white/60">Select everything that applies to you and we will recommend the right plan.</p>
        )}
      </div>
    </div>
  )
}
