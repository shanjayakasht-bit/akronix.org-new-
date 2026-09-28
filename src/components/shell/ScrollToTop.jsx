import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { OFFSET, docTop } from '../../lib/useScrollToId'

/* Lenis owns the scroll position when it is running; window.scrollTo is the
   reduced-motion path, where Lenis never mounts.

   A link with a hash on another page -- "/#slots" from the footer and from
   /building's closing section -- lands on that element, not the top. The new
   page mounts only after the old one's 200ms exit, so the element is waited
   for, a frame at a time, for up to two seconds; if it never appears, the page
   simply stays at the top. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    const top = (y) => (lenis ? lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y))
    top(0)
    if (!hash) return undefined

    const id = decodeURIComponent(hash.slice(1))
    const until = performance.now() + 2000
    let frame
    const seek = () => {
      const el = document.getElementById(id)
      if (el) top(Math.max(0, docTop(el) - OFFSET))
      else if (performance.now() < until) frame = requestAnimationFrame(seek)
    }
    frame = requestAnimationFrame(seek)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, lenis])

  return null
}
