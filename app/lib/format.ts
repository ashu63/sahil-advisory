export function formatINR(n: number, opts: { decimals?: number } = {}): string {
  if (!Number.isFinite(n)) return '₹0'
  const decimals = opts.decimals ?? 0
  return `₹${n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export function formatINRCompact(n: number): string {
  if (!Number.isFinite(n)) return '₹0'
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export function paiseToINR(paise: number): string {
  return formatINR(paise / 100)
}

export function formatDateIN(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

export function daysUntil(d: Date | string, from: Date = new Date()): number {
  const target = typeof d === 'string' ? new Date(d) : d
  const ms = target.getTime() - from.getTime()
  return Math.ceil(ms / 86_400_000)
}
