import { motion } from 'motion/react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { products } from '../../content/products'

const EASE = [0.16, 1, 0.3, 1]

/* A bar of the twelve product colours, edge to edge.
 *
 * Brand bars of this kind are an old corporate habit, and this one is not
 * decoration: each block is a real product in its real colour. The six being
 * built are solid; the six planned are the same colour at a third of the
 * strength. It grows in from the left, a block at a time. */
export default function ColourBar({ className }) {
  const reduced = usePrefersReducedMotion()
  return (
    <div aria-hidden="true" className={cx('flex h-2 w-full', className)}>
      {products.map((p, i) => (
        <motion.span
          key={p.name}
          className={cx('h-full flex-1 origin-left', p.building ? p.accent.bar : p.accent.soft)}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 + i * 0.06 }}
        />
      ))}
    </div>
  )
}
