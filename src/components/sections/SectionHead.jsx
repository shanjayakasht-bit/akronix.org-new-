import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'
import { Rising, letterRange } from '../motion/RisingLetters'
import { Pill } from '../ui/Pill'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

const EASE = [0.16, 1, 0.3, 1]

/* The heading's per-letter reveal is scrubbed by scroll rather than played:
 * the run begins as the heading's top edge crosses the bottom of the screen
 * and is finished by the time that edge is 30% of the way down it, so the
 * title is fully standing well before it reaches the middle. Being scrubbed,
 * it also runs backwards when the page is scrolled back. The letter itself
 * lives in `motion/RisingLetters` and is shared with the hero headline. */

/* Marker, heading, sub. The heading is the only bold thing in a section --
   CLAUDE.md allows weight on main headings and nowhere else.

   `reveal` picks how the heading arrives: "words" is the default, each word
   rising once as it comes into view; "letters" is the scrolled per-letter
   version above. */
export default function SectionHead({
  eyebrow,
  tone = 'clay',
  title,
  accent,
  sub,
  onDark = false,
  reveal = 'words',
  className,
  titleClass,
}) {
  const reduced = usePrefersReducedMotion()
  const head = useRef(null)
  const { scrollYProgress } = useScroll({
    target: head,
    offset: ['start end', 'start 0.3'],
  })

  const up = (d) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-12% 0px' },
      transition: { duration: 0.8, ease: EASE, delay: d },
    }

  const words = [
    ...title.split(' ').map((w) => ({ w, accent: false })),
    ...(accent ? accent.split(' ').map((w) => ({ w, accent: true })) : []),
  ]
  const accentClass = onDark ? 'text-paper/55' : 'text-clay'
  const byLetter = reveal === 'letters' && !reduced

  /* One continuous letter index across every word, so the wave crosses the
     whole heading instead of restarting on each word. */
  const letters = words.reduce((n, { w }) => n + w.length, 0)
  let cursor = 0

  return (
    <div className={cx('max-w-[46rem]', className)}>
      {eyebrow ? (
        <motion.div {...up(0)}>
          <Pill tone={onDark ? 'onDark' : tone}>{eyebrow}</Pill>
        </motion.div>
      ) : null}

      <h2
        ref={head}
        className={cx(
          'mt-7 flex font-serif tracking-[-0.025em]',
          /* Size and wrapping together, because a caller that wants a heading
             held to one line has to set both. Default is what every other
             section gets. */
          titleClass ?? 'flex-wrap text-h1',
          className?.includes('text-center') && 'justify-center',
          onDark ? 'text-paper' : 'text-ink',
        )}
      >
        {/* Split into letters, the heading must not be read out one letter at
            a time, so the real line is carried here and the pieces are hidden. */}
        {byLetter ? <span className="sr-only">{[title, accent].filter(Boolean).join(' ')}</span> : null}

        {words.map(({ w, accent: isAccent }, i) =>
          byLetter ? (
            <span
              key={`${w}-${i}`}
              aria-hidden="true"
              className="mr-[0.26em] inline-block whitespace-nowrap"
            >
              {[...w].map((ch) => {
                const n = cursor++
                const [from, to] = letterRange(n, letters)
                return (
                  <Rising
                    key={`${ch}-${n}`}
                    progress={scrollYProgress}
                    start={from}
                    end={to}
                    className={isAccent ? accentClass : undefined}
                  >
                    {ch}
                  </Rising>
                )
              })}
            </span>
          ) : (
            /* Word by word, each rising out of its own mask. */
            <span key={`${w}-${i}`} className="mr-[0.26em] inline-block overflow-hidden pb-[0.1em]">
              <motion.span
                className={cx('inline-block', isAccent && accentClass)}
                initial={reduced ? false : { y: '110%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.85, ease: EASE, delay: 0.06 + i * 0.07 }}
              >
                {w}
              </motion.span>
            </span>
          ),
        )}
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
