import { portfolio } from '../content.js'
import { Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

// Every screenshot in assets/portfolio, keyed by slug — adding a site is one
// data entry plus one .jpg, no import to wire up.
const shots = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/portfolio/*.jpg', { eager: true, import: 'default' }),
  ).map(([file, src]) => [file.split('/').pop().replace(/\.jpg$/, ''), src]),
)

const domainOf = (url) => new URL(url).hostname.replace(/^www\./, '')

// The "visit" pill trails the pointer across the screenshot.
function trackCursor(e) {
  const frame = e.currentTarget
  const r = frame.getBoundingClientRect()
  frame.style.setProperty('--cx', `${e.clientX - r.left}px`)
  frame.style.setProperty('--cy', `${e.clientY - r.top}px`)
}

export function Portfolio({ t, lang }) {
  const copy = t.portfolio

  return (
    <section className="folio" id="portfolio">
      <div className="folio__head">
        <Reveal v="fade">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="folio__title" data-reveal="fade">
          <SplitText as="span" text={copy.titleA} stagger={50} delay={120} />
          <SplitText as="span" className="is-red" text={copy.titleB} stagger={50} delay={280} />
        </h2>
        <Reveal v="up" delay={440}>
          <p className="folio__sub">{copy.sub}</p>
        </Reveal>
      </div>

      <ul className="folio__grid">
        {portfolio.map((site, i) => {
          const featured = i === 0
          // cascade across each row rather than down the whole list
          const delay = featured ? 0 : ((i - 1) % 2) * 120
          const shot = shots[site.slug]

          return (
            <li
              key={site.slug}
              className={`folio__item${featured ? ' is-featured' : ''}`}
              data-reveal="up"
              style={{ '--delay': `${delay}ms` }}
            >
              <a
                className="pcard"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} — ${copy.visit} (${copy.newTab})`}
              >
                <div className="pcard__frame" onPointerEnter={trackCursor} onPointerMove={trackCursor}>
                  <div className="pcard__bar" aria-hidden="true">
                    <span className="pcard__dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="pcard__url">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                      {domainOf(site.url)}
                    </span>
                    <span className="pcard__spacer" />
                  </div>

                  <div className="pcard__shot">
                    {shot ? (
                      <img
                        className="pcard__img"
                        src={shot}
                        alt=""
                        width="1440"
                        height="900"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      // no screenshot yet: branded placeholder instead of a broken image
                      <span className="pcard__missing">{domainOf(site.url)}</span>
                    )}
                  </div>

                  <span className="pcard__cursor" aria-hidden="true">
                    {copy.visit} ↗
                  </span>
                </div>

                <div className="pcard__meta">
                  <span className="pcard__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="pcard__name">{site.name}</h3>
                  <span className="pcard__type">{site.type[lang] ?? site.type.en}</span>
                  <span className="pcard__go" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
