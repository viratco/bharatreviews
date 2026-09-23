import { useEffect } from 'react'

/**
 * Plays muted preview videos only while they are on screen, and pauses them
 * otherwise — off-screen clips would burn bandwidth and battery for nothing.
 * Skipped entirely under reduced-motion or Save-Data.
 *
 * `key` re-runs the observer when the set of videos changes (e.g. a filter).
 */
export function useInViewPlayback(rootRef, key, selector = '.vtile__video') {
  useEffect(() => {
    const root = rootRef.current
    const calm =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData
    if (!root || calm) return

    const videos = [...root.querySelectorAll(selector)]
    const io = new IntersectionObserver(
      (entries) => {
        for (const { target: v, isIntersecting } of entries) {
          if (isIntersecting) {
            v.muted = true // browsers only autoplay silent video
            v.play().catch(() => {})
          } else {
            v.pause()
          }
        }
      },
      { threshold: 0.5 },
    )
    videos.forEach((v) => io.observe(v))
    return () => {
      io.disconnect()
      videos.forEach((v) => v.pause())
    }
  }, [rootRef, key, selector])
}
