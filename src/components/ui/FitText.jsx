import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { cx } from '../../lib/cx'

/* Sets a single line of text to exactly the width of its container.
 *
 * A vw-based font size cannot do this: it knows the viewport but not the
 * font's metrics, so "Build." and "Connect." end at different places and
 * neither reaches the edge. This measures the rendered line and solves for
 * the size, so every word lands flush.
 *
 * The size is written straight to the node rather than held in state --
 * measuring and then re-rendering on the measurement is how you get a loop.
 */
export function FitText({ children, className, motionProps, max = 460 }) {
  const wrap = useRef(null)
  const line = useRef(null)

  const fit = () => {
    const w = wrap.current
    const l = line.current
    if (!w || !l) return
    const avail = w.clientWidth
    if (!avail) return
    /* The node must be shrink-to-fit for this measurement. As a block it
       fills the parent, so scrollWidth returns the PARENT's width and the
       ratio always solves to 1 -- the size then never leaves the probe. */
    l.style.fontSize = '100px'
    const natural = l.getBoundingClientRect().width
    if (!natural) return
    l.style.fontSize = `${Math.min((100 * avail) / natural, max)}px`
  }

  useLayoutEffect(fit)

  useEffect(() => {
    const ro = new ResizeObserver(fit)
    if (wrap.current) ro.observe(wrap.current)
    // Newsreader loads async; its metrics differ from the fallback.
    if (document.fonts?.ready) document.fonts.ready.then(fit).catch(() => {})
    return () => ro.disconnect()
  }, [])

  return (
    <span ref={wrap} className="block overflow-hidden pb-[0.055em]">
      <motion.span
        ref={line}
        className={cx('inline-block whitespace-nowrap leading-[0.84]', className)}
        {...motionProps}
      >
        {children}
      </motion.span>
    </span>
  )
}
