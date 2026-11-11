import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* False for the first paint, true a beat later (true at once under reduced
 * motion). A block that starts at `opacity-0` and is switched to `opacity-100`
 * by this settles in with a CSS transition -- on a hard load too, which a
 * `motion` `initial` state does not on this site (STATUS, decision 20). */
export function useReady() {
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setReady(true)
      return undefined
    }
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [reduced])

  return ready
}
