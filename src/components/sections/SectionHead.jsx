import { motion } from 'motion/react'
import { Pill } from '../ui/Pill'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

const EASE = [0.16, 1, 0.3, 1]

/* Marker, heading, sub. The heading is the only bold thing in a section --
   CLAUDE.md allows weight on main headings and nowhere else. */
export default function SectionHead({ eyebrow, tone = 'clay', title, accent, sub, onDark = false, className }) {
  const reduced = usePrefersReducedMotion()
  const up = (d) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-12% 0px' },
      transition: { duration: 0.8, ease: EASE, delay: d },
    }

  return (
    <div className={cx('max-w-[46rem]', className)}>
      {eyebrow ? (
        <motion.div {...up(0)}>
          <Pill tone={onDark ? 'onDark' : tone}>{eyebrow}</Pill>
        </motion.div>
      ) : null}

      {/* Word by word, each rising out of its own mask. */}
      <h2
        className={cx(
          'mt-7 flex flex-wrap font-serif text-h1 tracking-[-0.025em]',
          className?.includes('text-center') && 'justify-center',
          onDark ? 'text-paper' : 'text-ink',
        )}
      >
        {[
          ...title.split(' ').map((w) => ({ w, accent: false })),
          ...(accent ? accent.split(' ').map((w) => ({ w, accent: true })) : []),
        ].map(({ w, accent: isAccent }, i) => (
          <span key={`${w}-${i}`} className="mr-[0.26em] inline-block overflow-hidden pb-[0.1em]">
            <motion.span
              className={cx('inline-block', isAccent && (onDark ? 'text-paper/55' : 'text-clay'))}
              initial={reduced ? false : { y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.06 + i * 0.07 }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h2>

      {sub ? (
        <motion.p
          className={cx(
            'mt-5 max-w-[52ch] font-sans text-lede leading-relaxed',
            className?.includes('text-center') && 'mx-auto',
            onDark ? 'text-paper/65' : 'text-ink-2',
          )}
          {...up(0.3)}
        >
          {sub}
        </motion.p>
      ) : null}
    </div>
  )
}
