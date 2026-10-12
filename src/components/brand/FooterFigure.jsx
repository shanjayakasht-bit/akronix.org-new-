import { motion } from 'motion/react'
import { FIGURE } from './figure'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.65, 0, 0.35, 1]

/* The figure in outline, drawn once as the footer comes into view. Fainter than
   the hero's: it is a signature, not a statement. */
export function FooterFigure({ className }) {
  const reduced = usePrefersReducedMotion()
  const draw = (delay) =>
    reduced
      ? { initial: false }
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 2.6, ease: EASE, delay },
        }
  return (
    <svg viewBox={FIGURE.viewBox} fill="none" aria-hidden="true" className={className}>
      {[FIGURE.body, FIGURE.leg, FIGURE.head].map((d, i) => (
        <motion.path key={i} d={d} stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" strokeLinejoin="round" {...draw(i * 0.35)} />
      ))}
    </svg>
  )
}
