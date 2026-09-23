import { testimonials } from '../content.js'
import { Rail, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

function Stars() {
  return (
    <div className="stars" aria-label="5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5-4.7-4.6 6.5-.9L12 2.6Z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials({ t, lang }) {
  return (
    <section className="proof">
      <div className="proof__head">
        <h2 className="proof__title" data-reveal="fade">
          <SplitText as="span" text={t.proof.titleA} stagger={45} delay={80} />{' '}
          <SplitText as="span" className="is-red" text={t.proof.titleAccent} stagger={45} delay={240} />{' '}
          <SplitText as="span" text={t.proof.titleB} stagger={45} delay={320} />
        </h2>
        <Reveal v="up" delay={520}>
          <p className="proof__sub">
            {t.proof.subA}
            <strong>{t.proof.subB}</strong>
          </p>
        </Reveal>
      </div>

      <Reveal v="fade" delay={100}>
        <Rail className="proof__rail" ariaLabel="Client testimonials">
          {testimonials.map((q, i) => (
            <figure
              key={q.name}
              className="quote"
              data-reveal="up"
              data-spot=""
              style={{ '--delay': `${i * 90}ms` }}
            >
              <Stars />
              <figcaption>
                <span className="quote__ava" aria-hidden="true">
                  {q.name.split(' ').pop()[0]}
                </span>
                <span>
                  <b>{q.name}</b>
                  <i>{q.role}</i>
                </span>
              </figcaption>
              <blockquote>{lang === 'de' ? q.text : q.textEn}</blockquote>
            </figure>
          ))}
        </Rail>
      </Reveal>
    </section>
  )
}
