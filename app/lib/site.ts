// Single source of truth for brand, contact and legal identity.
// Everything user-facing (footer, JSON-LD, WhatsApp links, metadata) reads
// from here so an owner change is a one-file edit.

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://sahiladvisory.in'

export const SITE = {
  name: 'Sahil Advisory',
  legalName: 'Sahil Advisory',
  tagline: 'Tax filing and compliance, handled by experts. At prices you can see.',
  shortDescription:
    'Fixed-price ITR, GST, TDS, registrations and notice handling for Indian individuals and small businesses. Verified CMA/CA experts, tracked online, updated on WhatsApp.',
  phoneDisplay: '+91 78884 12302',
  phoneE164: '+917888412302',
  whatsappNumber: '917888412302',
  email: 'sahiladvisory1@gmail.com',
  hours: 'Mon to Sat, 10 AM to 7 PM IST',
  openingHours: 'Mo-Sa 10:00-19:00',
  address: {
    street: 'House 2032B, Block 22, CHB Flats, Phase 9, Sector 63',
    locality: 'Chandigarh',
    region: 'Chandigarh',
    postalCode: '160047',
    country: 'IN',
    secondOffice: 'Sector 12, Panchkula',
  },
  // Fill these in once the entity / registrations are confirmed by the owner.
  gstin: process.env.NEXT_PUBLIC_COMPANY_GSTIN || '',
  cin: '',
  social: {
    instagram: 'https://www.instagram.com/sahil_advisory',
    facebook: 'https://www.facebook.com/sahiladvisory',
    linkedin: '',
    googleBusiness: '',
  },
  // Current filing season. Bump every April.
  currentFY: '2025-26',
  currentAY: '2026-27',
  // The FY the Income-tax Act 2025 first applies to.
  nextTaxYear: '2026-27',
  // Real number from the practice. Replace with a DB count in Phase 1.
  returnsFiled: 640,
  yearsInPractice: 8,
  googleRating: 5.0,
  googleReviewCount: 3,
} as const

export function whatsappLink(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export const WHATSAPP_DEFAULT = whatsappLink(
  'Hi Sahil Advisory, I want help with my tax filing.'
)

export const FOOTER_DISCLAIMER = `${SITE.legalName} provides tax and compliance services through a panel of independent qualified professionals (CMA / CA / CS). Content on this site is general information, not professional advice; your assigned expert advises on your specific facts. Tax audit and statutory audit services are delivered only by empanelled Chartered Accountants.`
