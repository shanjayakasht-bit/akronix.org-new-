import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { RollText } from '../ui/RollText'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { solutions } from '../../content/solutions'

const EASE = [0.16, 1, 0.3, 1]

/* The sticky navigator beside the eight lines of work (Step 7 rebuild).
 *
 * It was a plain list with a red bar on the active row. Now it is a track: a
 * vertical line with a square node for each line, which fills with red down to
 * the line being read, segment by segment, as you scroll. The active node is
 * larger and pulses once; the active row opens to show what that line is for in
 * one sentence; rows before it are marked as passed. Hovering a row slides it
 * across and brings its name up to full strength. The count at the top rolls to
 * the new number, and a button at the foot changes with the line -- "Discuss
 * AI & Automation" -- and opens the contact form with that line already chosen.
 *
 * It scrolls the page when a row is clicked (`onJump`), and reads which line is
 * showing from `reading`, which `SolutionList` works out by watching the lines
 * cross the middle of the screen. */
function Count({ value }) {
  return (
    <span className="relative inline-flex h-[1.3em] w-[2ch] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="tnum absolute inset-0 flex items-center text-ink"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {String(value + 1).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function ServiceRail({ reading, onJump }) {
  const reduced = usePrefersReducedMotion()
  const current = solutions[reading]

  return (
    <div className="sticky top-32">
      <p className="flex items-baseline justify-between font-sans text-mark font-medium uppercase text-ink-3">
        <span>The eight</span>
        <span className="flex items-center gap-1.5 text-[0.75rem] normal-case tracking-normal">
          <Count value={reading} /> <span className="text-ink-3">/ 08</span>
        </span>
      </p>

      <ol className="mt-6">
        {solutions.map((s, i) => {
          const on = reading === i
          const passed = i < reading
          const last = i === solutions.length - 1
          return (
            <li key={s.slug} className="relative">
              {/* the node */}
              <motion.span
                aria-hidden="true"
                className={cx(
                  'absolute left-0 top-[1.0625rem] z-10 size-[15px] border transition-colors duration-500',
                  on ? 'border-brand bg-brand' : passed ? 'border-ink bg-ink' : 'border-ink/30 bg-white',
                )}
                animate={{ scale: on && !reduced ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              />
              {on && !reduced ? (
                <motion.span
                  key={`pulse-${i}`}
                  aria-hidden="true"
                  className="absolute left-0 top-[1.0625rem] size-[15px] border border-brand"
                  initial={{ opacity: 0.9, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.6 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              ) : null}

              {/* the segment from this node down to the next */}
              {!last ? (
                <>
                  <span aria-hidden="true" className="absolute bottom-[-1.0625rem] left-[7px] top-[calc(1.0625rem+15px)] w-px bg-ink/15" />
                  <motion.span
                    aria-hidden="true"
                    className="absolute bottom-[-1.0625rem] left-[7px] top-[calc(1.0625rem+15px)] w-px origin-top bg-brand"
                    initial={false}
                    animate={{ scaleY: passed ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                </>
              ) : null}

              <a
                href={`#${s.slug}`}
                onClick={(e) => onJump(e, s.slug)}
                aria-current={on ? 'true' : undefined}
                className="group/roll block py-3.5 pl-9 pr-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1"
              >
                <span className="flex items-baseline gap-3">
                  <span className={cx('tnum w-5 shrink-0 font-sans text-[0.75rem] transition-colors duration-500', on ? 'text-brand' : 'text-ink-3')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cx(
                      'min-w-0 flex-1 font-display text-xl transition-colors duration-500',
                      on ? 'text-ink' : passed ? 'text-ink/60 group-hover/roll:text-ink' : 'text-ink/40 group-hover/roll:text-ink',
                    )}
                  >
                    <RollText>{s.name}</RollText>
                  </span>
                  {s.stage ? (
                    <span className="border border-ink/25 px-1.5 py-0.5 font-sans text-[0.5625rem] font-medium uppercase tracking-[0.1em] text-ink-2">
                      {s.stage}
                    </span>
                  ) : null}
                </span>

                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.span
                      key="line"
                      className="block overflow-hidden"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <span className="mt-2 block pl-8 font-sans text-ui text-ink-2">{s.line}</span>
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </a>
            </li>
          )
        })}
      </ol>

      {/* the action follows the line */}
      <div className="mt-8 border-t border-rule pt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.slug}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Button to={`/contact?service=${current.slug}`} variant="outline" size="compact" className="w-full justify-between">
              {current.stage ? 'Register interest' : `Discuss ${current.short}`}
            </Button>
          </motion.div>
        </AnimatePresence>
        <Link
          to="/contact"
          className="group/roll mt-4 inline-block font-sans text-ui text-ink-3 transition-colors duration-300 hover:text-ink"
        >
          <RollText>Not sure which one? Tell us the problem.</RollText>
        </Link>
      </div>
    </div>
  )
}
