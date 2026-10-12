import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useSound } from '../../lib/sound'
import { RollText } from '../ui/RollText'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* The switch for the page's sound.
 *
 * Four bars that are an equaliser when sound is on -- each moving on its own
 * beat -- and flat when it is off. It comes in two forms: a row with a sentence
 * for the top of the page, and a small floating one that only appears once the
 * top of the page has been scrolled past, so the choice is always one click away
 * without sitting on the headline. On a phone the floating one is the bars alone.
 *
 * Both opt out of the page's own hover and click sounds (`data-sound="none"`):
 * the engine plays a rising or falling pair of notes when it is switched. */
const BEATS = [0.9, 1.15, 0.75, 1.05]
const REST = [0.4, 0.75, 0.55, 0.3]

function Bars({ on, reduced }) {
  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
      {BEATS.map((d, i) => (
        <motion.span
          key={i}
          className="h-full w-[3px] origin-bottom bg-current"
          initial={false}
          animate={on && !reduced ? { scaleY: [0.25, 1, 0.4, 0.85, 0.25] } : { scaleY: REST[i] }}
          transition={on && !reduced ? { duration: d, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        />
      ))}
    </span>
  )
}

function Floating({ enabled, toggle, reduced }) {
  const { scrollY } = useScroll()
  const [shown, setShown] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setShown(y > 640))

  return (
    <AnimatePresence>
      {shown ? (
        <motion.button
          key="floating-sound"
          type="button"
          data-sound="none"
          onClick={toggle}
          aria-pressed={enabled}
          aria-label={enabled ? 'Turn sound effects off' : 'Turn sound effects on'}
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cx(
            'group/roll fixed bottom-5 left-5 z-40 inline-flex items-center gap-3 border px-4 py-3.5 font-sans text-ui font-medium shadow-[0_18px_40px_-18px_rgba(11,12,15,0.5)] transition-colors duration-300',
            enabled ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-white text-ink hover:border-ink',
          )}
        >
          <Bars on={enabled} reduced={reduced} />
          <span className="hidden sm:inline">
            <RollText>{enabled ? 'Sound on' : 'Sound off'}</RollText>
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

export function SoundToggle({ floating = false }) {
  const { enabled, toggle } = useSound()
  const reduced = usePrefersReducedMotion()

  if (floating) return <Floating enabled={enabled} toggle={toggle} reduced={reduced} />

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule py-5">
      <button
        type="button"
        data-sound="none"
        onClick={toggle}
        role="switch"
        aria-checked={enabled}
        className={cx(
          'group/roll inline-flex items-center gap-4 border px-5 py-3 font-sans text-ui font-medium transition-colors duration-300',
          enabled ? 'border-ink bg-ink text-white' : 'border-ink text-ink hover:bg-ink hover:text-white',
        )}
      >
        <Bars on={enabled} reduced={reduced} />
        <RollText>{enabled ? 'Sound effects on' : 'Turn on sound effects'}</RollText>
      </button>
      <p className="max-w-[52ch] font-sans text-ui text-ink-3">
        Soft interface sounds on this page: a tick on a control, a thud on a row, a ping on the radar, a sheet sliding into place. Off until you turn them on.
      </p>
    </div>
  )
}
