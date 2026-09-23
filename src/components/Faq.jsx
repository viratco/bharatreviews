import { useState } from 'react'
import { Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

export function Faq({ t }) {
  const [open, setOpen] = useState(0)

  return (
    <section className="faq" id="faq">
      <div className="faq__head">
        <Reveal v="fade">
          <Eyebrow>{t.faq.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="faq__title" data-reveal="fade">
          <SplitText as="span" text={t.faq.title} stagger={50} delay={120} />
        </h2>
      </div>

      <ul className="faq__list" data-stagger="85">
        {t.faq.items.map((item, i) => {
          const isOpen = open === i
          return (
            // open state lives in data-open, not className: the scroll-reveal
            // adds .is-in to this element itself, and a React className update
            // would wipe it (the row would go invisible but keep its space)
            <li key={item.q} data-reveal="up" data-open={isOpen ? '' : undefined}>
              <button
                type="button"
                className="faq__q"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <i className="faq__sign" aria-hidden="true" />
              </button>

              {/* grid-rows 0fr -> 1fr animates height without measuring it */}
              <div className="faq__a">
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
