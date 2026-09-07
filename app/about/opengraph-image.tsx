import { SITE } from '@/app/lib/site'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'About Sahil Advisory, a CMA-led tax and compliance practice'

export default async function Image() {
  return ogImage({
    eyebrow: 'About us',
    title: 'A CMA-led practice, not a filing factory.',
    subtitle: `Tax and compliance for individuals and small businesses from ${SITE.address.locality} and ${SITE.address.secondOffice}, serving clients across India online.`,
    chips: ['Fixed prices', 'Named experts', 'Draft approval before filing'],
    stat: {
      label: 'In practice',
      value: `${SITE.yearsInPractice} yrs`,
      sub: `${SITE.returnsFiled}+ returns filed`,
    },
  })
}
