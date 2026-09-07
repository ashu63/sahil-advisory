// Typed long-form content. Posts that read like tools (stat grids, tables,
// callouts, tool cards) engage 2x better than prose walls, so the renderer
// supports those blocks natively. Keep paragraphs short.

export type ContentSection =
  | { type: 'heading'; text: string; id?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'callout'; tone: 'info' | 'warning' | 'success'; title?: string; text: string }
  | { type: 'stat-grid'; stats: { label: string; value: string; note?: string }[] }
  | { type: 'key-takeaways'; items: string[] }
  | { type: 'tool-card'; calculatorSlug: string; text?: string }
  | { type: 'service-card'; serviceSlug: string; text?: string }
  | { type: 'example'; title: string; lines: { label: string; value: string; strong?: boolean }[] }

export type ClusterId =
  | 'itr-filing'
  | 'tax-saving'
  | 'capital-gains'
  | 'gst'
  | 'tds'
  | 'notices'
  | 'business-setup'
  | 'income-tax-act-2025'
  | 'nri'

export interface Guide {
  slug: string
  cluster: ClusterId
  title: string
  h1: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  excerpt: string
  datePublished: string
  dateModified: string
  readMinutes: number
  sections: ContentSection[]
  faqs: { q: string; a: string }[]
  relatedServiceSlug: string
  relatedGuides: string[]
  relatedCalculators: string[]
}

export interface Cluster {
  id: ClusterId
  name: string
  description: string
  plannedCount: number
}

export const CLUSTERS: Cluster[] = [
  { id: 'itr-filing', name: 'ITR Filing', description: 'Which form, which documents, deadlines, e-verification, belated and revised returns.', plannedCount: 12 },
  { id: 'tax-saving', name: 'Tax Saving and Regimes', description: 'Old vs new regime, 80C to 80CCD, HRA, home loan, 87A rebate and salary structuring.', plannedCount: 10 },
  { id: 'capital-gains', name: 'Capital Gains and Traders', description: 'Shares, mutual funds, property, F&O, intraday, crypto and ESOPs.', plannedCount: 8 },
  { id: 'gst', name: 'GST', description: 'Registration, GSTR-1 and 3B, QRMP, composition, annual return, ITC and late fees.', plannedCount: 8 },
  { id: 'tds', name: 'TDS', description: 'For employers, businesses and property buyers: 24Q, 26Q, 26QB, corrections and Form 16.', plannedCount: 6 },
  { id: 'notices', name: 'Tax Notices', description: 'What each notice means, deadlines and how to reply.', plannedCount: 6 },
  { id: 'business-setup', name: 'Business Setup', description: 'Pvt Ltd vs LLP, MSME, Startup India, compliance calendars and bank loan reports.', plannedCount: 6 },
  { id: 'income-tax-act-2025', name: 'Income-tax Act 2025', description: 'What changes from 1 April 2026: section mapping, form renumbering, tax year.', plannedCount: 5 },
  { id: 'nri', name: 'NRI Taxation', description: 'Residential status, DTAA, NRO/NRE, Schedule FA and property.', plannedCount: 4 },
]
