/**
 * Procedural ember/smoke backdrop — pure SVG turbulence, no external assets.
 * Used behind the hero and as the ambient wash further down the page.
 */
export function Smoke({ id = 'smoke', seed = 7, opacity = 0.55 }) {
  return (
    <svg className="smoke" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
      <defs>
        <filter id={`${id}-f`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0035 0.006"
            numOctaves="5"
            seed={seed}
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="180" />
          <feGaussianBlur stdDeviation="14" />
        </filter>

        <radialGradient id={`${id}-g`} cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#ffb27a" />
          <stop offset="34%" stopColor="#ff5f1f" />
          <stop offset="68%" stopColor="#7b2a0a" />
          <stop offset="100%" stopColor="#150703" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill={`url(#${id}-g)`} filter={`url(#${id}-f)`} opacity={opacity} />
    </svg>
  )
}

/** Thin concentric arcs that sweep across the hero's left edge. */
export function Arcs() {
  return (
    <svg className="arcs" viewBox="0 0 600 900" fill="none" aria-hidden="true">
      {[210, 300, 400, 520].map((r, i) => (
        <circle
          key={r}
          cx="80"
          cy="450"
          r={r}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={i === 1 ? 1.4 : 0.8}
        />
      ))}
    </svg>
  )
}

/** The four-point sparkle used on the benefit cards. */
export function Spark({ className = '', ...rest }) {
  return (
    <svg
      className={`spark ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M50 2c2 26 20 46 48 48-28 2-46 22-48 48-2-26-20-46-48-48C30 48 48 28 50 2Z"
        fill="currentColor"
      />
    </svg>
  )
}
