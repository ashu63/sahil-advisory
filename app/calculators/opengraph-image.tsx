import { LIVE_CALCULATORS } from '@/app/lib/calculators'
import { SITE } from '@/app/lib/site'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Free tax calculators from Sahil Advisory'

export default async function Image() {
  return ogImage({
    eyebrow: `Calculators · FY ${SITE.currentFY}`,
    title: 'Run the numbers before you file.',
    subtitle:
      'Income tax, HRA, capital gains, advance tax and take-home salary, on current slabs. Free, no sign-up, nothing stored.',
    chips: LIVE_CALCULATORS.slice(0, 3).map((c) => c.name.replace(' Calculator', '')),
    stat: { label: 'Live tools', value: String(LIVE_CALCULATORS.length), sub: 'free to use' },
  })
}
