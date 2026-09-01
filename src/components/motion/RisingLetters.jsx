import { motion, useTransform } from 'motion/react'
import { cx } from '../../lib/cx'

/* One letter, hinged at its own baseline.
 *
 * It lifts from lying flat to standing the way a body pushes its upper half up
 * off the ground: the top of the letter travels furthest, the middle less, the
 * foot not at all. That is `scaleY` about `origin-bottom`.
 *
 * It deliberately does NOT translate. An earlier version slid each letter up
 * out of an overflow-hidden mask and was rejected -- the letters arrived from
 * below their line instead of standing up from it. The brief is that a letter
 * never leaves the place it already occupies. Do not reintroduce a translate.
 *
 * The driver is a plain 0-1 MotionValue, so the same letter serves both the
 * scrubbed headings in `SectionHead` and the played-once headline in `Hero`.
 * It is a MotionValue rather than `initial`/`animate` props on purpose: with
 * the prop form Motion rendered these spans at `transform: none` and never ran
 * the animation at all. */
export function Rising({ progress, start, end, className, children }) {
  const scaleY = useTransform(progress, (p) =>
    easeOut(Math.min(1, Math.max(0, (p - start) / (end - start)))),
  )
  return (
    <motion.span style={{ scaleY }} className={cx('inline-block origin-bottom', className)}>
      {children}
    </motion.span>
  )
}

/* Fraction of the whole run a single letter takes. The letters overlap -- each
 * takes a third of the run and they are spread across the other two thirds --
 * which is what makes it read as a wave travelling along the line rather than
 * a row of separate pop-ins. */
export const LETTER_SPAN = 0.34

const easeOut = (t) => 1 - (1 - t) ** 3

/* Letter i of n gets its slice of a 0-1 progress. */
export function letterRange(i, n) {
  const start = n > 1 ? (i * (1 - LETTER_SPAN)) / (n - 1) : 0
  return [start, start + LETTER_SPAN]
}
