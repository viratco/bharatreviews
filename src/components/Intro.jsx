import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------
   Timing. MIN keeps the sequence from flashing past on a warm cache;
   MAX is the backstop so a stalled asset can never trap the visitor.
   ------------------------------------------------------------------ */
const MIN_MS = 2100
const MIN_MS_REDUCED = 650
const MAX_MS = 6000
const COLS = 7
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/?'

// intro.css reads the same values through custom properties on .intro
const TIMING = {
  normal: { ignite: 420, col: 950, stagger: 65, lag: 130, handoff: 220 },
  quick: { ignite: 240, col: 700, stagger: 40, lag: 90, handoff: 120 },
}

const COPY = {
  de: { skip: 'Überspringen', loading: (name) => `${name} wird geladen` },
  en: { skip: 'Skip intro', loading: (name) => `Loading ${name}` },
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reports 0..1 as the first screen's dependencies settle: webfonts, the
 * hero photo (decoded, so it can't pop in behind the shutters) and window
 * load. Failures count as settled — MAX_MS is the real guard; this only
 * decides how early the intro is allowed to finish.
 */
function trackAssets(onProgress) {
  const tasks = []

  if (document.fonts?.ready) tasks.push(document.fonts.ready)

  const img = document.querySelector('.hero__subject')
  if (img) {
    const decode = () => (img.decode ? img.decode().catch(() => {}) : undefined)
    tasks.push(
      img.complete
        ? decode()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
          }).then(decode),
    )
  }

  if (document.readyState !== 'complete') {
    tasks.push(new Promise((resolve) => window.addEventListener('load', resolve, { once: true })))
  }

  if (!tasks.length) {
    onProgress(1)
    return
  }
  let settled = 0
  for (const task of tasks) {
    Promise.resolve(task)
      .catch(() => {})
      .then(() => onProgress(++settled / tasks.length))
  }
}

/** One pre-rendered glow sprite, stamped for every ember via drawImage. */
function makeEmberSprite() {
  const size = 64
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = size
  const g = sprite.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255, 238, 214, 1)')
  grad.addColorStop(0.16, 'rgba(255, 176, 96, 0.95)')
  grad.addColorStop(0.42, 'rgba(255, 92, 28, 0.42)')
  grad.addColorStop(1, 'rgba(255, 50, 0, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return sprite
}

function spawnEmber(e, w, h, anywhere) {
  e.x = Math.random() * w
  e.y = anywhere ? Math.random() * h : h + 10 + Math.random() * 80
  e.size = 5 + Math.random() * 15
  e.vy = 0.3 + Math.random() * 1.15
  e.sway = 0.15 + Math.random() * 0.75
  e.freq = 0.0012 + Math.random() * 0.0028
  e.phase = Math.random() * Math.PI * 2
  e.flicker = Math.random() * Math.PI * 2
  e.life = anywhere ? Math.random() * 2000 : 0
  e.maxLife = 2400 + Math.random() * 3600
  return e
}

/**
 * Welcome sequence: load → ignite → exit, then the parent unmounts it.
 *
 *   load    glyphs scramble into the wordmark, embers build, the counter
 *           follows real asset loading
 *   ignite  glow flares, embers rush upward, letters lift out
 *   exit    shutters sweep up centre-first (black, then orange); the page
 *           is released underneath and settles out of a push-in
 *
 * Any click, key, wheel or touch skips to a faster version of the same
 * sequence rather than cutting it — the hand-off stays intact.
 */
export function Intro({ lines, name, tagline, badge, lang = 'de', onReveal, onDone }) {
  const [reduced] = useState(prefersReduced)
  const [phase, setPhase] = useState('load')
  const [quick, setQuick] = useState(false)

  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const skipRef = useRef(false)
  const fx = useRef({ progress: 0, burst: 0 }) // shared with the ember loop

  const timing = quick ? TIMING.quick : TIMING.normal
  const copy = COPY[lang] ?? COPY.en
  const mid = (COLS - 1) / 2
  const offsets = lines.map((_, li) => lines.slice(0, li).join('').length)

  const requestSkip = useCallback(() => {
    if (skipRef.current) return
    skipRef.current = true
    setQuick(true)
  }, [])

  // Before first paint: hold the page — header up, hero pushed in, scroll locked.
  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('is-intro')
    // a restored mid-page scroll would reveal the wrong section
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return () => html.classList.remove('is-intro')
  }, [])

  // Skip on any deliberate input while loading.
  useEffect(() => {
    if (phase !== 'load') return
    const onInput = (e) => {
      if (e.type === 'keydown' && ['Tab', 'Shift', 'Alt', 'Control', 'Meta'].includes(e.key)) return
      requestSkip()
    }
    const events = ['pointerdown', 'wheel', 'touchstart', 'keydown']
    const opts = { passive: true }
    events.forEach((type) => window.addEventListener(type, onInput, opts))
    return () => events.forEach((type) => window.removeEventListener(type, onInput, opts))
  }, [phase, requestSkip])

  // Load phase: counter + glyph scramble on one rAF loop, written straight to
  // the DOM so React isn't re-rendering 60 times a second.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const digits = [...root.querySelectorAll('.intro__digit')]
    const glyphs = [...root.querySelectorAll('.sc__glyph')].map((el, i) => {
      const ch = el.dataset.ch
      const blank = !ch.trim()
      el.classList.remove('is-set')
      el.textContent = reduced || blank ? ch : randomGlyph()
      return {
        el,
        ch,
        resolveAt: reduced || blank ? 0 : 420 + i * 72 + Math.random() * 70,
        nextSwap: 0,
        done: false,
      }
    })

    let cancelled = false
    let loaded = 0
    trackAssets((p) => {
      if (!cancelled) loaded = p
    })

    const minMs = reduced ? MIN_MS_REDUCED : MIN_MS
    const start = performance.now()
    let last = start
    let shown = 0
    let hitAt = 0 // when the target first reached 100
    let lastDigits = ''
    let pending = glyphs.length
    let raf = 0

    const frame = (now) => {
      if (cancelled) return
      const elapsed = now - start
      // Real frame time (capped only against tab-switch gaps). A tight cap
      // here made the counter's finish depend on frame rate: on a janky
      // device each slow frame closed just a fraction of the gap.
      const dt = Math.min(250, now - last)
      last = now
      const skipping = skipRef.current

      // Time-shaped, but held below ~94% until the assets have settled.
      let target
      if (skipping || elapsed >= MAX_MS || (loaded >= 1 && elapsed >= minMs)) target = 100
      else target = easeOutCubic(Math.min(1, elapsed / minMs)) * (loaded >= 1 ? 100 : 86 + loaded * 8)

      const rate = skipping ? 0.24 : 0.075
      shown += (target - shown) * (1 - Math.pow(1 - rate, dt / 16.667))
      if (target === 100) {
        if (!hitAt) hitAt = now
        // wall-clock guarantee: however few frames we get, finish on time
        if (shown > 99.6 || now - hitAt > 900) shown = 100
      }

      const text = String(Math.floor(shown)).padStart(3, '0')
      if (text !== lastDigits) {
        for (let i = 0; i < 3; i++) digits[i].textContent = text[i]
        lastDigits = text
      }
      root.style.setProperty('--p', (shown / 100).toFixed(4))
      fx.current.progress = shown / 100

      if (pending) {
        for (const g of glyphs) {
          if (g.done) continue
          if (skipping || elapsed >= g.resolveAt) {
            g.el.textContent = g.ch
            g.el.classList.add('is-set')
            g.done = true
            pending--
          } else if (now >= g.nextSwap) {
            g.el.textContent = randomGlyph()
            g.nextSwap = now + 40 + Math.random() * 50
          }
        }
      }

      if (shown === 100 && !pending) {
        setPhase('ignite')
        return
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Ignite: flare and lift the letters, then open the shutters.
  useEffect(() => {
    if (phase !== 'ignite') return
    fx.current.burst = 1
    const t = setTimeout(() => setPhase('exit'), reduced ? 0 : timing.ignite)
    return () => clearTimeout(t)
  }, [phase, reduced, timing])

  // Exit: release the page as the shutters start, reveal the hero copy a beat
  // later (once the lower half is uncovered), unmount when the sweep clears.
  useEffect(() => {
    if (phase !== 'exit') return
    document.documentElement.classList.remove('is-intro')

    const revealT = setTimeout(() => onReveal?.(), reduced ? 0 : timing.handoff)
    const clearMs = reduced ? 480 : timing.col + Math.ceil(mid) * timing.stagger + timing.lag + 80
    const doneT = setTimeout(() => onDone?.(), clearMs)
    return () => {
      clearTimeout(revealT)
      clearTimeout(doneT)
    }
  }, [phase, reduced, timing, mid, onReveal, onDone])

  // Embers: additive-blended sprites that build with the counter.
  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const sprite = makeEmberSprite()
    let w = 0
    let h = 0
    let embers = []

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(120, Math.max(40, (w * h) / 14000)))
      embers = Array.from({ length: count }, () => spawnEmber({}, w, h, true))
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let last = performance.now()
    let burst = 0

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(48, now - last)
      last = now
      const k = dt / 16.667
      const progress = fx.current.progress
      burst += (fx.current.burst - burst) * (1 - Math.pow(0.9, k))

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // the fire builds with the counter: more embers, brighter, then a rush
      const active = Math.round(embers.length * (0.35 + 0.65 * progress))
      const intensity = 0.35 + 0.65 * progress

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life += dt
        e.y -= e.vy * k * (1 + burst * 7)
        e.x += Math.sin(e.phase + now * e.freq) * e.sway * k
        if (e.y < -40 || e.life > e.maxLife) spawnEmber(e, w, h, false)
        if (i >= active) continue

        const t = e.life / e.maxLife
        const alpha =
          Math.min(1, t * 5) *
          Math.min(1, (1 - t) * 2.5) *
          (0.68 + 0.32 * Math.sin(now * 0.011 + e.flicker)) *
          intensity
        if (alpha < 0.01) continue

        const s = e.size * (1 + burst * 0.5)
        ctx.globalAlpha = alpha
        ctx.drawImage(sprite, e.x - s / 2, e.y - s / 2, s, s)
      }
      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  const shutters = (variant) => (
    <div className={`intro__cols${variant ? ` intro__cols--${variant}` : ''}`} aria-hidden="true">
      {Array.from({ length: COLS }, (_, i) => (
        <span key={i} className="intro__col" style={{ '--i': i, '--dist': Math.abs(i - mid) }} />
      ))}
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={[
        'intro',
        phase !== 'load' && 'is-ignite',
        phase === 'exit' && 'is-exit',
        quick && 'is-quick',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--cols': COLS }}
    >
      {/* orange layer sits under the black one and trails it out */}
      {shutters('accent')}
      {shutters()}

      <div className="intro__glow" aria-hidden="true" />
      <div className="intro__flash" aria-hidden="true" />
      <canvas ref={canvasRef} className="intro__embers" aria-hidden="true" />

      <div className="intro__content" aria-hidden="true">
        {tagline && <p className="intro__meta intro__meta--tl">{tagline}</p>}
        {badge && <p className="intro__meta intro__meta--tr">{badge}</p>}

        <div className="intro__mark">
          {lines.map((line, li) => (
            <span className="intro__line" key={line}>
              {[...line].map((ch, ci) => {
                const i = offsets[li] + ci
                return (
                  <span
                    key={ci}
                    className="sc__char"
                    style={{ '--d': `${90 + i * 40}ms`, '--j': i }}
                  >
                    {/* the invisible real letter holds the width steady
                        while narrower/wider glyphs cycle over it */}
                    <span className="sc__ghost">{ch}</span>
                    <span className="sc__glyph" data-ch={ch}>
                      {ch}
                    </span>
                  </span>
                )
              })}
            </span>
          ))}
        </div>

        <div className="intro__count">
          <span className="intro__digit">0</span>
          <span className="intro__digit">0</span>
          <span className="intro__digit">0</span>
          <sup>%</sup>
        </div>
      </div>

      <button type="button" className="intro__skip" onClick={requestSkip}>
        {copy.skip}
      </button>

      <div className="intro__bar" aria-hidden="true">
        <i />
      </div>

      <p className="sr-only" role="status">
        {copy.loading(name)}
      </p>
    </div>
  )
}
