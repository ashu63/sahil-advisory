import { SITE } from '@/app/lib/site'
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from '@/app/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Contact Sahil Advisory by callback, WhatsApp or phone'

export default async function Image() {
  return ogImage({
    eyebrow: 'Contact',
    title: 'Talk to a tax expert today.',
    subtitle: `Request a callback, message us on WhatsApp or call. Offices in ${SITE.address.locality} and ${SITE.address.secondOffice}, clients served across India online.`,
    chips: [SITE.hours, 'Callback in one business day'],
    stat: { label: 'Call or WhatsApp', value: SITE.phoneDisplay },
    footnote: 'Free triage before you pay · No obligation · Fixed prices published',
  })
}
