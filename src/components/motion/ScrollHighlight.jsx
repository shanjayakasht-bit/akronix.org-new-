import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

/* Text that lights up word by word as it is scrolled through.
 *
 * All lines share ONE scroll target and ONE continuous word index, so the
 * highlight runs through line 1 and only then into line 2. The earlier version
 * gave each line its own useScroll, which made every line light at the same
 * time -- the whole point of the effect was lost. */
function Word({ progress, range, children, dim, lit }) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mr-[0.26em] inline-block">
      <span className={cx('select-none', dim)} aria-hidden="true">{children}</span>
      <motion.span style={{ opacity }} className={cx('absolute inset-0', lit)}>
        {children}
      </motion.span>
    </span>
  )
}

export default function ScrollHighlight({
  lines,
  className,
  lineClassName,
  dim = 'text-paper/15',
  lit = 'text-paper',
}) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.18'],
  })

  const total = lines.reduce((n, l) => n + l.split(' ').length, 0)
  let cursor = 0

  if (reduced) {
    return (
      <div className={className}>
        {lines.map((l) => (
          <span key={l} className={cx('block', lineClassName, lit)}>{l}</span>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      {lines.map((line) => (
        <span key={line} className={cx('flex flex-wrap', lineClassName)}>
          {line.split(' ').map((w) => {
            const i = cursor++
            return (
              <Word
                key={`${w}-${i}`}
                progress={scrollYProgress}
                range={[i / total, (i + 1) / total]}
                dim={dim}
                lit={lit}
              >
                {w}
              </Word>
            )
          })}
        </span>
      ))}
    </div>
  )
}
