import { motion, useScroll, useSpring } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* A hairline that fills across the top as the page is read. */
export default function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 320, damping: 40, restDelta: 0.001 })
  if (reduced) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-clay"
    />
  )
}
