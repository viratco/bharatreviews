import { Arcs } from './Atmosphere.jsx'
import heroPhoto from '../assets/hero.jpg'
import { CtaButton } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

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
        <li data-reveal="right">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </li>
        <li data-reveal="right">
          <a href="#" aria-label="TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.2 3h-2.7v12.1a2.6 2.6 0 1 1-2.2-2.6v-2.8a5.4 5.4 0 1 0 4.9 5.4V9.4a6.4 6.4 0 0 0 3.7 1.2V7.8a3.7 3.7 0 0 1-3.7-3.7V3Z" />
            </svg>
          </a>
        </li>
      </ul>

      <div className="hero__foot" data-hero-out="">
        <span className="badge" data-reveal="pop" style={{ '--delay': '250ms' }}>
          {t.hero.badge}
        </span>

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
