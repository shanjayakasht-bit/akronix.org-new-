import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { FIGURE } from '../brand/figure'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

/* The Akronix figure, with a head that watches the pointer (Step 7).
 *
 * The body and the leg are drawn as faint ink outlines and stay almost still
 * behind the page's headline. The head -- the red one -- follows the cursor across
 * the window on a spring, a few units either way, and the body leans the other
 * way by a fraction of that, so the mark seems to be looking at whatever you are.
 * It is the one playful thing on a page otherwise set quite plainly, and it is
 * the brand's own character doing it rather than a stock illustration.
 *
 * Nothing moves on touch (there is no pointer to follow) or with reduced motion;
 * it is then simply the mark, at rest. Decorative: hidden from assistive tech. */
export function PointerFigure({ className }) {
  const reduced = usePrefersReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 70, damping: 13, mass: 0.7 })
  const sy = useSpring(py, { stiffness: 70, damping: 13, mass: 0.7 })
  const hx = useTransform(sx, (v) => v * 16)
  const hy = useTransform(sy, (v) => v * 12)
  const bx = useTransform(sx, (v) => v * -3.5)
  const by = useTransform(sy, (v) => v * -2.5)

  useEffect(() => {
    if (reduced) return undefined
    const move = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      px.set((e.clientX / window.innerWidth - 0.5) * 2)
      py.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [reduced, px, py])

  return (
    <svg viewBox={FIGURE.viewBox} fill="none" aria-hidden="true" className={cx('overflow-visible', className)}>
      <motion.g style={reduced ? undefined : { x: bx, y: by }}>
        <path d={FIGURE.body} stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.9" strokeLinejoin="round" fill="currentColor" fillOpacity="0.035" />
        <path d={FIGURE.leg} stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.9" strokeLinejoin="round" fill="currentColor" fillOpacity="0.035" />
      </motion.g>
      <motion.g style={reduced ? undefined : { x: hx, y: hy }}>
        <path d={FIGURE.head} fill="var(--color-brand)" />
      </motion.g>
    </svg>
  )
}
