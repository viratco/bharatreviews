import { CtaButton, Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

const R = 49 // circle radius in the 100x100 viewBox
const LEN = 2 * Math.PI * R

export function BrandStory({ t }) {
  return (
    <section className="story">
      <div className="story__head">
        <Reveal v="fade">
          <Eyebrow>{t.story.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="story__title" data-reveal="fade">
          <SplitText as="span" text={t.story.titleA} stagger={45} delay={120} />
          <SplitText as="span" className="is-red" text={t.story.titleB} stagger={45} delay={300} />
        </h2>
      </div>

      {/* each ring's outline is stroked on rather than just appearing */}
      <div className="story__rings">
        {t.story.steps.map((s, i) => (
          <article
            key={s.n}
            className="ring"
            data-reveal="scale"
            style={{ '--delay': `${i * 170}ms` }}
          >
            <svg className="ring__svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                className="ring__circle"
                cx="50"
                cy="50"
                r={R}
                style={{ '--len': LEN, '--delay': `${i * 170 + 180}ms` }}
              />
            </svg>

            <span className="ring__n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        ))}
      </div>

      <Reveal className="story__cta" v="pop" delay={120}>
        <CtaButton>{t.story.cta}</CtaButton>
      </Reveal>
    </section>
  )
}
