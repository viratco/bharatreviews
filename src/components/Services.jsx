import { CtaButton, Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'
import logo from '../assets/brand/logo.png'

// Card imagery, keyed by file name: generated decor/workspace stills plus two
// brand-coloured artworks (reach, rise) rendered for the SEO card.
const photos = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/services/*.jpg', { eager: true, import: 'default' })).map(
    ([file, src]) => [file.split('/').pop().replace(/\.jpg$/, ''), src],
  ),
)

/* One collage per service card. Positions are % of the art box; each plate is
   tilted by `rot`, drifts at its own `par` rate on scroll, and later plates sit
   on top. Kinds: photo | logo | stat (a figure from the benefits list) | words. */
const COLLAGES = [
  // Branding & Digital Marketing
  [
    { kind: 'photo', src: 'brand-kit', ratio: '4 / 3', w: 48, top: 50, left: 4, rot: 4, par: 0.1 },
    { kind: 'photo', src: 'vase', ratio: '3 / 4', w: 34, top: 2, left: 60, rot: 6, par: -0.08 },
    { kind: 'stat', benefit: 1, ratio: '1 / 1', w: 30, top: 60, left: 58, rot: -5, par: 0.12 },
    { kind: 'logo', ratio: '16 / 9', w: 56, top: 4, left: 0, rot: -4, par: -0.06 },
  ],
  // Online Media & PR Management
  [
    { kind: 'photo', src: 'mic', ratio: '3 / 4', w: 36, top: 2, left: 2, rot: -5, par: 0.09 },
    { kind: 'photo', src: 'reading-corner', ratio: '4 / 3', w: 54, top: 4, left: 42, rot: 4, par: -0.1 },
    { kind: 'words', words: ['PR', 'Media', 'Reputation'], ratio: '16 / 10', w: 50, top: 58, left: 44, rot: -4, par: 0.07 },
    { kind: 'stat', benefit: 2, ratio: '1 / 1', w: 30, top: 60, left: 8, rot: 5, par: -0.12 },
  ],
  // Professional Web Design & Development
  [
    { kind: 'photo', src: 'desk', ratio: '4 / 3', w: 54, top: 4, left: 0, rot: -4, par: 0.11 },
    { kind: 'photo', src: 'arch', ratio: '3 / 4', w: 34, top: 0, left: 60, rot: 6, par: -0.09 },
    { kind: 'words', words: ['Design', 'Build', 'Launch'], ratio: '16 / 10', w: 50, top: 58, left: 4, rot: 3, par: -0.07 },
    { kind: 'stat', benefit: 0, ratio: '1 / 1', w: 30, top: 60, left: 60, rot: -5, par: 0.12 },
  ],
  // Search Engine Optimization
  [
    { kind: 'photo', src: 'reach', ratio: '4 / 3', w: 54, top: 6, left: 0, rot: 5, par: -0.1 },
    { kind: 'photo', src: 'rise', ratio: '3 / 4', w: 34, top: 0, left: 60, rot: -6, par: 0.09 },
    { kind: 'words', words: ['Rank', 'Reach', 'Convert'], ratio: '16 / 10', w: 50, top: 58, left: 6, rot: -3, par: 0.07 },
    { kind: 'stat', benefit: 3, ratio: '1 / 1', w: 30, top: 60, left: 62, rot: 5, par: -0.11 },
  ],
]

// "500+ Created Projects" -> { value: '500+', label: 'Created Projects' }
function splitFigure(title = '') {
  const m = String(title).match(/^([\d.,]+\+?)\s+(.+)$/)
  return m ? { value: m[1], label: m[2] } : { value: title, label: '' }
}

function PlateContent({ plate, benefits }) {
  switch (plate.kind) {
    case 'photo':
      return photos[plate.src] ? (
        <img className="plate__img" src={photos[plate.src]} alt="" loading="lazy" decoding="async" />
      ) : null
    case 'logo':
      return <img className="plate__logo" src={logo} alt="" loading="lazy" decoding="async" />
    case 'stat': {
      // figures come from the benefits list, so they always match the rest of the site
      const { value, label } = splitFigure(benefits[plate.benefit]?.title)
      return (
        <span className="plate__stat">
          <b>{value}</b>
          <i>{label}</i>
        </span>
      )
    }
    default:
      return (
        <span className="plate__words">
          {plate.words.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </span>
      )
  }
}

export function Services({ t }) {
  return (
    <section className="svcs" id="leistungen">
      <div className="svcs__head">
        <Reveal v="fade">
          <Eyebrow>{t.services.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="svcs__title" data-reveal="fade">
          <SplitText as="span" text={t.services.title} stagger={50} delay={120} />
        </h2>
      </div>

      {t.services.items.map((item, i) => (
        <Reveal
          key={item.title}
          as="article"
          v="panel"
          className={`svc svc--${i % 2 ? 'flip' : 'norm'}`}
        >
          <div className="svc__copy" data-stagger="90" data-stagger-base="120">
            <h3 data-reveal="fade">
              <SplitText as="span" text={item.title} stagger={50} delay={200} />
            </h3>
            {item.paras.map((p) => (
              <p key={p} data-reveal="up">
                {p}
              </p>
            ))}
            <div data-reveal="up">
              <CtaButton>{t.services.cta}</CtaButton>
            </div>
          </div>

          <div className="svc__art" data-stagger="100" data-stagger-base="200" aria-hidden="true">
            {COLLAGES[i % COLLAGES.length].map((plate, j) => (
              <span
                key={j}
                className={`plate plate--${plate.kind}`}
                data-reveal="fade"
                data-par={plate.par}
                style={{
                  '--rot': `${plate.rot}deg`,
                  '--ratio': plate.ratio,
                  width: `${plate.w}%`,
                  top: `${plate.top}%`,
                  left: `${plate.left}%`,
                }}
              >
                <PlateContent plate={plate} benefits={t.benefits.items} />
              </span>
            ))}
          </div>
        </Reveal>
      ))}
    </section>
  )
}
