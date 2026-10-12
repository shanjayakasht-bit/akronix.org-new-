import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { RollText } from '../ui/RollText'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { site, socials } from '../../content/site'
import { detailTiles, nextSteps } from '../../content/contact'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* The contact details as three ruled rows, then "what happens next" as a
 * vertical timeline whose rail fills as it is scrolled and whose numbered nodes
 * sit on it. Square nodes, hairline rules, no colour but the red of the fill. */
function Row({ tile, i, reduced }) {
  const value =
    tile.kind === 'email' ? (
      <a href={`mailto:${site.email}`} className="group/roll inline-block transition-colors duration-300 hover:text-brand">
        <RollText>{site.email}</RollText>
      </a>
    ) : tile.kind === 'phone' ? (
      <span className="flex flex-col">
        {site.phones.map((ph) => (
          <a key={ph.href} href={ph.href} className="group/roll inline-block transition-colors duration-300 hover:text-brand">
            <RollText>{ph.display}</RollText>
          </a>
        ))}
      </span>
    ) : (
      site.location
    )

  return (
    <motion.li
      className="relative grid gap-x-6 gap-y-1 py-6 sm:grid-cols-[6.5rem_1fr]"
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE, delay: i * 0.08 }}
      />
      <span className="pt-1.5 font-sans text-mark font-medium uppercase text-ink-3">{tile.label}</span>
      <div>
        <p className="font-display text-h3 text-ink">{value}</p>
        <p className="mt-1 font-sans text-ui text-ink-3">{tile.note}</p>
      </div>
    </motion.li>
  )
}

export default function Details() {
  const reduced = usePrefersReducedMotion()
  const rail = useRef(null)
  const { scrollYProgress } = useScroll({ target: rail, offset: ['start 0.7', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  return (
    <div>
      <ul className="border-b border-ink/20">
        {detailTiles.map((t, i) => (
          <Row key={t.label} tile={t} i={i} reduced={reduced} />
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group/roll inline-flex items-center gap-1.5 font-sans text-ui font-medium text-ink transition-colors duration-300 hover:text-brand"
            >
              <RollText>{s.label}</RollText>
              <span aria-hidden="true" className="text-ink-3">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-20">
        <Label index="02">{nextSteps.eyebrow}</Label>
        <Headline title={nextSteps.title} accent={nextSteps.accent} size="text-h2" className="mt-6" />
        <ol ref={rail} className="relative mt-10 pl-12">
          <span aria-hidden="true" className="absolute bottom-4 left-[0.9375rem] top-4 w-px bg-ink/15" />
          <motion.span
            aria-hidden="true"
            style={reduced ? undefined : { scaleY: fill }}
            className="absolute bottom-4 left-[0.9375rem] top-4 w-px origin-top bg-brand"
          />
          {nextSteps.steps.map((s, i) => (
            <motion.li
              key={s.name}
              className="relative pb-10 last:pb-0"
              initial={reduced ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
            >
              <motion.span
                className="tnum absolute -left-12 top-0 inline-flex size-8 items-center justify-center bg-ink font-sans text-[0.75rem] text-white"
                initial={reduced ? false : { scale: 0.4 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              >
                {i + 1}
              </motion.span>
              <h3 className="font-display text-h3 text-ink">{s.name}</h3>
              <p className="mt-2 max-w-[44ch] font-sans text-body text-ink-2">{s.copy}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  )
}
