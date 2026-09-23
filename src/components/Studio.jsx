import { useRef, useState } from 'react'
import { studioFilms } from '../content.js'
import { Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'
import { VideoLightbox } from './VideoLightbox.jsx'
import { useInViewPlayback } from '../hooks/useInViewPlayback.js'

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
      label: `${copy.lines.join(' ')} · ${copy.filmLabel}`,
      wide: true,
    }))
    .filter((f) => f.src)

  useInViewPlayback(stageRef, films.length, '.film__video')

  if (!films.length) return null

  return (
    <section className="studio" id="studio">
      <div className="studio__glow" aria-hidden="true" />

      <div className="studio__head">
        <Reveal v="fade">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="studio__title" data-reveal="fade">
          <SplitText as="span" text={copy.lines[0]} stagger={50} delay={120} />
          <SplitText as="span" className="is-chilli" text={copy.lines[1]} stagger={50} delay={300} />
        </h2>
      </div>

      <div className="studio__body">
        <div className="studio__copy" data-stagger="90">
          {copy.paras.map((p) => (
            <p key={p} data-reveal="up">
              {p}
            </p>
          ))}
        </div>
        <ul className="studio__skills" data-stagger="60" aria-label={copy.eyebrow.replace('— ', '')}>
          {copy.skills.map((skill) => (
            <li key={skill} data-reveal="up">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* the clips are letterboxed in-file, so a 2.39:1 frame with object-fit
          cover trims the baked-in black bars instead of stacking new ones */}
      <div className="studio__films" ref={stageRef} data-stagger="120">
        {films.map((film, i) => (
          <article className="film" key={film.key} data-reveal="up">
            <button
              type="button"
              className="film__frame"
              onClick={() => setOpen(i)}
              aria-label={`${ui.play}: ${copy.filmLabel} ${film.n}`}
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
              <span>{film.runtime}</span>
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
