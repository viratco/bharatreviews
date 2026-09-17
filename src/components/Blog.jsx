import { useState } from 'react'
import { blogs } from '../blogData.js'
import { Eyebrow, Reveal, CtaButton } from './Ui.jsx'

export function Blog({ t }) {
  const [activeBlog, setActiveBlog] = useState(null)

  return (
    <section className="blog-section" id="blog" style={{
      padding: 'clamp(4rem, 8vw, 7rem) var(--gutter)',
      background: 'linear-gradient(180deg, #070402 0%, #120905 100%)',
      borderTop: '1px solid var(--line-soft)',
    }}>
      <Reveal className="blog__head" style={{ textAlign: 'center', maxWidth: '52rem', margin: '0 auto 3.5rem auto' }}>
        <Eyebrow>— Gurgaon Property Owners Partnership & Insights</Eyebrow>
        <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', color: '#fff', textTransform: 'uppercase', margin: '0.8rem 0' }}>
          SEO BLOGS & <span className="is-red">PROPERTY INSIGHTS</span>
        </h2>
        <p style={{ color: 'var(--mute)', fontSize: 'clamp(1rem, 1.3vw, 1.15rem)', lineHeight: 1.6 }}>
          Explore expert guides on how Gurgaon property owners, landlords, and real estate investors partner with BharatReviews to drive 3x faster tenant acquisition, verified reviews, and top search engine rankings.
        </p>
      </Reveal>

      {/* Blog Cards Grid */}
      <div className="blog__grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: 'var(--maxw)',
        margin: '0 auto',
      }}>
        {blogs.map((b, i) => (
          <Reveal key={b.id} delay={i * 120} style={{
            background: 'rgba(255, 255, 255, 0.035)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.35s var(--ease), border-color 0.35s var(--ease), box-shadow 0.35s var(--ease)',
          }}>
            <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
              <img
                src={b.image}
                alt={b.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s var(--ease)',
                }}
              />
              <span style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'var(--orange)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: '700',
                padding: '0.35em 0.85em',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {b.category}
              </span>
            </div>

            <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--mute-2)', marginBottom: '0.8rem' }}>
                <span>{b.date}</span>
                <span>•</span>
                <span>{b.readTime}</span>
              </div>

              <h3 style={{
                fontSize: '1.28rem',
                fontWeight: '700',
                color: '#fff',
                lineHeight: 1.4,
                marginBottom: '0.9rem',
              }}>
                {b.title}
              </h3>

              <p style={{
                fontSize: '0.94rem',
                color: 'var(--mute)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                flex: 1,
              }}>
                {b.excerpt}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {b.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: '0.74rem',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.75)',
                    padding: '0.25em 0.75em',
                    borderRadius: '999px',
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveBlog(b)}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 77, 25, 0.15)',
                  border: '1px solid rgba(255, 77, 25, 0.35)',
                  color: '#ff8a5c',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.3s var(--ease), color 0.3s var(--ease)',
                }}
              >
                Read Full Article ➔
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Partner Callout Box */}
      <Reveal style={{
        maxWidth: 'var(--maxw)',
        margin: '4rem auto 0 auto',
        padding: '3rem 2.5rem',
        borderRadius: '32px',
        background: 'radial-gradient(100% 140% at 90% 10%, rgba(255, 77, 25, 0.22), transparent 70%), linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
        border: '1px solid rgba(255, 77, 25, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justify-content: 'space-between',
        gap: '2rem',
      }}>
        <div style={{ maxWidth: '42rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Gurgaon Property Owners & Real Estate Partners
          </span>
          <h3 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)', fontWeight: '800', color: '#fff', margin: '0.5rem 0 0.8rem 0' }}>
            Own Property in Gurgaon? Partner with BharatReviews Today.
          </h3>
          <p style={{ color: 'var(--mute)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Boost your property visibility across DLF Cyber City, Golf Course Road, Sohna Road, and Dwarka Expressway with our SEO marketing, video reviews, and pre-screened tenant outreach.
          </p>
        </div>
        <div>
          <CtaButton href="#contact">Partner With Us Now</CtaButton>
        </div>
      </Reveal>

      {/* Blog Article Reader Modal */}
      {activeBlog && (
        <div
          className="blog-modal-backdrop"
          onClick={() => setActiveBlog(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem 1rem',
            overflowY: 'auto',
          }}
        >
          <div
            className="blog-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d0806',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '28px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(1.8rem, 4vw, 3.2rem)',
              position: 'relative',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveBlog(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '1.4rem',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              ✕
            </button>

            <span style={{ color: 'var(--orange)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
              {activeBlog.category}
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#fff', margin: '0.6rem 0 1rem 0', lineHeight: 1.3 }}>
              {activeBlog.title}
            </h2>

            <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.88rem', color: 'var(--mute-2)', marginBottom: '1.5rem' }}>
              <span>By {activeBlog.author}</span>
              <span>•</span>
              <span>{activeBlog.date}</span>
              <span>•</span>
              <span>{activeBlog.readTime}</span>
            </div>

            <img
              src={activeBlog.image}
              alt={activeBlog.title}
              style={{ width: '100%', borderRadius: '18px', maxHeight: '380px', objectFit: 'cover', marginBottom: '2rem' }}
            />

            <div
              className="blog-article-body"
              dangerouslySetInnerHTML={{ __html: activeBlog.content }}
              style={{
                color: 'rgba(255,255,255,0.88)',
                fontSize: '1.06rem',
                lineHeight: 1.75,
              }}
            />

            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line-soft)', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveBlog(null)}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '999px',
                  background: 'var(--orange)',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
