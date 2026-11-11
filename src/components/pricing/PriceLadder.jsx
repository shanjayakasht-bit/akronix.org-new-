import { useRef } from 'react'
import { useInView } from 'motion/react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { plans } from '../../content/pricing'

/* The monthly prices, drawn to scale (Step 7.2), for the empty end of the
 * pricing headline.
 *
 * Four glazed columns on a baseline, as tall as the plan costs: Business
 * (₹4,999) fills the height, Growth (₹2,499) is half of it, Starter (₹999) a
 * fifth. Enterprise has no published price, so it is not drawn to any height: a
 * dashed, open-topped column that fades out upward. The numbers are the plans'
 * own, read from `content/pricing.js`; nothing here is a result or a count.
 *
 * Heights are literal classes (Tailwind cannot see a computed one, and there is
 * no inline CSS), worked out against the Business column at 15rem:
 * 999 / 4999 x 15rem = 3rem, 2499 / 4999 x 15rem = 7.5rem. If a price changes,
 * change its class. The columns grow from the baseline once, when first seen, as
 * a transition on `height` -- a class swap, not a `motion` `initial` -- left to
 * right. PageIntro hides its `aside` below 1280px and from assistive tech; this
 * one needs 1360px (`wide`), where the headline leaves it room -- the pricing page
 * passes `hidden wide:flex` for that. The home hero (Step 7.4) uses it too, as its
 * fourth slide, with `play` and no caption of its own. */
const BAR = {
  starter: 'h-12',
  growth: 'h-[7.5rem]',
  business: 'h-60',
  enterprise: 'h-60',
}
const DELAY = ['delay-[0ms]', 'delay-[140ms]', 'delay-[280ms]', 'delay-[420ms]']

export function PriceLadder({ play, className, caption = true }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const seen = useInView(ref, { once: true })
  /* On the pricing page the columns grow once, when first seen. In the home hero
     they are driven by `play`, so they grow again each time their slide comes up. */
  const up = (play ?? seen) || reduced

  return (
    <div ref={ref} className={cx('flex flex-col', className)}>
      {caption ? <p className="font-sans text-[0.75rem] text-ink-3">Monthly price, drawn to scale</p> : null}
      <ul className={cx('flex h-60 items-end gap-3 border-b border-ink/15', caption ? 'mt-4' : '')}>
        {plans.map((p, i) => {
          const open = p.key === 'enterprise'
          return (
            <li key={p.key} className="flex-1">
              <div
                className={cx(
                  'relative w-full overflow-hidden',
                  reduced ? '' : cx('transition-[height] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]', DELAY[i]),
                  up ? BAR[p.key] : 'h-0',
                  open ? '' : 'gloss rounded-t-[1.5rem]',
                )}
              >
                {open ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-t-[1.5rem] border border-b-0 border-dashed border-ink/30 bg-gradient-to-t from-ink/[0.06] to-transparent [mask-image:linear-gradient(to_top,black_35%,transparent)]"
                  />
                ) : null}
                <span className="tnum absolute inset-x-0 top-3 text-center font-display text-[1.125rem] tracking-[-0.02em] text-ink">{p.price}</span>
              </div>
            </li>
          )
        })}
      </ul>
      <ul className="mt-3 flex gap-3">
        {plans.map((p) => (
          <li key={p.key} className="flex-1 text-center font-sans text-[0.8125rem] text-ink-2">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
