import { Fragment } from 'react'
import { cx } from '../../lib/cx'

/* A label whose letters roll upward on hover: the visible copy climbs out of
 * its own box while an identical copy climbs in from underneath, one letter
 * behind the next.
 *
 * The trigger is a *named* group -- `group/roll` on the clickable element, not
 * on the text -- so the roll fires from anywhere on the control, its padding
 * included, rather than only when the pointer is over the glyphs themselves.
 * Every clickable label on the site is wrapped in this, so put `group/roll` on
 * the anchor, button or Link and nothing else is needed.
 *
 * The stagger is a ladder of static delay classes rather than a computed
 * inline style: Tailwind only emits utilities it can see spelled out in the
 * source, and CLAUDE.md rules out inline CSS. 26 rungs covers every label on
 * the site; anything longer holds the last rung, which reads fine because by
 * then the wave is well under way. */
const STEP = [
  'delay-[0ms]', 'delay-[18ms]', 'delay-[36ms]', 'delay-[54ms]', 'delay-[72ms]',
  'delay-[90ms]', 'delay-[108ms]', 'delay-[126ms]', 'delay-[144ms]', 'delay-[162ms]',
  'delay-[180ms]', 'delay-[198ms]', 'delay-[216ms]', 'delay-[234ms]', 'delay-[252ms]',
  'delay-[270ms]', 'delay-[288ms]', 'delay-[306ms]', 'delay-[324ms]', 'delay-[342ms]',
  'delay-[360ms]', 'delay-[378ms]', 'delay-[396ms]', 'delay-[414ms]', 'delay-[432ms]',
  'delay-[450ms]',
]

const ROLL = 'block transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)]'

export function RollText({ children, className }) {
  /* Only a plain string can be split. Anything else passes straight through,
     so a Button holding an icon or an element still renders. */
  if (typeof children !== 'string') return children

  const words = children.split(' ')
  let n = 0

  return (
    <span className={cx('inline-block', className)}>
      {/* Split into letters and doubled, so the label is carried once here and
          the moving pieces are hidden from a reader. */}
      <span className="sr-only">{children}</span>

      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={`${word}-${w}`}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, c) => {
                const d = STEP[Math.min(n++, STEP.length - 1)]
                return (
                  <span key={`${ch}-${c}`} className="relative inline-block overflow-hidden align-bottom">
                    <span className={cx(ROLL, 'group-hover/roll:-translate-y-full', d)}>{ch}</span>
                    <span
                      className={cx(
                        ROLL,
                        'absolute left-0 top-0 translate-y-full group-hover/roll:translate-y-0',
                        d,
                      )}
                    >
                      {ch}
                    </span>
                  </span>
                )
              })}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  )
}
