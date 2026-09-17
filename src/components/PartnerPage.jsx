import { useState } from 'react'
import { Eyebrow, Reveal, CtaButton } from './Ui.jsx'

export function PartnerPage({ t }) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Golf Course Road',
    propertyType: 'Residential Apartment',
    expectedRent: '',
    serviceNeeded: 'Full Property Management',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="partner-section" id="partner" style={{
      padding: 'clamp(4rem, 8vw, 7rem) var(--gutter)',
      background: 'linear-gradient(180deg, #0a0402 0%, #170904 50%, #050201 100%)',
      borderTop: '1px solid var(--line-soft)',
    }}>
      {/* SEO Title & Eyebrow */}
      <Reveal className="partner__head" style={{ textAlign: 'center', maxWidth: '58rem', margin: '0 auto 3.5rem auto' }}>
        <Eyebrow>— Gurgaon Landlords & NRI Property Management Partner Hub</Eyebrow>
        <h1 className="display" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', color: '#fff', textTransform: 'uppercase', margin: '0.8rem 0 1.2rem 0', lineHeight: 0.95 }}>
          PROPERTY MANAGEMENT <span className="is-red">GURGAON</span>
        </h1>
        <p style={{ color: 'var(--mute)', fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', lineHeight: 1.6 }}>
          Stop cold-calling and hunting tenants. BharatReviews connects Gurgaon property owners, landlords, and NRI investors with pre-screened corporate tenants and high-yield lease buyers through verified reviews and targeted SEO.
        </p>
      </Reveal>

      {/* Main Grid: Intake Form + Value Proposition */}
      <div className="partner__grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        maxWidth: 'var(--maxw)',
        margin: '0 auto',
      }}>
        {/* Left Column: Property Owner Intake Form */}
        <Reveal style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 77, 25, 0.3)',
          borderRadius: '32px',
          padding: 'clamp(1.8rem, 4vw, 3rem)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            List Your Property With Us
          </span>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: '0.6rem 0 1rem 0', fontWeight: '800' }}>
            Get Listed on BharatReviews Partner Network
          </h2>
          <p style={{ color: 'var(--mute)', fontSize: '0.96rem', marginBottom: '1.8rem' }}>
            Fill in your property details below. Our Gurgaon property management team will audit your listing and connect with pre-screened tenants within 24 hours.
          </p>

          {submitted ? (
            <div style={{
              background: 'rgba(255, 77, 25, 0.15)',
              border: '1px solid var(--orange)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
            }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>🎉 Property Submission Received!</h3>
              <p style={{ color: 'var(--mute)', fontSize: '0.98rem' }}>
                Thank you <strong>{formData.name}</strong>. Our Gurgaon Property Desk is reviewing your listing in <strong>{formData.location}</strong>. We will contact you at <strong>{formData.phone}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: '1.2rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '999px',
                  background: 'var(--orange)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Submit Another Property
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                  Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="owner@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    Gurgaon Sector / Zone *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: '#140a07',
                      color: '#fff',
                    }}
                  >
                    <option value="Golf Course Road">Golf Course Road</option>
                    <option value="Golf Course Extension">Golf Course Extension</option>
                    <option value="DLF Cyber City / MG Road">DLF Cyber City / MG Road</option>
                    <option value="Dwarka Expressway (NPR)">Dwarka Expressway (NPR)</option>
                    <option value="Sohna Road">Sohna Road</option>
                    <option value="DLF Phase 1-5">DLF Phase 1-5</option>
                    <option value="Sector 42 / 43 / 54 / 56">Sector 42 / 43 / 54 / 56</option>
                    <option value="Other Gurgaon Area">Other Gurgaon Area</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: '#140a07',
                      color: '#fff',
                    }}
                  >
                    <option value="Residential Apartment">Luxury Residential Apartment</option>
                    <option value="Independent Builder Floor">Independent Builder Floor</option>
                    <option value="Commercial Office Space">Commercial Office Space</option>
                    <option value="Retail Store / Shop">Retail Store / Shop</option>
                    <option value="Villa / Penthouse">Villa / Penthouse</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    Target Rent / Price (₹ / mo)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹75,000 / month"
                    value={formData.expectedRent}
                    onChange={(e) => setFormData({ ...formData, expectedRent: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--mute-2)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    Management Service Needed
                  </label>
                  <select
                    value={formData.serviceNeeded}
                    onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: '#140a07',
                      color: '#fff',
                    }}
                  >
                    <option value="Full Property Management">Full Property Management</option>
                    <option value="Tenant Acquisition & Screening">Tenant Acquisition & Screening</option>
                    <option value="Video Review & Digital Marketing">Video Review & Digital Marketing</option>
                    <option value="NRI Property Caretaking">NRI Property Caretaking</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.8rem',
                  padding: '1rem 2rem',
                  borderRadius: '999px',
                  background: 'var(--orange)',
                  color: '#fff',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(255, 77, 25, 0.6)',
                  transition: 'transform 0.3s var(--ease)',
                }}
              >
                Become a Gurgaon Partner Now ➔
              </button>
            </form>
          )}
        </Reveal>

        {/* Right Column: Why BharatReviews Beats Traditional Portals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Reveal style={{
            background: 'rgba(255, 255, 255, 0.035)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '2rem',
          }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '700', marginBottom: '1rem' }}>
              ⚡ Why Landlords Switch from NoBroker, 99acres & MagicBricks
            </h3>
            <ul style={{ display: 'grid', gap: '1rem', color: 'rgba(255,255,255,0.82)', fontSize: '0.96rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--orange)', fontWeight: '800' }}>✓</span>
                <div>
                  <strong style={{ color: '#fff' }}>No Cold-Calling or Spam Fatigue:</strong> Traditional portals sell your phone number to dozens of brokers. We pre-screen corporate leads before you speak with them.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--orange)', fontWeight: '800' }}>✓</span>
                <div>
                  <strong style={{ color: '#fff' }}>High SEO Ranking for Gurgaon Corridors:</strong> We rank on top of Google for queries like <em>"Property management Golf Course Road"</em> and <em>"DLF Cyber City executive rentals"</em>.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--orange)', fontWeight: '800' }}>✓</span>
                <div>
                  <strong style={{ color: '#fff' }}>Cinematic 4K Video Reviews:</strong> Stand out from flat photos with video walk-throughs that attract expat and corporate executives willing to pay top rent.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--orange)', fontWeight: '800' }}>✓</span>
                <div>
                  <strong style={{ color: '#fff' }}>Full NRI Property Caretaking:</strong> Remote property management with tenant agreements, maintenance, rent collection, and digital reports.
                </div>
              </li>
            </ul>
          </Reveal>

          {/* Quick Stats Banner */}
          <Reveal style={{
            background: 'linear-gradient(135deg, rgba(255, 77, 25, 0.15), rgba(0, 0, 0, 0.4))',
            border: '1px solid rgba(255, 77, 25, 0.3)',
            borderRadius: '24px',
            padding: '1.8rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>200+</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mute-2)', textTransform: 'uppercase', fontWeight: '700' }}>Gurgaon Partners</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--orange)' }}>3x</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mute-2)', textTransform: 'uppercase', fontWeight: '700' }}>Faster Leasing</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>₹75k+</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mute-2)', textTransform: 'uppercase', fontWeight: '700' }}>Avg Monthly Rent</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
