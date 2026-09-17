import { CtaButton, Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

/* Each service card carries a tilted collage of original gradient plates.
   `par` gives every plate its own drift rate for in-card depth. */
const COLLAGES = [
  [
    { hue: 350, rot: -8, w: 46, top: 6, left: 2, par: 0.1 },
    { hue: 218, rot: 6, w: 34, top: 0, left: 52, par: -0.07 },
    { hue: 26, rot: -5, w: 40, top: 46, left: 14, par: 0.13 },
    { hue: 8, rot: 9, w: 30, top: 52, left: 62, par: -0.1 },
  ],
  [
    { hue: 200, rot: 7, w: 38, top: 4, left: 4, par: -0.08 },
    { hue: 18, rot: -6, w: 44, top: 12, left: 46, par: 0.11 },
    { hue: 320, rot: 4, w: 32, top: 56, left: 20, par: -0.12 },
    { hue: 40, rot: -9, w: 30, top: 60, left: 58, par: 0.08 },
  ],
  [
    { hue: 12, rot: -6, w: 42, top: 2, left: 8, par: 0.12 },
    { hue: 260, rot: 8, w: 32, top: 10, left: 56, par: -0.09 },
    { hue: 150, rot: -4, w: 36, top: 52, left: 6, par: 0.07 },
    { hue: 30, rot: 6, w: 38, top: 56, left: 50, par: -0.11 },
  ],
  [
    { hue: 190, rot: 5, w: 40, top: 8, left: 3, par: -0.1 },
    { hue: 34, rot: -7, w: 34, top: 0, left: 50, par: 0.09 },
    { hue: 300, rot: 6, w: 30, top: 50, left: 16, par: -0.06 },
    { hue: 4, rot: -5, w: 40, top: 54, left: 52, par: 0.13 },
  ],
]

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
                className="plate"
                data-reveal="fade"
                data-par={plate.par}
                style={{
                  '--h': plate.hue,
                  '--rot': `${plate.rot}deg`,
                  width: `${plate.w}%`,
                  top: `${plate.top}%`,
                  left: `${plate.left}%`,
                }}
              />
            ))}
          </div>
        </Reveal>
      ))}
    </section>
  )
}
