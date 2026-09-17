import { BRAND } from '../brand.js'
import { Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

export function Footer({ t }) {
  return (
    <footer className="ftr">
      <div className="ftr__hero">
        <h2 className="ftr__mark" data-reveal="fade">
          <SplitText as="span" text={BRAND.lines[0]} stagger={60} delay={80} />
          <SplitText as="span" text={BRAND.lines[1]} stagger={60} delay={220} />
        </h2>
        <Reveal v="blur" delay={260}>
          <div className="ftr__tile" data-par="0.14" aria-hidden="true" />
        </Reveal>
      </div>

      <div className="ftr__bar" data-stagger="60">
        <p className="ftr__copy" data-reveal="up">
          {t.footer.copy}
        </p>
        <ul className="ftr__links">
          {t.footer.links.map((l) => (
            <li key={l} data-reveal="up">
              <a href="#">{l}</a>
            </li>
          ))}
        </ul>
      </div>

      <p className="ftr__legal" data-reveal="fade">
        {t.footer.disclaimer}
      </p>
    </footer>
  )
}
