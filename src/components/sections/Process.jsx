import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { SectionIntro } from './SectionHead'
import { cx } from '../../lib/cx'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* A sequence read sideways.
 *
 * Scrolling down pulls a horizontal track of steps across the screen: the
 * section is tall, its inner frame is `sticky`, and the vertical progress
 * through the section is mapped onto the track's `x`. The step at the left
 * margin is lit, the ones either side fall back, a line along the bottom fills
 * with the progress, and the step names under it light as the fill reaches
 * them. Sideways is the point -- it is what makes "five steps in this order"
 * something you move through rather than a row of boxes.
 *
 * Below `md`, and under reduced motion, there is no pinning: the steps are a
 * plain vertical list. A pinned horizontal track on a phone is a trap.
 *
 * `process` is `{ eyebrow, title, accent, steps: [{ n, name, copy }] }`. */
function Step({ step, index, count, progress }) {
  /* Lit when the track has brought this step to the left, dimmer either side.
     Function transforms rather than keyframe arrays: the first step's range
     starts below 0, and Motion hands array ranges to the browser's native
     scroll timeline, which rejects offsets outside 0-1 and throws. */
  const at = count > 1 ? index / (count - 1) : 0
  const d = count > 1 ? 1 / (count - 1) : 1
  const near = (v) => Math.min(1, Math.abs(v - at) / d)
  const opacity = useTransform(progress, (v) => 1 - near(v) * (v < at ? 0.72 : 0.55))
  const lift = useTransform(progress, (v) => near(v) * (v < at ? 24 : 12))

  return (
    <motion.li style={{ opacity, y: lift }} className="relative w-[min(78vw,27rem)] shrink-0 border-t border-white/25 pt-7">
      <span aria-hidden="true" className="absolute left-0 top-[-2px] h-[3px] w-10 bg-brand-soft" />
      <span className="tnum block font-display text-[6.5rem] font-light leading-none tracking-[-0.05em] text-white/[0.14]">{step.n}</span>
      <h3 className="mt-3 font-display text-h2 text-white">{step.name}</h3>
      <p className="mt-4 max-w-[34ch] font-sans text-body text-white/65">{step.copy}</p>
    </motion.li>
  )
}

export default function Process({ process }) {
  const reduced = usePrefersReducedMotion()
  const pinned = useMediaQuery('(min-width: 768px)', false) && !reduced
  const frame = useRef(null)
  const track = useRef(null)
  const [reach, setReach] = useState(0)
  const [current, setCurrent] = useState(0)

  const { scrollYProgress } = useScroll({ target: frame, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * reach)

  useEffect(() => {
    const el = track.current
    if (!el || !pinned) return undefined
    /* One step's pitch, times the steps to cross: at progress i/(n-1) step i
       sits exactly on the left margin, in line with the heading above. */
    const measure = () => {
      const [a, b] = el.children
      if (a && b) setReach((b.offsetLeft - a.offsetLeft) * (el.children.length - 1))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const last = process.steps.length - 1
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCurrent(Math.min(last, Math.round(v * last))))

  const head = (
    <SectionIntro onDark eyebrow={process.eyebrow} index="02" title={process.title} accent={process.accent} />
  )

  if (!pinned) {
    return (
      <Band tone="dark">
        <Container wide>
          {head}
          <ol className="mt-14 space-y-10">
            {process.steps.map((s) => (
              <li key={s.n} className="border-t border-white/25 pt-6">
                <span className="tnum block font-display text-[4.5rem] font-light leading-none tracking-[-0.05em] text-white/[0.16]">{s.n}</span>
                <h3 className="mt-2 font-display text-h2 text-white">{s.name}</h3>
                <p className="mt-3 font-sans text-body text-white/65">{s.copy}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Band>
    )
  }

  return (
    <Band tone="dark" pad="none">
      {/* Five screens' worth of scroll turns the track through its five steps. */}
      <div ref={frame} className="h-[320vh]">
        <div className="sticky top-[4.5rem] flex h-[calc(100svh-4.5rem)] flex-col justify-center overflow-hidden py-16">
          <Container wide>{head}</Container>

          <div className="mt-14 overflow-hidden pb-10">
            <motion.ol ref={track} style={{ x }} className="flex w-max gap-10 pl-[max(2rem,calc((100vw-90rem)/2+2rem))] pr-10 lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]">
              {process.steps.map((s, i) => (
                <Step key={s.n} step={s} index={i} count={process.steps.length} progress={scrollYProgress} />
              ))}
            </motion.ol>
          </div>

          <Container wide className="mt-10">
            <div className="relative h-px bg-white/20">
              <motion.span aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-white" />
            </div>
            <div className="mt-4 flex justify-between font-sans text-mark font-medium uppercase">
              {process.steps.map((s, i) => (
                <span key={s.n} className={cx('transition-colors duration-500', i <= current ? 'text-white' : 'text-white/35')}>
                  {s.name}
                </span>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </Band>
  )
}
