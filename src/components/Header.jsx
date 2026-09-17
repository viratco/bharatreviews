import { useEffect, useState } from 'react'
import { Wordmark } from './Ui.jsx'

export function Header({ t, lang, setLang }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className={`hdr ${solid ? 'is-solid' : ''}`}>
        <Wordmark />

        <nav className="hdr__nav">
          <a href="#projekte">{t.nav.cases}</a>
          <a href="#leistungen">{t.nav.services}</a>
          <a href="#team">{t.nav.team}</a>
          <a href="#blog">{t.nav.blog}</a>
          <a href="#partner">{t.nav.partner}</a>
        </nav>

        <a className="hdr__cta" href="#kontakt">
          {t.nav.contact}
        </a>

        <button
          type="button"
          className={`burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </header>

      {/* language switch floats independently, always top-right */}
      <div className="langbar" role="group" aria-label="Language">
        {['en', 'de'].map((code) => (
          <button
            key={code}
            type="button"
            className={lang === code ? 'is-active' : ''}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={`drawer ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        <nav>
          <a href="#projekte">{t.nav.cases}</a>
          <a href="#leistungen">{t.nav.services}</a>
          <a href="#team">{t.nav.team}</a>
          <a href="#blog">{t.nav.blog}</a>
          <a href="#partner">{t.nav.partner}</a>
          <a href="#faq">FAQ</a>
          <a href="#kontakt">{t.nav.contact}</a>
        </nav>
      </div>
    </>
  )
}
