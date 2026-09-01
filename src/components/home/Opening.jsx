import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { Container, Display, Lede, Section, UI } from '../primitives'
import { Reveal } from '../motion/Reveal'
import { Rise } from '../motion/Rise'
import { Mark } from '../brand/Mark'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* Section 1. Rests on nothing that needs proving: it states what the studio
 * does and stops. No metric, no logo strip, no dashboard.
 *
 * The oversized mark is the studio's own monogram, not decoration bought from
 * an icon set -- it is the one graphic on the page that is allowed to mean
 * nothing beyond identity, because that is what a monogram is for.
 */
export default function Opening() {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35])

  return (
    <Section as="header" bare className="relative overflow-hidden lg:pt-48 lg:pb-40">
      <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          style={reduced ? undefined : { y, opacity }}
          className="absolute -right-[8%] top-[6%] w-[52vw] max-w-[620px] text-clay md:-right-[4%]"
        >
          <Mark className="h-auto w-full" accent={false} />
        </motion.div>
      </div>

      <Container className="relative">
        <Rise as="div">
          {/* Measure is set on the Display itself: `em` here resolves against the
              display size, not the 16px it would inherit on a wrapper. */}
          <Display className="max-w-[11em]">We build software for businesses.</Display>
        </Rise>

        <Reveal as="div" delay={0.14} className="mt-10 md:mt-12">
          <Lede>
            Web and mobile applications, digital marketing, and mentorship. We
            listen to the problem first, then put a number on it.
          </Lede>
        </Reveal>

        <Reveal as="div" delay={0.22} className="mt-12 md:mt-14">
          <Link
            to="/contact"
            className="group inline-flex items-baseline gap-2 border-b border-ink pb-1 text-ink transition-colors hover:border-signal hover:text-signal"
          >
            <UI>Start a project</UI>
            <UI aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </UI>
          </Link>
        </Reveal>
      </Container>
    </Section>
  )
}
