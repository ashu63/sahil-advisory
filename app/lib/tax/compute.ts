import { CESS_RATE, NEW_REGIME, OLD_REGIME, type Slab } from './rules/fy2025-26'

export interface SlabRow {
  from: number
  to: number
  rate: number
  tax: number
}

export function taxFromSlabs(taxable: number, slabs: Slab[]): { tax: number; rows: SlabRow[] } {
  let tax = 0
  const rows: SlabRow[] = []
  for (const s of slabs) {
    if (taxable <= s.from) break
    const taxedInSlab = Math.min(taxable, s.to) - s.from
    const slabTax = (taxedInSlab * s.rate) / 100
    tax += slabTax
    rows.push({ from: s.from, to: s.to, rate: s.rate, tax: slabTax })
  }
  return { tax, rows }
}

function surchargeRate(
  income: number,
  table: { above: number; rate: number }[]
): number {
  for (const t of table) if (income > t.above) return t.rate
  return 0
}

export interface TaxBreakdown {
  regime: 'new' | 'old'
  gross: number
  standardDeduction: number
  otherDeductions: number
  taxableIncome: number
  baseTax: number
  rebate: number
  marginalRelief: number
  taxAfterRebate: number
  surchargeRate: number
  surcharge: number
  cess: number
  totalTax: number
  effectiveRate: number
  takeHome: number
  slabs: SlabRow[]
}

function finish(
  regime: 'new' | 'old',
  gross: number,
  standardDeduction: number,
  otherDeductions: number,
  taxable: number,
  base: number,
  rebate: number,
  marginalRelief: number,
  rows: SlabRow[],
  surchargeTable: { above: number; rate: number }[]
): TaxBreakdown {
  const afterRebate = Math.max(0, base - rebate - marginalRelief)
  const sRate = surchargeRate(taxable, surchargeTable)
  const surcharge = (afterRebate * sRate) / 100
  const cess = ((afterRebate + surcharge) * CESS_RATE) / 100
  const totalTax = Math.round(afterRebate + surcharge + cess)
  return {
    regime,
    gross,
    standardDeduction,
    otherDeductions,
    taxableIncome: taxable,
    baseTax: base,
    rebate,
    marginalRelief,
    taxAfterRebate: afterRebate,
    surchargeRate: sRate,
    surcharge,
    cess,
    totalTax,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    takeHome: gross - totalTax,
    slabs: rows,
  }
}

export function computeNewRegime(
  gross: number,
  opts: { isSalaried?: boolean; employerNps?: number } = {}
): TaxBreakdown {
  const isSalaried = opts.isSalaried ?? true
  const standardDeduction = isSalaried ? Math.min(NEW_REGIME.standardDeduction, gross) : 0
  const other = Math.max(0, opts.employerNps ?? 0)
  const taxable = Math.max(0, gross - standardDeduction - other)
  const { tax: base, rows } = taxFromSlabs(taxable, NEW_REGIME.slabs)
  let rebate = 0
  let marginalRelief = 0
  const { incomeLimit, maxRebate } = NEW_REGIME.rebate87A
  if (taxable <= incomeLimit) {
    rebate = Math.min(base, maxRebate)
  } else {
    // Marginal relief: tax payable cannot exceed the income above the limit.
    const excess = taxable - incomeLimit
    if (base > excess) marginalRelief = base - excess
  }
  return finish('new', gross, standardDeduction, other, taxable, base, rebate, marginalRelief, rows, NEW_REGIME.surcharge)
}

export interface OldRegimeDeductions {
  sec80C?: number
  sec80D?: number
  hraExempt?: number
  homeLoanInterest?: number
  nps80CCD1B?: number
  others?: number
}

export function computeOldRegime(
  gross: number,
  d: OldRegimeDeductions = {},
  opts: { isSalaried?: boolean; age?: 'below60' | '60to80' | 'above80' } = {}
): TaxBreakdown {
  const isSalaried = opts.isSalaried ?? true
  const caps = OLD_REGIME.caps
  const standardDeduction = isSalaried ? Math.min(OLD_REGIME.standardDeduction, gross) : 0
  const capped =
    Math.min(d.sec80C ?? 0, caps.sec80C) +
    Math.min(d.sec80D ?? 0, caps.sec80D_self_senior + caps.sec80D_parents_senior) +
    Math.max(0, d.hraExempt ?? 0) +
    Math.min(d.homeLoanInterest ?? 0, caps.sec24b_selfOccupied) +
    Math.min(d.nps80CCD1B ?? 0, caps.sec80CCD1B) +
    Math.max(0, d.others ?? 0)
  const taxable = Math.max(0, gross - standardDeduction - capped)
  const slabs =
    opts.age === 'above80'
      ? OLD_REGIME.superSeniorSlabs
      : opts.age === '60to80'
        ? OLD_REGIME.seniorSlabs
        : OLD_REGIME.slabs
  const { tax: base, rows } = taxFromSlabs(taxable, slabs)
  let rebate = 0
  if (taxable <= OLD_REGIME.rebate87A.incomeLimit) rebate = Math.min(base, OLD_REGIME.rebate87A.maxRebate)
  return finish('old', gross, standardDeduction, capped, taxable, base, rebate, 0, rows, OLD_REGIME.surcharge)
}

// HRA exemption u/s 10(13A): least of actual HRA, rent paid - 10% basic,
// 50%/40% of basic depending on metro.
export function computeHraExemption(input: {
  basic: number
  da?: number
  hraReceived: number
  rentPaid: number
  metro: boolean
}): { exempt: number; taxable: number; components: { label: string; value: number }[] } {
  const salary = input.basic + (input.da ?? 0)
  const a = input.hraReceived
  const b = Math.max(0, input.rentPaid - salary * 0.1)
  const c = salary * (input.metro ? 0.5 : 0.4)
  const exempt = Math.max(0, Math.min(a, b, c))
  return {
    exempt,
    taxable: Math.max(0, input.hraReceived - exempt),
    components: [
      { label: 'Actual HRA received', value: a },
      { label: 'Rent paid minus 10% of salary', value: b },
      { label: `${input.metro ? 50 : 40}% of salary (basic + DA)`, value: c },
    ],
  }
}
