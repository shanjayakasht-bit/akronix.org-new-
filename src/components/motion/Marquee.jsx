import { useRef } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

/* A ticker that answers the scroll.
 *
 * It drifts at a steady pace on its own; scroll the page and it speeds up, and
 * if the page is scrolled back up it reverses, easing out of the change through
 * a spring. The speed is the scroll's velocity, smoothed -- so it feels pushed
 * by the reader rather than running on a timer beside them.
 *
 * The children are laid out twice end to end and the track is wrapped at half
 * its width, so the loop has no seam. */
export function Marquee({ children, speed = 4, className }) {
  const reduced = usePrefersReducedMotion()
  const wrap = useRef(null)
  /* Only runs while it is on screen. */
  const visible = useInView(wrap)
  const base = useMotionValue(0)
  const dir = useRef(1)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], { clamp: false })

  useAnimationFrame((_, delta) => {
    if (reduced || !visible) return
    const b = boost.get()
    if (b < -0.05) dir.current = -1
    else if (b > 0.05) dir.current = 1
    const step = dir.current * speed * (delta / 1000)
    let next = base.get() + step + step * Math.abs(b)
    if (next <= -50) next += 50
    if (next > 0) next -= 50
    base.set(next)
  })

  const x = useTransform(base, (v) => `${v}%`)

  return (
    <div ref={wrap} className={cx('overflow-hidden', className)}>
      <motion.div style={{ x }} className="flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
