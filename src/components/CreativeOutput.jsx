import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { showcase } from '../content.js'
import { Pill, Reveal, Eyebrow } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'
import { VideoLightbox } from './VideoLightbox.jsx'
import { CategoryTabs } from './CategoryTabs.jsx'
import { useInViewPlayback } from '../hooks/useInViewPlayback.js'

// src/assets/showcase/<category>/<id>.(mp4|jpg), resolved to URLs by Vite
const files = import.meta.glob('../assets/showcase/*/*.{mp4,jpg}', { eager: true, import: 'default' })
const fileFor = (category, id, ext) => files[`../assets/showcase/${category}/${id}.${ext}`]

const ALL = 'all'
const ROW = 8 // px — grid row unit; every tile spans enough rows to keep its shape
const CAT_COLORS = ['#ff4d19', '#ffb020', '#3ccf91', '#5aa9ff', '#c77dff']
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'

const UI = {
  de: {
    all: 'Alle',
    more: (n) => `Alle ${n} Videos ansehen`,
    play: 'Video abspielen',
    close: 'Schließen',
    prev: 'Vorheriges Video',
    next: 'Nächstes Video',
  },
  en: {
    all: 'All',
    more: (n) => `Show all ${n} videos`,
    play: 'Play video',
    close: 'Close',
    prev: 'Previous video',
    next: 'Next video',
  },
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Random, but evenly mixed: each category is shuffled, then its clips are
 * spread across the whole sequence in proportion to its size — so a large
 * category never ends up clumped together at the end.
 */
function mixOrder() {
  return showcase
    .flatMap((g) =>
      shuffle(g.videos).map((v, i, arr) => ({ key: `${g.category}/${v.id}`, at: (i + Math.random()) / arr.length })),
    )
    .sort((a, b) => a.at - b.at)
    .map((x) => x.key)
}

/** Every clip that has a file, keyed "category/id"; entries without files are skipped. */
function resolveVideos(lang) {
  const byKey = new Map()
  showcase.forEach((g, gi) => {
    const badge = g.tag ?? g.label
    for (const v of g.videos) {
      const src = fileFor(g.category, v.id, 'mp4')
      if (!src) continue
      const key = `${g.category}/${v.id}`
      byKey.set(key, {
        key,
        category: g.category,
        wide: Boolean(v.wide),
        src,
        poster: fileFor(g.category, v.id, 'jpg'),
        label: badge[lang] ?? badge.en,
        color: CAT_COLORS[gi % CAT_COLORS.length],
      })
    }
  })
  return byKey
}

// Masonry via CSS grid: row spans are derived from the live column width so
// tall (9:16) and wide (16:9) clips keep their real shape at every size.
function useMasonryRows(gridRef) {
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const fit = () => {
      const cs = getComputedStyle(grid)
      const cols = cs.gridTemplateColumns.split(' ').length
      const gap = parseFloat(cs.columnGap) || 0
      const inner = grid.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const col = (inner - gap * (cols - 1)) / cols
      const span = Math.min(cols, 2)
      const wideW = span * col + (span - 1) * gap
      grid.style.setProperty('--rows-tall', Math.round(((col * 16) / 9 + gap) / ROW))
      grid.style.setProperty('--rows-wide', Math.round(((wideW * 9) / 16 + gap) / ROW))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(grid)
    return () => ro.disconnect()
  }, [gridRef])
}

// A long grid starts folded to about a screen and a quarter, fading out
// under a "show all" button, so the section stays tidy as work is added.
function useFold(gridRef) {
  const [fold, setFold] = useState({ limit: 0, needed: false })
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const check = () => {
      const limit = Math.round(Math.min(Math.max(window.innerHeight * 1.2, 760), 1250))
      const needed = grid.offsetHeight > limit + 200 // only fold if it hides a real amount
      setFold((f) => (f.limit === limit && f.needed === needed ? f : { limit, needed }))
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(grid)
    window.addEventListener('resize', check)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [gridRef])
  return fold
}

export function CreativeOutput({ t, lang }) {
  const ui = UI[lang] ?? UI.en
  const [order] = useState(mixOrder) // shuffled once per visit
  const byKey = useMemo(() => resolveVideos(lang), [lang])
  const all = useMemo(() => order.map((k) => byKey.get(k)).filter(Boolean), [order, byKey])

  // "All" first, then each category that actually has videos
  const tabs = useMemo(
    () => [
      { category: ALL, label: ui.all, count: all.length },
      ...showcase
        .map((g) => ({
          category: g.category,
          label: g.label[lang] ?? g.label.en,
          count: all.filter((v) => v.category === g.category).length,
        }))
        .filter((g) => g.count > 0),
    ],
    [all, lang, ui.all],
  )

  const [tab, setTab] = useState(ALL) // highlighted at once
  const [filter, setFilter] = useState(ALL) // applied once leaving tiles have faded
  const [open, setOpen] = useState(-1)
  const [expanded, setExpanded] = useState(false)
  const stageRef = useRef(null)
  const foldRef = useRef(null)
  const gridRef = useRef(null)
  const firstRects = useRef(null)
  const pending = useRef({ token: 0, anims: [] })

  const visible = filter === ALL ? all : all.filter((v) => v.category === filter)

  useMasonryRows(gridRef)
  const fold = useFold(gridRef)
  const folded = fold.needed && !expanded
  useInViewPlayback(stageRef, `${filter}|${folded}`)

  // Open the fold with a height glide from where it was cut off.
  const unfold = () => {
    const wrap = foldRef.current
    const from = wrap.offsetHeight
    setExpanded(true)
    if (reducedMotion()) return
    requestAnimationFrame(() => {
      wrap.style.overflow = 'hidden'
      const a = wrap.animate([{ height: `${from}px` }, { height: `${wrap.scrollHeight}px` }], {
        duration: 900,
        easing: EASE_OUT,
      })
      const done = () => (wrap.style.overflow = '')
      a.finished.then(done, done)
    })
  }

  const measure = () =>
    Object.fromEntries(
      [...gridRef.current.querySelectorAll('.vtile')].map((el) => [el.dataset.key, el.getBoundingClientRect()]),
    )

  // Filtering: fade out what's leaving, remember where the rest stood, swap
  // the list, then glide the survivors to their new places (FLIP below).
  const selectCategory = async (category) => {
    if (category === tab) return
    setTab(category)
    setOpen(-1)
    const p = pending.current
    const token = ++p.token
    p.anims.forEach((a) => a.cancel())
    p.anims = []

    if (gridRef.current && !reducedMotion()) {
      const leaving = [...gridRef.current.querySelectorAll('.vtile')].filter(
        (el) => category !== ALL && el.dataset.cat !== category,
      )
      p.anims = leaving.map((el) =>
        el.animate(
          [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.92)' },
          ],
          { duration: 220, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'forwards' },
        ),
      )
      // Never let the filter wait on an animation alone: a paused timeline
      // (background tab, throttled device) would leave it stuck forever.
      await Promise.race([
        Promise.all(p.anims.map((a) => a.finished.catch(() => {}))),
        new Promise((resolve) => setTimeout(resolve, 300)),
      ])
      if (token !== p.token) return // a newer choice took over
      firstRects.current = measure()
    }
    setFilter(category)
  }

  useLayoutEffect(() => {
    const first = firstRects.current
    firstRects.current = null
    if (!first || !gridRef.current) return
    for (const el of gridRef.current.querySelectorAll('.vtile')) {
      const from = first[el.dataset.key]
      if (!from) continue // newly shown: its CSS entrance runs instead
      const to = el.getBoundingClientRect()
      const dx = from.left - to.left
      const dy = from.top - to.top
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: 700,
        easing: EASE_OUT,
      })
    }
  }, [filter])

  return (
    <section className="output">
      <div className="output__head">
        <Reveal v="pop">
          <Pill>{t.output.pill}</Pill>
        </Reveal>
        <Reveal v="fade" delay={120}>
          <Eyebrow>{t.output.eyebrow}</Eyebrow>
        </Reveal>

        <h2 className="output__title" data-reveal="fade">
          <SplitText as="span" text={t.output.titleA} stagger={45} delay={150} />
          <SplitText as="span" className="is-red" text={t.output.titleB} stagger={45} delay={330} />
        </h2>

        <Reveal v="up" delay={520} className="output__sub-wrap">
          <p className="output__sub">{t.output.sub}</p>
        </Reveal>
      </div>

      <Reveal v="fade" delay={120} className="output__stage">
        <div ref={stageRef}>
          <CategoryTabs
            groups={tabs}
            active={tab}
            onChange={selectCategory}
            ariaLabel={t.output.pill}
            idBase="showcase"
          />

          <div
            ref={foldRef}
            className={`vfold${folded ? ' is-folded' : ''}`}
            style={folded ? { '--fold-h': `${fold.limit}px` } : undefined}
          >
          <div
            ref={gridRef}
            className="vgrid"
            role="tabpanel"
            id="showcase-panel"
            aria-labelledby={`showcase-tab-${tab}`}
          >
            {visible.map((v, i) => (
              <button
                key={v.key}
                type="button"
                data-key={v.key}
                data-cat={v.category}
                className={`vtile${v.wide ? ' is-wide' : ''}`}
                style={{ '--i': Math.min(i, 10), '--cat': v.color }}
                onClick={() => setOpen(i)}
                aria-label={`${ui.play}: ${v.label}`}
              >
                <video
                  className="vtile__video"
                  src={v.src}
                  poster={v.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <span className="vtile__tag">{v.label}</span>
                <span className="vtile__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
          </div>

          {folded && (
            <div className="vmore">
              <button type="button" className="vmore__btn" onClick={unfold}>
                {ui.more(visible.length)}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M6 9.5 12 15.5l6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {open >= 0 && (
        <VideoLightbox
          videos={visible}
          index={open}
          ui={ui}
          onIndex={setOpen}
          onClose={() => setOpen(-1)}
        />
      )}
    </section>
  )
}
