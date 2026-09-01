import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* The only entrance the site has: opacity and 12px of travel, once. No scale,
   no spring, no letter-by-letter. Stagger by passing an increasing `delay`. */
export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const reduced = usePrefersReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
