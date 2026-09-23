import { useEffect } from 'react'

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/**
 * One rAF loop drives every scroll-linked effect on the page.
 *
 * Each frame does ALL reads first, then ALL writes, so we never interleave
 * getBoundingClientRect() with style mutation (that would thrash layout).
 * Output values are lerped rather than set straight from scrollY — that's
 * what makes the parallax feel smooth without hijacking native scrolling.
 */
export function useScrollFX(deps = []) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const bar = document.querySelector('.progress')
    const marqueeTracks = [...document.querySelectorAll('.marq__track')]

    // element -> smoothed state
    const items = [...document.querySelectorAll('[data-par], [data-par-scale], [data-rot], [data-hero-out]')].map(
      (el) => ({
        el,
        speed: parseFloat(el.dataset.par ?? el.dataset.parScale ?? '0') || 0,
        rot: parseFloat(el.dataset.rot ?? '0') || 0,
        heroOut: el.hasAttribute('data-hero-out'),
        scaleAmt: parseFloat(el.dataset.parScale ?? '0') || 0,
        cur: 0,
        target: 0,
        rect: null,
      }),
    )

    let scrollY = window.scrollY
    let lastScrollY = scrollY
    let velocity = 0
    let marqueeOffset = 0
    let marqueeWidth = 0
    let running = true
    let frame = 0

    const measureMarquee = () => {
      // track holds the list twice; one loop is half its scroll width
      marqueeWidth = marqueeTracks[0] ? marqueeTracks[0].scrollWidth / 2 : 0
    }
    measureMarquee()

    const onResize = () => {
      measureMarquee()
      items.forEach((it) => (it.rect = null))
    }
    window.addEventListener('resize', onResize)

    const tick = () => {
      if (!running) return
      frame = requestAnimationFrame(tick)

      const vh = window.innerHeight
      scrollY = window.scrollY
      const rawVel = scrollY - lastScrollY
      lastScrollY = scrollY
      velocity = lerp(velocity, rawVel, 0.12)

      /* ---------- READ PASS ---------- */
      for (const it of items) {
        const r = it.el.getBoundingClientRect()
        // -1 (below the fold) .. 0 (centred) .. 1 (above the fold)
        const centre = r.top + r.height / 2
        it.target = clamp((vh / 2 - centre) / (vh / 2 + r.height / 2), -1.4, 1.4)
        it.rect = r
      }
      const docH = document.documentElement.scrollHeight - vh
      const progress = docH > 0 ? clamp(scrollY / docH, 0, 1) : 0

      /* ---------- WRITE PASS ---------- */
      for (const it of items) {
        it.cur = lerp(it.cur, it.target, 0.085)
        const s = it.el.style

        if (it.heroOut) {
          // hero content drifts up and dissolves on the way out
          const out = clamp(scrollY / (vh * 0.85), 0, 1)
          s.setProperty('--py', `${out * -110}px`)
          // clamp: a negative opacity is invalid CSS (browsers silently fix it)
          s.setProperty('--po', `${Math.max(0, 1 - out * 1.15).toFixed(3)}`)
          continue
        }
        if (it.rot) {
          s.setProperty('--rz', `${it.cur * it.rot}deg`)
          continue
        }
        s.setProperty('--py', `${it.cur * it.speed * 100}px`)
        if (it.scaleAmt) s.setProperty('--ps', `${1 + Math.abs(it.cur) * 0.08}`)
      }

      if (bar) bar.style.setProperty('--p', progress.toFixed(4))

      // marquee: constant drift, nudged by how fast the user is scrolling
      if (marqueeWidth > 0) {
        marqueeOffset -= 0.55 + velocity * 0.35
        if (marqueeOffset <= -marqueeWidth) marqueeOffset += marqueeWidth
        if (marqueeOffset > 0) marqueeOffset -= marqueeWidth
        for (const t of marqueeTracks) {
          t.style.setProperty('--mq', `${marqueeOffset.toFixed(2)}px`)
        }
      }
    }

    frame = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Cursor spotlight: writes the pointer's position, relative to whichever
 * [data-spot] element is under it, so CSS can draw a soft glow that follows
 * the cursor. One delegated listener covers every card on the page, including
 * ones added later (filtered tiles, re-rendered lists).
 */
export function useSpotlight(deps = []) {
  useEffect(() => {
    // no spotlight on touch: :hover sticks after a tap and the glow would stay
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    // one write per frame, however fast the pointer reports
    let frame = 0
    let pending = null
    const paint = () => {
      frame = 0
      const { el, x, y } = pending
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${Math.round(x - r.left)}px`)
      el.style.setProperty('--my', `${Math.round(y - r.top)}px`)
    }
    const onMove = (e) => {
      const el = e.target.closest?.('[data-spot]')
      if (!el) return
      pending = { el, x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(paint)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Magnetic pull on buttons — the cursor tugs the button toward itself. */
export function useMagnetic(deps = []) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const targets = [...document.querySelectorAll('.cta, .form__submit, .hdr__cta')]
    const strength = 0.32
    const cleanups = []

    for (const el of targets) {
      const move = (e) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        el.style.setProperty('--mx', `${dx * strength}px`)
        el.style.setProperty('--my', `${dy * strength}px`)
      }
      const reset = () => {
        el.style.setProperty('--mx', '0px')
        el.style.setProperty('--my', '0px')
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', reset)
      cleanups.push(() => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', reset)
        reset()
      })
    }

    return () => cleanups.forEach((fn) => fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
