import { useEffect, useRef, useState } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Re-insert a thousands separator every 3 digits, e.g. 2000 -> "2.000". */
function group(n, sep) {
  const s = String(n)
  if (!sep) return s
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}

/**
 * Counts up to `to` the first time it scrolls into view, then stops.
 * `sep` keeps the locale's thousands separator ("." in DE, "," in EN).
 */
export function Counter({ to, sep = '', duration = 1700, className = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(() => (prefersReduced() ? to : 0))
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return
        done.current = true
        io.disconnect()

        const start = performance.now()
        const step = (now) => {
          const t = Math.min((now - start) / duration, 1)
          setValue(Math.round(easeOut(t) * to))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={`counter ${className}`}>
      {group(value, sep)}
    </span>
  )
}

/**
 * Animates the leading number of a heading, preserving everything around it.
 *   "2.000+ Glückliche Kunden" -> [2.000]+ Glückliche Kunden
 *   "15+ Expert Team Members"  -> [15]+ Expert Team Members
 * Grouped numbers are matched whole, so "2.000" counts to 2000 rather than 2.
 */
export function CountingTitle({ text }) {
  const str = String(text)
  const match = str.match(/\d[\d.,]*\d|\d/)
  if (!match) return <>{str}</>

  const raw = match[0]
  const sepMatch = raw.match(/[.,]/)
  const sep = sepMatch ? sepMatch[0] : ''
  const num = parseInt(raw.replace(/[.,]/g, ''), 10)
  if (!Number.isFinite(num)) return <>{str}</>

  return (
    <>
      {str.slice(0, match.index)}
      <Counter to={num} sep={sep} />
      {str.slice(match.index + raw.length)}
    </>
  )
}
