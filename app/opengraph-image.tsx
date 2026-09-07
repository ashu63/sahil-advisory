import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Sahil Advisory: expert ITR, GST and TDS filing at fixed prices'

export default async function OGImage() {
  const chips = ['ITR from ₹999', 'GST from ₹999/mo', 'TDS returns', 'Registrations', 'Notice replies']
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0B1F3A', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', top: -160, right: -120, width: 520, height: 520, borderRadius: '50%', background: 'rgba(5,150,105,0.18)', display: 'flex' }} />
        <div style={{ width: '100%', height: 8, background: '#059669', display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', padding: '56px 80px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#ffffff' }}>SA</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#ffffff' }}>Sahil Advisory</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, textTransform: 'uppercase' }}>Tax and Compliance</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 56, fontSize: 60, fontWeight: 800, color: '#ffffff', lineHeight: 1.08, maxWidth: 900 }}>
            <span>Tax filing and compliance,</span>
            <span>handled by experts.</span>
            <span style={{ color: '#34D399' }}>At prices you can see.</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <div key={c} style={{ display: 'flex', padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.9)', fontSize: 20, fontWeight: 600 }}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 80px', background: 'rgba(0,0,0,0.25)' }}>
          <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)' }}>Reviewed by a CMA or CA before filing · Draft approval · WhatsApp updates</span>
          <span style={{ fontSize: 17, color: '#34D399', fontWeight: 700 }}>sahiladvisory.in</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
