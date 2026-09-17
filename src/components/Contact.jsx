import { useState } from 'react'
import { Reveal } from './Ui.jsx'

export function Contact({ t, lang }) {
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    // Wire this up to your CRM / booking endpoint.
    setSent(true)
  }

  return (
    <section className="contact" id="kontakt">
      <Reveal className="contact__card" v="panel">
        <h2 data-reveal="up">{t.contact.title}</h2>
        <p className="contact__sub" data-reveal="up" style={{ '--delay': '90ms' }}>
          {t.contact.sub}
        </p>

        {sent ? (
          <p className="contact__ok" role="status">
            {t.contact.sent}
          </p>
        ) : (
          <form className="form" onSubmit={submit} data-stagger="70" data-stagger-base="160">
            <label data-reveal="up">
              <span>{t.contact.first}*</span>
              <input name="first" required autoComplete="given-name" />
            </label>
            <label data-reveal="up">
              <span>{t.contact.last}*</span>
              <input name="last" required autoComplete="family-name" />
            </label>
            <label data-reveal="up">
              <span>{t.contact.email}*</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label data-reveal="up">
              <span>{t.contact.phone}</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="form--wide" data-reveal="up">
              <span>{t.contact.lang}</span>
              <select name="language" defaultValue={lang}>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </label>

            <button className="form__submit" type="submit">
              {t.contact.submit}
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
            </button>
          </form>
        )}
      </Reveal>
    </section>
  )
}
