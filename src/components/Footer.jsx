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
        <div className="ftr__who">
          <p className="ftr__copy" data-reveal="up">{t.footer.copy}</p>
          {t.footer.address && (
            <address className="ftr__address" data-reveal="up">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.footer.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                  <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2.6" />
                </svg>
                {t.footer.address}
              </a>
            </address>
          )}
        </div>
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
