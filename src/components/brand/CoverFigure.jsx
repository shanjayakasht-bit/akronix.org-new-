import { motion } from 'motion/react'
import { FIGURE } from './figure'

const EASE = [0.65, 0, 0.35, 1]

/* The Akronix figure in outline, for the cover of a product card.
 *
 * It takes its colour from the card (`currentColor`), so on a solid cover it is
 * white and on a pale one it is the product's own hue. At rest it is fully drawn
 * and faint; when the card above it is hovered its outline is traced again from
 * nothing, which is the one thing on the card that moves by itself.
 *
 * It is driven by variants, not by its own hover: put `initial="rest"`,
 * `animate="rest"` and `whileHover="hover"` on the card (a `motion` element) and
 * the figure follows. */
const draw = {
  rest: { pathLength: 1, opacity: 0.4 },
  hover: {
    pathLength: [0, 1],
    opacity: 0.85,
    transition: { pathLength: { duration: 1.5, ease: EASE }, opacity: { duration: 0.4 } },
  },
}

export function CoverFigure({ className }) {
  return (
    <svg viewBox={FIGURE.viewBox} fill="none" aria-hidden="true" className={className}>
      <motion.path d={FIGURE.body} stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" variants={draw} />
      <motion.path d={FIGURE.leg} stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" variants={draw} />
      <motion.path d={FIGURE.head} stroke="currentColor" strokeWidth="0.9" fill="currentColor" fillOpacity="0.28" variants={draw} />
    </svg>
  )
}
