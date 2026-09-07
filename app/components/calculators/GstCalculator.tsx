'use client'

import { useMemo, useState } from 'react'
import { GST } from '@/app/lib/tax/rules/fy2025-26'
import { formatINR } from '@/app/lib/format'

const inputCls =
  'w-full rounded-lg border border-border-strong bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100'

function num(s: string): number {
  const n = parseFloat(s)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-text-2">{label}</legend>
      <div className="mt-1 inline-flex flex-wrap rounded-lg border border-border-strong bg-bg-alt p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${value === o.value ? 'bg-white text-navy-900 shadow-sm' : 'text-text-2 hover:text-navy-900'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${strong ? 'mt-1 border-t border-border pt-2' : ''}`}>
      <span className="text-text-2">{label}</span>
      <span className={`font-mono tabular ${strong ? 'text-base font-bold text-navy-900' : 'font-semibold text-navy-900'}`}>{value}</span>
    </div>
  )
}

const PRESET_RATES = GST.rates.filter((r) => r > 0)

function split(amount: number, rate: number, inclusive: boolean) {
  const base = inclusive ? amount / (1 + rate / 100) : amount
  const gst = base * (rate / 100)
  return { base, gst, total: base + gst }
}

export default function GstCalculator() {
  const [amount, setAmount] = useState('10000')
  const [rateSel, setRateSel] = useState<string>('18')
  const [customRate, setCustomRate] = useState('3')
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive')
  const [supply, setSupply] = useState<'intra' | 'inter'>('intra')

  const rate = rateSel === 'custom' ? num(customRate) : Number(rateSel)

  const r = useMemo(() => {
    const a = num(amount)
    const s = split(a, rate, mode === 'inclusive')
    const others = PRESET_RATES.map((rt) => ({ rate: rt, ...split(a, rt, mode === 'inclusive') }))
    return { ...s, others }
  }, [amount, rate, mode])

  const f2 = (n: number) => formatINR(n, { decimals: 2 })

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-bold text-navy-900">Amount and rate</h2>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-text-2">{mode === 'inclusive' ? 'Amount including GST' : 'Amount before GST (taxable value)'}</span>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted" aria-hidden>₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                className={`${inputCls} pl-7 font-mono tabular`}
                placeholder="0"
              />
            </div>
          </label>
          <Segmented
            label="Amount is"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'exclusive', label: 'Exclusive of GST (add GST)' },
              { value: 'inclusive', label: 'Inclusive of GST (remove GST)' },
            ]}
          />
          <fieldset>
            <legend className="text-xs font-semibold text-text-2">GST rate</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {[...PRESET_RATES.map(String), 'custom'].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={rateSel === v}
                  onClick={() => setRateSel(v)}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${rateSel === v ? 'border-green-600 bg-green-50 text-green-700' : 'border-border-strong bg-white text-text-2 hover:border-navy-700'}`}
                >
                  {v === 'custom' ? 'Custom' : `${v}%`}
                </button>
              ))}
            </div>
          </fieldset>
          {rateSel === 'custom' ? (
            <label className="block max-w-[12rem]">
              <span className="text-xs font-semibold text-text-2">Custom rate (e.g. 0.25, 1.5, 3, 40)</span>
              <div className="relative mt-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value.replace(/[^\d.]/g, ''))}
                  className={`${inputCls} pr-8 font-mono tabular`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted" aria-hidden>%</span>
              </div>
            </label>
          ) : null}
          <Segmented
            label="Type of supply"
            value={supply}
            onChange={setSupply}
            options={[
              { value: 'intra', label: 'Intra-state (CGST + SGST)' },
              { value: 'inter', label: 'Inter-state (IGST)' },
            ]}
          />
        </div>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-bold text-navy-900">GST breakup at {rate}%</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-bg-alt p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">GST amount</p>
              <p className="mt-1 font-mono tabular text-2xl font-bold text-navy-900">{f2(r.gst)}</p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-green-700">{mode === 'inclusive' ? 'Taxable value' : 'Invoice total'}</p>
              <p className="mt-1 font-mono tabular text-2xl font-bold text-navy-900">{f2(mode === 'inclusive' ? r.base : r.total)}</p>
            </div>
          </div>
          <div className="mt-4">
            <Row label="Taxable value (before GST)" value={f2(r.base)} />
            {supply === 'intra' ? (
              <>
                <Row label={`CGST @ ${rate / 2}%`} value={f2(r.gst / 2)} />
                <Row label={`SGST / UTGST @ ${rate / 2}%`} value={f2(r.gst / 2)} />
              </>
            ) : (
              <Row label={`IGST @ ${rate}%`} value={f2(r.gst)} />
            )}
            <Row label="Total GST" value={f2(r.gst)} />
            <Row label="Invoice total (incl. GST)" value={f2(r.total)} strong />
          </div>

          <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-muted">Same amount at other rates</h3>
          <div className="mt-2 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="bg-bg-alt text-left text-muted">
                <tr>
                  <th className="px-3 py-2 font-semibold">Rate</th>
                  <th className="px-3 py-2 text-right font-semibold">Taxable value</th>
                  <th className="px-3 py-2 text-right font-semibold">GST</th>
                  <th className="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {r.others.map((o) => (
                  <tr key={o.rate} className={`border-t border-border ${o.rate === rate ? 'bg-green-50/60' : ''}`}>
                    <td className="px-3 py-1.5 font-mono tabular font-semibold text-navy-900">{o.rate}%</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular">{f2(o.base)}</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular">{f2(o.gst)}</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular text-navy-900">{f2(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg border border-border bg-bg-alt/60 p-3 text-[11px] leading-relaxed text-muted">
            <strong className="text-text-2">Assumptions:</strong> standard slabs {PRESET_RATES.map((x) => x + '%').join(', ')} with CGST and SGST each at half the rate for
            intra-state supplies and IGST at the full rate for inter-state supplies. Inclusive price is split as amount ÷ (1 + rate). Cess on items such as tobacco,
            aerated drinks and cars is not included. Round each tax line to the nearest rupee on the actual invoice.
          </div>
        </div>
      </div>
    </div>
  )
}
