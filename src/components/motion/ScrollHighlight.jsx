import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

/* Text that lights up letter by letter as it is scrolled through.
 *
 * All lines share ONE scroll target and ONE continuous letter index, so the
 * highlight runs through line 1 and only then into line 2. An early version
 * gave each line its own useScroll, which lit every line at the same time --
 * the whole point of the effect was lost. Do not reintroduce that.
 *
 * Two things the markup has to get right:
 *
 * Words stay whole in the DOM and carry `whitespace-nowrap`. The letters inside
 * them are inline-blocks, and inline-blocks are free to wrap, so without it a
 * word could break across lines mid-word.
 *
 * The visible layer is `aria-hidden` and the real sentence is carried once in
 * an `sr-only` span. A screen reader must not be handed this one letter at a
 * time. */
function Letter({ progress, range, children, dim, lit }) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative inline-block">
      <span className={cx('select-none', dim)}>{children}</span>
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

  /* Spaces are not lit, so they do not get a slice of the scroll either. */
  const total = lines.reduce((n, l) => n + l.replace(/\s/g, '').length, 0)
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
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden="true">
        {lines.map((line) => (
          <span key={line} className={cx('flex flex-wrap', lineClassName)}>
            {line.split(' ').map((word, w) => (
              <span key={`${word}-${w}`} className="mr-[0.26em] inline-block whitespace-nowrap">
                {[...word].map((ch) => {
                  const i = cursor++
                  return (
                    <Letter
                      key={`${ch}-${i}`}
                      progress={scrollYProgress}
                      range={[i / total, (i + 1) / total]}
                      dim={dim}
                      lit={lit}
                    >
                      {ch}
                    </Letter>
                  )
                })}
              </span>
            ))}
          </span>
        ))}
      </span>
    </div>
  )
}
