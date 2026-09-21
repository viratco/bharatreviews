import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Segmented category switcher. An orange marker glides under the selected
 * tab; when the tabs outgrow the screen the bar becomes one scrollable row
 * (it never wraps), and the selected tab is kept in view.
 * Keyboard: ←/→ move between tabs, Home/End jump to the ends.
 */
export function CategoryTabs({ groups, active, onChange, ariaLabel, idBase }) {
  const scrollerRef = useRef(null)
  const listRef = useRef(null)
  const index = Math.max(0, groups.findIndex((g) => g.category === active))

  // Measure before paint so the marker never flashes in the wrong place.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const place = () => {
      const tab = list.querySelector('[aria-selected="true"]')
      if (!tab) return
      list.style.setProperty('--ix', `${tab.offsetLeft}px`)
      list.style.setProperty('--iw', `${tab.offsetWidth}px`)
    }
    place()
    // enable the glide only after the first placement (no slide-in on load)
    const raf = requestAnimationFrame(() => list.setAttribute('data-ready', ''))
    // label widths change when fonts load or the language switches
    const ro = new ResizeObserver(place)
    ro.observe(list)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [active, groups])

  // Keep the selected tab visible when the bar scrolls (phones, many tabs).
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const scroller = scrollerRef.current
    const tab = listRef.current?.querySelector('[aria-selected="true"]')
    if (!scroller || !tab || scroller.scrollWidth <= scroller.clientWidth) return
    const s = scroller.getBoundingClientRect()
    const r = tab.getBoundingClientRect()
    scroller.scrollBy({ left: r.left + r.width / 2 - (s.left + s.width / 2), behavior: 'smooth' })
  }, [active])

  const onKeyDown = (e) => {
    const last = groups.length - 1
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[
      e.key
    ]
    if (next === undefined) return
    e.preventDefault()
    onChange(groups[next].category)
    listRef.current.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  if (!groups.length) return null

  return (
    <div className="vtabs" ref={scrollerRef}>
      <div className="vtabs__list" role="tablist" aria-label={ariaLabel} ref={listRef} onKeyDown={onKeyDown}>
        <span className="vtabs__glide" aria-hidden="true" />
        {groups.map((g, i) => {
          const selected = i === index
          return (
            <button
              key={g.category}
              id={`${idBase}-tab-${g.category}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${idBase}-panel`}
              tabIndex={selected ? 0 : -1}
              className="vtab"
              onClick={() => onChange(g.category)}
            >
              <span>{g.label}</span>
              <span className="vtab__count">{String(g.count).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
