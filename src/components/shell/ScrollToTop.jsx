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
    /* Lenis clamps a jump to the page height it last measured. A lazy page
       arrives after a moment of Suspense fallback, when the document is one
       screen tall, and Lenis has measured THAT -- so a jump to "#pos" was
       clamped to 832px and landed far short. Asking it to measure again first
       is the whole fix. */
    const top = (y) => {
      if (!lenis) return window.scrollTo(0, y)
      lenis.resize()
      return lenis.scrollTo(y, { immediate: true, force: true })
    }
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
