import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* A number that counts up to its value as it comes into view. Only ever used
 * for counts that are true -- twelve products, six in development, eight lines
 * of work. It is a way of showing a fact, never of inventing one. */
export function Counter({ to, pad = 2, duration = 1.6, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? to : 0)

  useEffect(() => {
    if (!inView || reduced) return undefined
    const run = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => run.stop()
  }, [inView, reduced, to, duration])

  return (
    <span ref={ref} className={className}>
      {String(n).padStart(pad, '0')}
    </span>
  )
}
