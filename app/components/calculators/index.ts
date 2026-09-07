import type { ComponentType } from 'react'
import IncomeTaxCalculator from './IncomeTaxCalculator'
import HraCalculator from './HraCalculator'
import CapitalGainsCalculator from './CapitalGainsCalculator'
import GstCalculator from './GstCalculator'
import TdsCalculator from './TdsCalculator'
import AdvanceTaxCalculator from './AdvanceTaxCalculator'
import TakeHomeSalaryCalculator from './TakeHomeSalaryCalculator'
import RentReceiptGenerator from './RentReceiptGenerator'

// Keyed by calculator slug (see app/lib/calculators.ts).
export const CALCULATOR_COMPONENTS: Record<string, ComponentType> = {
  'income-tax': IncomeTaxCalculator,
  hra: HraCalculator,
  'capital-gains': CapitalGainsCalculator,
  gst: GstCalculator,
  tds: TdsCalculator,
  'advance-tax': AdvanceTaxCalculator,
  'take-home-salary': TakeHomeSalaryCalculator,
  'rent-receipt-generator': RentReceiptGenerator,
}
