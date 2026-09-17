import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../brand.js'

/* ---------- arrow-in-circle CTA ---------- */
export function CtaButton({ children, href = '#kontakt', tone = 'light' }) {
  return (
    <a className={`cta cta--${tone}`} href={href}>
      <span>{children}</span>
      <i className="cta__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </i>
    </a>
  )
}

/* ---------- soft glass pill ---------- */
export function Pill({ children }) {
  return <span className="pill">{children}</span>
}

/* ---------- section eyebrow (red, small) ---------- */
export function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>
}

/* ---------- reveal wrapper ----------
   `v` picks the motion variant: up | down | left | right | scale | pop |
   blur | fade | tilt-l | tilt-r | panel  (see styles/motion.css) */
export function Reveal({
  as: Tag = 'div',
  v = 'up',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      data-reveal={v}
      className={className}
      style={{ ...(delay ? { '--delay': `${delay}ms` } : null), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ---------- horizontal rail with prev/next ---------- */
export function Rail({ children, className = '', arrows = true, ariaLabel }) {
  const ref = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const sync = () => {
    const el = ref.current
    if (!el) return
    setEdge({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    })
  }

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const nudge = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.7), behavior: 'smooth' })
  }

  return (
    <div className={`railwrap ${className}`}>
      <div className="rail" ref={ref} onScroll={sync} aria-label={ariaLabel}>
        {children}
      </div>

      {arrows && (
        <>
          <button
            type="button"
            className="rail__nav rail__nav--prev"
            onClick={() => nudge(-1)}
            disabled={edge.start}
            aria-label="Previous"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className="rail__nav rail__nav--next"
            onClick={() => nudge(1)}
            disabled={edge.end}
            aria-label="Next"
          >
            <Chevron dir="right" />
          </button>
        </>
      )}
    </div>
  )
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------- brand wordmark ---------- */
export function Wordmark({ className = '' }) {
  return (
    <a href="#top" className={`wordmark ${className}`} aria-label={`${BRAND.name} — home`}>
      <span className="wordmark__a">{BRAND.lines[0]}</span>
      <span className="wordmark__b">{BRAND.lines[1]}</span>
    </a>
  )
}
