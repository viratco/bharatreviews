import { useRef, useState } from 'react'
import { studioFilms } from '../content.js'
import { Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'
import { VideoLightbox } from './VideoLightbox.jsx'
import { useInViewPlayback } from '../hooks/useInViewPlayback.js'
import lockupImg from '../assets/brand/hot-chilli-lockup.png'
import wordmarkImg from '../assets/brand/hot-chilli-wordmark.png'

// the studio's films live alongside the showcase clips
const files = import.meta.glob('../assets/showcase/*/*.{mp4,jpg}', { eager: true, import: 'default' })
const fileFor = (key, ext) => files[`../assets/showcase/${key}.${ext}`]

const UI = {
  de: { play: 'Film abspielen', close: 'Schließen', prev: 'Vorheriger Film', next: 'Nächster Film' },
  en: { play: 'Play film', close: 'Close', prev: 'Previous film', next: 'Next film' },
}

export function Studio({ t, lang }) {
  const copy = t.studio
  const ui = UI[lang] ?? UI.en
  const [open, setOpen] = useState(-1)
  const stageRef = useRef(null)

  // entries whose files are missing are skipped rather than rendered broken
  const films = studioFilms
    .map((f, i) => ({
      ...f,
      src: fileFor(f.key, 'mp4'),
      poster: fileFor(f.key, 'jpg'),
      n: String(i + 1).padStart(2, '0'),
      label: `${f.title ?? copy.lines.join(' ')} · ${copy.filmLabel}`,
      wide: true,
    }))
    .filter((f) => f.src)

  useInViewPlayback(stageRef, films.length, '.film__video')

  if (!films.length) return null

  return (
    <section className="studio" id="studio">
      <div className="studio__glow" aria-hidden="true" />
      <div className="studio__beam" aria-hidden="true" />

      {/* Main Studio Showcase Hero */}
      <div className="studio__hero">
        {/* Left: Narrative, Wordmark Brand Title, Specs, & Skills */}
        <div className="studio__hero-left">
          <Reveal v="fade">
            <div className="studio__badge-row">
              <Eyebrow>{copy.eyebrow}</Eyebrow>
              {copy.badge && (
                <span className="studio__badge">
                  <span className="studio__badge-rec" />
                  {copy.badge}
                </span>
              )}
            </div>
          </Reveal>

          <div className="studio__brand" data-reveal="fade">
            <img
              src={wordmarkImg}
              alt="Hot Chilli"
              className="studio__wordmark-img"
              width="627"
              height="128"
            />
            <h2 className="studio__wordmark-sub">
              <SplitText as="span" text={copy.lines[1]} stagger={50} delay={180} />
            </h2>
          </div>

          <div className="studio__copy" data-stagger="90">
            {copy.paras.map((p) => (
              <p key={p} data-reveal="up">
                {p}
              </p>
            ))}
          </div>

          {copy.specs && (
            <div className="studio__specs" data-stagger="60">
              {copy.specs.map((s) => (
                <div key={s.label} className="studio__spec-item" data-reveal="up">
                  <span className="studio__spec-val">{s.val}</span>
                  <span className="studio__spec-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <ul className="studio__skills" data-stagger="60" aria-label={copy.eyebrow.replace('— ', '')}>
            {copy.skills.map((skill) => (
              <li key={skill} data-reveal="up">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Studio Camera Card with Cinematic Viewfinder HUD */}
        <div className="studio__hero-right" data-reveal="scale">
          <div className="studio__card">
            <div className="studio__card-glow" aria-hidden="true" />

            {/* Viewfinder crosshairs and technical metadata */}
            <div className="studio__card-hud" aria-hidden="true">
              <div className="hud__top">
                <span className="hud__rec">
                  <span className="hud__rec-dot" /> REC
                </span>
                <span className="hud__time">00:02:39:18</span>
                <span className="hud__res">4K RAW</span>
              </div>
              <div className="hud__crosshair hud__crosshair--tl" />
              <div className="hud__crosshair hud__crosshair--tr" />
              <div className="hud__crosshair hud__crosshair--bl" />
              <div className="hud__crosshair hud__crosshair--br" />
              <div className="hud__bottom">
                <span>FPS 24.00</span>
                <span>ANAMORPHIC 2.39:1</span>
                <span>ISO 800</span>
              </div>
            </div>

            <img
              src={lockupImg}
              alt="Hot Chilli Studios Cinema Production Unit"
              className="studio__card-img"
              loading="lazy"
              width="1024"
              height="682"
            />

            <div className="studio__card-footer">
              <div className="studio__card-info">
                <span className="studio__card-title">CINEMA CAMERA RIG · 35MM EQUIV</span>
                <span className="studio__card-sub">In-house production unit & cine lens package</span>
              </div>
              <span className="studio__card-tag">STUDIO RIG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reel Header */}
      <div className="studio__reel-header" data-reveal="fade">
        <div className="studio__reel-title">
          <span className="studio__reel-pill">FEATURED REEL</span>
          <h3>SELECTED CINEMATIC RELEASES</h3>
        </div>
        <p className="studio__reel-sub">Shot on location in 2.39:1 widescreen anamorphic</p>
      </div>

      {/* Films Grid */}
      <div className="studio__films" ref={stageRef} data-stagger="120">
        {films.map((film, i) => (
          <article className="film" key={film.key} data-reveal="up">
            <button
              type="button"
              className="film__frame"
              onClick={() => setOpen(i)}
              aria-label={`${ui.play}: ${film.title ?? copy.filmLabel} ${film.n}`}
            >
              <video
                className="film__video"
                src={film.src}
                poster={film.poster}
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                aria-hidden="true"
              />
              <span className="film__marks" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="film__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
            </button>
            <p className="film__meta">
              <span className="film__n">{film.n}</span>
              <span className="film__title">{film.title ?? `Film ${film.n}`}</span>
              <span className="film__runtime">{film.runtime}</span>
              <span className="film__fmt">2.39:1</span>
            </p>
          </article>
        ))}
      </div>

      {open >= 0 && (
        <VideoLightbox
          videos={films}
          index={open}
          ui={ui}
          onIndex={setOpen}
          onClose={() => setOpen(-1)}
        />
      )}
    </section>
  )
}
