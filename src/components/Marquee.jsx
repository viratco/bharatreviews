import { partners } from '../content.js'

export function Marquee({ t }) {
  const track = [...partners, ...partners]

  return (
    <section className="marq" id="projekte">
      <p className="marq__label" data-reveal="up">
        {t.marquee}
      </p>

      <div className="marq__mask">
        {/* offset comes from the rAF engine: constant drift + scroll velocity */}
        <ul className="marq__track">
          {track.map((name, i) => (
            <li key={`${name}-${i}`} aria-hidden={i >= partners.length}>
              <span className="marq__logo">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
