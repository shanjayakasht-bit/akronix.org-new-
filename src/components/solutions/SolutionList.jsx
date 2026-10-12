import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Button } from '../ui/Button'
import { cx } from '../../lib/cx'
import ServiceRail from './ServiceRail'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { useScrollToId } from '../../lib/useScrollToId'
import { solutions } from '../../content/solutions'

const EASE = [0.16, 1, 0.3, 1]

/* The eight lines of work, as a ledger.
 *
 * A sticky index runs down the left and marks the line being read; the lines
 * run past it on the right as ruled rows, each hairline drawing in as the row
 * arrives. Each carries its own index numeral, set very large and very faint
 * behind the copy and drifting at a different speed from the page -- the one
 * decoration on the page, and it is also the line's own number.
 *
 * Services are things we do rather than things that exist yet, so they are set
 * plainly, with no container around them: a name, what it is for, what it
 * covers, and a way to ask. What it covers is a two-column list on hairlines,
 * not a row of tags.
 *
 * Each line closes on a button that opens the contact form with that line
 * already chosen (`/contact?service=<slug>`). */
function Line({ item, index, onRead, reduced }) {
  const ref = useRef(null)
  const reading = useInView(ref, { margin: '-40% 0px -45% 0px' })
  useEffect(() => {
    if (reading) onRead(index)
  }, [reading, index, onRead])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [90, -90])

  return (
    <article id={item.slug} ref={ref} className="relative scroll-mt-32 overflow-hidden py-14 md:py-20">
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-6% 0px' }}
        transition={{ duration: 1.3, ease: EASE }}
      />

      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { y: drift }}
        className="tnum pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(11rem,8rem+14vw,24rem)] font-light leading-none tracking-[-0.06em] text-mist"
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      <motion.div
        className="relative grid gap-8 md:grid-cols-12 md:gap-8"
        initial={reduced ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="tnum font-sans text-mark font-medium text-ink-3 md:col-span-2">{String(index + 1).padStart(2, '0')} / 08</p>

        <div className="md:col-span-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <h3 className="font-display text-h1 font-light leading-[1.02] text-ink">{item.name}</h3>
            {item.stage ? (
              <span className="inline-flex items-center gap-2 border border-ink/25 px-2.5 py-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                {item.stage}
              </span>
            ) : null}
          </div>
          <p className="mt-5 font-display text-h3 text-ink-2">{item.line}</p>
          <p className="mt-6 max-w-[58ch] font-sans text-body text-ink-2">{item.copy}</p>

          <p className="mt-10 font-sans text-mark font-medium uppercase text-ink-3">What it covers</p>
          <ul className="mt-4 grid max-w-[44rem] border-t border-ink/20 sm:grid-cols-2 sm:gap-x-10">
            {item.items.map((t, i) => (
              <motion.li
                key={t}
                initial={reduced ? false : { opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-6% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 border-b border-ink/20 py-3.5 font-sans text-ui text-ink"
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-brand" />
                {t}
              </motion.li>
            ))}
          </ul>

          <div className="mt-10">
            <Button to={`/contact?service=${item.slug}`} variant="outline" size="compact" className="whitespace-nowrap">
              {item.stage ? 'Register interest' : `Discuss ${item.short}`}
            </Button>
          </div>
        </div>
      </motion.div>
    </article>
  )
}

export default function SolutionList() {
  const reduced = usePrefersReducedMotion()
  const scrollTo = useScrollToId()
  const [reading, setReading] = useState(0)

  return (
    <Band tone="light" id="solutions" pad="md" className="scroll-mt-24">
      <Container wide>
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
          {/* Desktop only: on a phone the lines are short enough to scroll. */}
          <nav aria-label="The eight solutions" className="hidden lg:col-span-3 lg:block">
            <ServiceRail reading={reading} onJump={scrollTo} />
          </nav>

          <div className="lg:col-span-9">
            {solutions.map((s, i) => (
              <Line key={s.slug} item={s} index={i} onRead={setReading} reduced={reduced} />
            ))}
          </div>
        </div>
      </Container>
    </Band>
  )
}
