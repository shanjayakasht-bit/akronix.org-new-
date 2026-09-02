import { useEffect, useState } from 'react'

/* Matches a media query and re-renders when the answer changes.
 *
 * The first value is read synchronously in the initialiser rather than left to
 * an effect: read after mount, a component that behaves differently on mobile
 * renders its desktop self for one frame first. In the nav that frame is
 * visible -- a page restored mid-scroll would contract the pill and expand it
 * again. `window` is guarded because the routes are server-rendered for the
 * smoke check; nothing hydrates that output, so there is no mismatch to worry
 * about.
 */
export function useMediaQuery(query, fallback = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? fallback : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])

  return matches
}
