import { useCallback, useEffect, useState } from 'react'
import { content } from './content.js'
import { useReveal } from './hooks/useReveal.js'
import { useScrollFX, useMagnetic, useSpotlight } from './hooks/useScrollFX.js'

import { Intro } from './components/Intro.jsx'
import { BRAND } from './brand.js'
import { Header } from './components/Header.jsx'
import { Hero } from './components/Hero.jsx'
import { Marquee } from './components/Marquee.jsx'
import { Benefits } from './components/Benefits.jsx'
import { CreativeOutput } from './components/CreativeOutput.jsx'
import { Portfolio } from './components/Portfolio.jsx'
import { BrandStory } from './components/BrandStory.jsx'
import { Services } from './components/Services.jsx'
import { Studio } from './components/Studio.jsx'
import { Testimonials } from './components/Testimonials.jsx'
import { Faq } from './components/Faq.jsx'
import { Contact } from './components/Contact.jsx'
import { Footer } from './components/Footer.jsx'

import './styles/site.css'
import './styles/motion.css'
import './styles/intro.css'
import './styles/showcase.css'
import './styles/studio.css'

export default function App() {
  const lang = 'en' // English-only site
  const t = content[lang]

  // introDone: shutters are opening, hero copy may animate.
  // introGone: sweep finished, loader unmounted.
  const [introDone, setIntroDone] = useState(false)
  const [introGone, setIntroGone] = useState(false)
  const handleReveal = useCallback(() => setIntroDone(true), [])
  const handleDone = useCallback(() => setIntroGone(true), [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // re-scan on language change: the DOM is rebuilt with new text nodes
  // introDone re-runs the scan so the gated hero reveals are picked up
  useReveal([lang, introDone])
  useScrollFX([lang])
  useMagnetic([lang])
  useSpotlight([lang])

  return (
    <div className="page">
      {!introGone && (
        <Intro
          lines={BRAND.lines}
          name={BRAND.name}
          tagline={t.hero.title.join(' · ')}
          badge={t.hero.badge}
          lang={lang}
          onReveal={handleReveal}
          onDone={handleDone}
        />
      )}

      <div className="progress" aria-hidden="true" />

      <Header t={t} />

      <main>
        <Hero t={t} ready={introDone} />
        <Marquee t={t} />
        <Benefits t={t} />
        <CreativeOutput t={t} lang={lang} />
        <Portfolio t={t} lang={lang} />
        <BrandStory t={t} />
        <Services t={t} />
        <Studio t={t} lang={lang} />
        <Testimonials t={t} lang={lang} />
        <Faq t={t} />
        <Contact t={t} />
      </main>

      <Footer t={t} />
    </div>
  )
}
