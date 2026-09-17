import { Spark } from './Atmosphere.jsx'
import { CtaButton, Reveal } from './Ui.jsx'
import { CountingTitle } from './Counter.jsx'

export function Benefits({ t }) {
  return (
    <section className="benefits">
      {/* cards fly in from alternating sides with a little rotation, so the
          grid assembles itself rather than fading in as one block */}
      <div className="benefits__grid" data-stagger="110">
        {t.benefits.items.map((it, i) => (
          <Reveal
            key={it.title}
            as="article"
            v={i % 2 === 0 ? 'tilt-l' : 'tilt-r'}
            className={`bcard bcard--${it.variant}`}
          >
            <h3>
              <CountingTitle text={it.title} />
            </h3>
            <p>{it.body}</p>
            {i === 0 && <Spark className="bcard__spark" data-rot="140" />}
          </Reveal>
        ))}
      </div>

      <Reveal className="benefits__cta" v="pop" delay={180}>
        <CtaButton>{t.benefits.cta}</CtaButton>
      </Reveal>
    </section>
  )
}
