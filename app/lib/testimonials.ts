// Client testimonials. Carried over from the previous site. Owner to confirm
// consent, add city/service/month and link the Google Business Profile
// reviews page before launch (docs/PROJECT.md).
export interface Testimonial {
  name: string
  role: string
  city?: string
  service?: string
  text: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rajesh Sharma', role: 'Small business owner', city: 'Panchkula', service: 'GST monthly filing', rating: 5,
    text: 'Sahil Advisory has been instrumental in keeping my business compliant. GST filing is always on time and they explain everything in simple terms.',
  },
  {
    name: 'Priya Mehta', role: 'Startup founder', city: 'Chandigarh', service: 'Company registration and MSME', rating: 5,
    text: 'From company registration to MSME certification, they handled everything smoothly. Their knowledge of government schemes saved us real money.',
  },
  {
    name: 'Amit Verma', role: 'Freelance consultant', city: 'Mohali', service: 'ITR and tax planning', rating: 5,
    text: 'I was worried about my tax planning but they made it stress-free. Proper planning under 44ADA saved me a significant amount this year.',
  },
]
