import { forwardRef, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* A section that sits ON the cream page as a rounded block rather than
 * running edge to edge. Taken from the reference sites: the cream showing at
 * the margins is what stops a long page reading as a stack of flat bands.
 *
 * The block does not merely widen -- it grows. A slab arrives on screen a few
 * per cent smaller than its full size, with cream showing on every side, and
 * scales up as it rises. The trigger is one event: its own top edge meeting the
 * top of the screen. At that instant it is at full size, the cream is gone and
 * the radius has run out with it, so the block fills the top of the viewport
 * with square corners. Scroll on and it holds; scroll back and it reopens
 * through the same range.
 *
 * Growing rather than stretching is the point of using a transform: width,
 * height, padding and type all move together, so it reads as one block coming
 * forward instead of the sides being pulled apart around fixed text.
 *
 * The transition spans exactly one viewport height of scroll whatever the
 * slab's own height, so a short slab and a tall one behave identically.
 *
 * Note the three levels. The outer div is what `useScroll` measures, and it is
 * deliberately never transformed: measuring the scaled element would feed the
 * scale back into the thing computing the scale. */
const TONES = {
  cream: 'bg-paper text-ink',
  sand: 'bg-mist text-ink',
  panel: 'bg-panel text-ink',
  forest: 'bg-forest text-paper',
  coal: 'bg-coal text-paper',
  cocoa: 'bg-cocoa text-paper',
}

/* How much smaller a slab is when it arrives. 6% of a 1280 viewport is ~38px
 * of cream either side, which is the `px-10` the margin used to be fixed at. */
const SHRINK = 0.06

/* `clip` swaps both clipping layers from overflow-hidden to overflow-clip. They
 * look identical, but `hidden` makes the element a scroll container, and a
 * `position: sticky` child then sticks to that box -- which never scrolls -- so
 * it simply never sticks. `clip` clips without becoming a scroller. Opt-in, so
 * no homepage slab changes; /building's sticky index is what needs it.
 *
 * `anchor="top"` scales from the top edge rather than the centre. The scale is
 * a fraction of the slab's height, so the top edge drops by 3% of it on arrival
 * -- ~30px on a homepage slab, but ~200px on /building's twelve-product slab,
 * which opened a wide band of cream above it. Anchored to the top, the edge
 * stays where the layout put it and only the sides draw in. Opt-in, so no
 * homepage slab changes. */

export const Slab = forwardRef(function Slab(
  { as: Tag = 'section', tone = 'cream', flush = false, clip = false, anchor = 'center', className, children, ...rest },
  ref,
) {
  const reduced = usePrefersReducedMotion()
  const frame = useRef(null)
  /* 0 when the slab's top edge is at the bottom of the screen, 1 when it has
     risen to the top of it. Nothing else enters into it. */
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'start start'] })
  /* How much shrink and radius is left: all of it on arrival, none at the top. */
  const held = useTransform(scrollYProgress, [0, 1], [1, 0], { clamp: true })
  const scale = useTransform(held, (v) => 1 - v * SHRINK)
  const radius = useTransform(held, (v) => `calc(var(--slab-radius) * ${v})`)

  const live = !flush && !reduced

  return (
    <div ref={frame} className={cx('[--slab-radius:2.5rem]', !live && !flush && 'px-10')}>
      <motion.div
        style={live ? { scale, borderRadius: radius } : undefined}
        className={cx(
          live && (clip ? 'overflow-clip' : 'overflow-hidden'),
          live && anchor === 'top' && 'origin-top',
        )}
      >
        <Tag
          ref={ref}
          className={cx(
            'relative py-12 md:py-12 lg:py-12',
            clip ? 'overflow-clip' : 'overflow-hidden',
            !live && !flush && 'rounded-slab',
            TONES[tone],
            className,
          )}
          {...rest}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  )
})
