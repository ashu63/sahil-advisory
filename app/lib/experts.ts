// Panel of professionals. Photos, membership numbers and bios are
// placeholders until the owner supplies real ones (docs/PROJECT.md §Open).
// Never invent credentials: the CMA lead is real; CA partner entries must be
// confirmed before publish and stay hidden until then.

export interface Expert {
  slug: string
  name: string
  credential: 'CMA' | 'CA' | 'CS' | 'GSTP'
  title: string
  years: number
  specialisations: string[]
  languages: string[]
  bio: string
  photo?: string
  knowsAbout: string[]
  isPublished: boolean
}

export const EXPERTS: Expert[] = [
  {
    slug: 'sahil',
    name: 'CMA Sahil',
    credential: 'CMA',
    title: 'Cost and Management Accountant, Lead Tax Expert',
    years: 8,
    specialisations: ['Income tax returns', 'GST compliance', 'CMA data for bank loans', 'MSME and startup advisory'],
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Fellow-track member of the Institute of Cost Accountants of India with eight years in tax, GST and business advisory for individuals, traders and small businesses across Chandigarh, Panchkula and Mohali. Reviews every return before it is filed.',
    knowsAbout: ['Income tax', 'GST', 'TDS', 'Cost accounting', 'Project reports', 'MSME finance'],
    isPublished: true,
  },
]

export function publishedExperts() {
  return EXPERTS.filter((e) => e.isPublished)
}
export function getExpert(slug: string) {
  return EXPERTS.find((e) => e.slug === slug && e.isPublished)
}
export const REVIEWER = EXPERTS[0]
