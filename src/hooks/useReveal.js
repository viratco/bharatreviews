import { useEffect } from 'react'

/**
 * Adds `.is-in` to every [data-reveal] once it enters the viewport.
 *
 * Because this class is added from outside React, a [data-reveal] element must
 * not also have a className that React changes — React would overwrite the
 * class list and the element would drop back to opacity 0. Use a data-
 * attribute for that state instead (see Faq.jsx).
 *
 * A container marked [data-stagger="70"] hands each descendant reveal an
 * incrementing --delay, so grids and lists cascade instead of snapping in
 * together. Elements are unobserved after firing — reveals play once.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    // Anything under [data-intro-gate] would otherwise animate unseen behind
    // the welcome curtain; hold it until html.is-intro is removed.
    const gated = document.documentElement.classList.contains('is-intro')
    const nodes = [...document.querySelectorAll('[data-reveal]:not(.is-in)')].filter(
      (n) => !(gated && n.closest('[data-intro-gate]')),
    )
    if (!nodes.length) return

    // assign stagger delays up front
    document.querySelectorAll('[data-stagger]').forEach((group) => {
      const step = parseInt(group.dataset.stagger, 10) || 70
      const base = parseInt(group.dataset.staggerBase, 10) || 0
      const kids = [...group.querySelectorAll('[data-reveal]')].filter(
        (k) => k.closest('[data-stagger]') === group,
      )
      kids.forEach((k, i) => {
        if (!k.style.getPropertyValue('--delay')) {
          k.style.setProperty('--delay', `${base + i * step}ms`)
        }
      })
    })

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target
          el.classList.add('is-in')
          io.unobserve(el)
          // drop the compositor hint once the transition has finished
          const delay = parseFloat(el.style.getPropertyValue('--delay')) || 0
          window.setTimeout(() => el.classList.add('is-done'), 1400 + delay)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
