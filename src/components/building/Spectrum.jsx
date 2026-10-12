import { useState } from 'react'
import { motion } from 'motion/react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { building, planned, products, productSlug } from '../../content/products'

const EASE = [0.16, 1, 0.3, 1]

/* The twelve products as a strip of twelve colours (on white since Step 7 -- it
 * sat on a black hero in Step 6.1).
 *
 * Each block is one product, in its own colour. A product being built is a
 * SOLID block; a planned one is an OUTLINE of the same colour with nothing in
 * it -- the strip says the stage with the same word the page does (Coming soon,
 * Planned) and a second time with how filled in the block is. Nothing here is
 * a number or a bar of progress: no progress is known, and none is shown.
 *
 * Hover (or focus) a block and it opens: it takes a larger share of the strip
 * on a spring while the rest give way, and its name and stage come up under it.
 * Click one and the page scrolls to its card and the card flashes. The blocks
 * grow up from the baseline in turn when the page arrives, left to right.
 *
 * `visible` is the set of names the filters below are currently showing; the
 * rest of the strip dims, so the strip and the grid are one control. */
export default function Spectrum({ visible, onSelect }) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState(null)

  return (
    <div className="pb-12 pt-4 md:pb-16">
      <div className="flex gap-[3px] md:gap-1" onPointerLeave={() => setHover(null)}>
        {products.map((p, i) => {
          const built = p.building
          const on = hover === i
          const dim = !visible.has(p.name)
          return (
            <motion.button
              key={p.name}
              type="button"
              onClick={() => onSelect(productSlug(p))}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              animate={{ flexGrow: on ? 3.4 : 1, opacity: dim ? 0.22 : 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.8 }}
              aria-label={`${p.name}, ${p.stage}. Jump to its card.`}
              className="group relative min-w-0 basis-0 text-left"
            >
              <motion.span
                aria-hidden="true"
                className={cx(
                  'block h-24 origin-bottom transition-colors duration-500 md:h-36',
                  built ? p.accent.bar : cx('border', p.accent.border, on ? p.accent.chip : 'bg-transparent'),
                )}
                initial={reduced ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.06 }}
              />
              <span className="mt-3 block h-11 overflow-hidden whitespace-nowrap">
                <span className={cx('block font-sans text-[0.5625rem] font-medium uppercase tracking-[0.04em] transition-colors duration-300 sm:text-[0.6875rem] sm:tracking-[0.12em]', on ? 'text-ink' : 'text-ink-3')}>
                  {p.code}
                </span>
                <span
                  className={cx(
                    'mt-1 hidden font-sans text-ui text-ink transition-all duration-500 md:block',
                    on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                  )}
                >
                  {p.name.replace('Akronix ', '')} <span className="text-ink-3">&middot; {p.stage}</span>
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-rule pt-6 font-sans text-ui text-ink-2">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="block h-3 w-8 bg-ink" />
            In development <span className="tnum text-ink-3">{String(building.length).padStart(2, '0')}</span>
          </li>
          <li className="flex items-center gap-3">
            <span aria-hidden="true" className="block h-3 w-8 border border-ink/60" />
            Planned <span className="tnum text-ink-3">{String(planned.length).padStart(2, '0')}</span>
          </li>
        </ul>
        <p className="hidden md:block">Hover a block to read it. Click it to jump to its card.</p>
      </div>
    </div>
  )
}
