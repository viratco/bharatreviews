import { Arcs } from './Atmosphere.jsx'
import heroPhoto from '../assets/hero.jpg'
import { CtaButton } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'
import { SOCIAL } from '../brand.js'

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.65h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.72c0-1.37-.03-3.12-1.9-3.12-1.9 0-2.2 1.48-2.2 3.02V21h-4V9Z" />
    </svg>
  ),
}

export function Hero({ t, ready = true }) {
  return (
    // data-intro-gate: reveals in here wait until the welcome sequence hands off
    <section className="hero" id="top" data-intro-gate="">
      {/* Depth layers, back to front: photo, legibility wash, line work.
          The photo drifts and scales slightly on scroll; the scale always
          outpaces the translate so no edge is ever exposed. */}
      <div className="hero__bg">
        <img
          className="hero__subject"
          src={heroPhoto}
          alt=""
          data-par-scale="0.12"
          fetchPriority="high"
        />
        <div className="hero__vignette" />
        <div className="hero__arcwrap" data-par="-0.12" data-rot="8">
          <Arcs />
        </div>
      </div>

      <div className="hero__lede" data-hero-out="">
        <p>
          <strong>{t.hero.lede.split('.')[0]}.</strong>
          {t.hero.lede.slice(t.hero.lede.indexOf('.') + 1)}
        </p>
      </div>

      <ul className="hero__social" data-stagger="90" data-stagger-base="900" aria-label="Social">
        {SOCIAL.map((profile) => (
          <li key={profile.id} data-reveal="right">
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${profile.name} (opens in a new tab)`}
            >
              {ICONS[profile.id]}
            </a>
          </li>
        ))}
      </ul>

      <div className="hero__foot" data-hero-out="">
        {t.hero.badge && (
          <span className="badge" data-reveal="pop" style={{ '--delay': '250ms' }}>
            {t.hero.badge}
          </span>
        )}

        {/* masked per-word rise — reads as type being set, not a fade */}
        <h1 className={`hero__title${ready ? ' is-in' : ''}`}>
          {t.hero.title.map((line, i) => (
            <SplitText key={line} as="span" text={line} stagger={70} delay={420 + i * 160} />
          ))}
        </h1>

        <div data-reveal="up" style={{ '--delay': '1000ms' }}>
          <CtaButton>{t.hero.cta}</CtaButton>
        </div>
      </div>

      <div className="hero__scroll" data-reveal="fade" style={{ '--delay': '1400ms' }} aria-hidden="true">
        <span className="hero__scrollline" />
      </div>
    </section>
  )
}
