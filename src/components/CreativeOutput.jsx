import { Pill, Rail, Reveal, Eyebrow } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

/* Placeholder creative tiles — original gradient artwork.
   Replace each with <video>/<img> from your own reel. */
const TILES = [
  { n: '01', tag: 'low-angle close-up', hue: 18, tall: true, par: 0.09 },
  { n: '02', tag: 'editorial still', hue: 8, tall: false, par: -0.06 },
  { n: '03', tag: 'product hero', hue: 28, tall: true, par: 0.12 },
  { n: '04', tag: 'UGC talking head', hue: 2, tall: false, par: -0.09 },
  { n: '05', tag: 'lifestyle motion', hue: 22, tall: true, par: 0.07 },
  { n: '06', tag: 'studio profile', hue: 12, tall: false, par: -0.05 },
  { n: '07', tag: 'cinematic wide', hue: 30, tall: true, par: 0.11 },
]

export function CreativeOutput({ t }) {
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

      {/* tiles drift at differing rates so the row gains depth on scroll */}
      <Reveal v="fade" delay={120}>
        <Rail className="output__rail" ariaLabel="Creative showreel">
          {TILES.map((tile, i) => (
            <figure
              key={tile.n}
              className={`tile ${tile.tall ? 'tile--tall' : ''}`}
              style={{ '--h': tile.hue, '--delay': `${i * 80}ms` }}
              data-par={tile.par}
            >
              <span className="tile__inner" data-reveal="blur" style={{ '--delay': `${i * 80}ms` }}>
                <span className="tile__n">{tile.n}</span>
                <span className="tile__tag">{tile.tag}</span>
                <span className="tile__grain" aria-hidden="true" />
                <span className="tile__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
              </span>
            </figure>
          ))}
        </Rail>
      </Reveal>
    </section>
  )
}
