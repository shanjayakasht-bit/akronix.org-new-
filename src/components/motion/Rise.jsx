import { motion } from 'motion/react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* Headings rise into a mask rather than fading. Reserved for headings -- body
 * copy uses `Reveal`, so the two read as different weights of arrival.
 *
 * The padding on the mask is not decorative: overflow clips at the padding
 * edge, and Newsreader's italic descenders and swashes overhang the line box.
 * Without it the qualifier gets its tails shaved off.
 */
export function Rise({ as = 'div', delay = 0, className, children, ...rest }) {
  const reduced = usePrefersReducedMotion()
  const Tag = motion[as]

  if (reduced) return <div className={className}>{children}</div>

  return (
    <div className={cx('overflow-hidden pb-[0.18em] -mb-[0.18em]', className)}>
      <Tag
        initial={{ y: '115%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.85, ease: EASE, delay }}
        {...rest}
      >
        {children}
      </Tag>
    </div>
  )
}
