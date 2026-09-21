import { useEffect, useRef } from 'react'

const FOCUSABLE = 'button, video[controls], [href], [tabindex]:not([tabindex="-1"])'

/** Full-size player with sound. Esc closes, ←/→ step through the category. */
const pad = (n) => String(n).padStart(2, '0')

export function VideoLightbox({ videos, index, ui, onIndex, onClose }) {
  const rootRef = useRef(null)
  const closeRef = useRef(null)
  const video = videos[index]
  const count = videos.length
  const go = (step) => onIndex((index + step + count) % count)

  // Focus moves in, the page stops scrolling; both are undone on close.
  useEffect(() => {
    const returnTo = document.activeElement
    closeRef.current?.focus()
    document.documentElement.classList.add('is-modal')
    return () => {
      document.documentElement.classList.remove('is-modal')
      returnTo?.focus?.()
    }
  }, [])

  // Re-bound every render so the handlers always see the current index.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        // keep keyboard focus inside the dialog
        const els = [...rootRef.current.querySelectorAll(FOCUSABLE)]
        const first = els[0]
        const last = els.at(-1)
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div
      ref={rootRef}
      className="vlb"
      role="dialog"
      aria-modal="true"
      aria-label={`${video.label} ${pad(index + 1)}`}
      onClick={onClose}
    >
      <div className="vlb__body" onClick={(e) => e.stopPropagation()}>
        <video
          key={video.src}
          className={`vlb__video${video.wide ? ' is-wide' : ''}`}
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
        />
        <div className="vlb__bar">
          <span>
            {video.label} · {pad(index + 1)} / {pad(count)}
          </span>
          <div className="vlb__nav">
            <button type="button" onClick={() => go(-1)} aria-label={ui.prev}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 5.5 8 12l6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label={ui.next}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.5 5.5 16 12l-6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button ref={closeRef} type="button" className="vlb__close" onClick={onClose} aria-label={ui.close}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
