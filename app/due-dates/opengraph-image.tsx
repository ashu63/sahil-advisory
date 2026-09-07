import { DEADLINES } from '@/app/lib/due-dates'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'India tax compliance calendar: ITR, GST, TDS and advance tax due dates'

export default async function Image() {
  return ogImage({
    // Red is reserved for urgency in this palette, and a missed deadline is
    // exactly that.
    accent: 'red',
    eyebrow: 'Compliance calendar',
    title: 'Never miss a GST, TDS or income tax deadline.',
    subtitle:
      'Every due date that applies to Indian individuals and small businesses, with the late fee and interest you pay for missing it.',
    chips: ['GSTR-1 and 3B', 'TDS 24Q / 26Q', 'Advance tax', 'ITR deadlines'],
    stat: { label: 'Tracked', value: String(DEADLINES.length), sub: 'deadlines' },
  })
}
