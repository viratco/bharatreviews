import { teamMembers } from '../content.js'
import { Eyebrow, Reveal } from './Ui.jsx'
import { SplitText } from './SplitText.jsx'

export function Team({ t }) {
  return (
    <section className="team" id="team">
      <div className="team__head">
        <Reveal v="fade">
          <Eyebrow>{t.team?.eyebrow ?? '— Expert Members Behind BharatReviews'}</Eyebrow>
        </Reveal>
        <h2 className="team__title" data-reveal="fade">
          <SplitText as="span" text={t.team?.titleA ?? 'EXPERTS BEHIND'} stagger={50} delay={120} />{' '}
          <SplitText
            as="span"
            className="is-red"
            text={t.team?.titleB ?? 'BHARATREVIEWS'}
            stagger={50}
            delay={300}
          />
        </h2>
      </div>

      {/* cards rise in sequence, each lifting on hover */}
      <div className="team__grid" data-stagger="95">
        {teamMembers.map((member, i) => (
          <Reveal key={member.name} as="article" v="up" className="tcard">
            {/* numbered by position, so removing someone never leaves a gap */}
            <span className="tcard__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{member.name}</h3>
            <span className="tcard__role">{member.role}</span>
            <span className="tcard__glow" aria-hidden="true" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
