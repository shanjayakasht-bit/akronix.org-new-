import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { FooterFigure } from '../brand/FooterFigure'
import { GlossButton } from './GlossButton'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* The close: one big rounded black card with a red light behind it, the figure
 * drawn across it, and two glazed pills. `copy` is
 * `{ eyebrow, title, accent, copy, primary, secondary }`. */
export default function GlossCta({ eyebrow, title, accent, copy, primary, secondary }) {
  const reduced = usePrefersReducedMotion()
  return (
    <section className="px-3 pb-6 pt-4 md:px-5 md:pb-8 md:pt-6">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-coal text-white md:rounded-[3.5rem]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <motion.span
            className="absolute -right-24 -top-32 h-[34rem] w-[34rem] bg-[radial-gradient(closest-side,rgba(221,25,22,0.5),transparent)]"
            animate={reduced ? undefined : { x: [0, -50, 20, 0], y: [0, 40, 10, 0] }}
            transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
          />
          <FooterFigure className="absolute -bottom-24 right-[4%] h-[34rem] w-auto" />
        </div>
        <Container wide className="relative py-20 md:py-28">
          <Label onDark>{eyebrow}</Label>
          <Headline title={title} accent={accent} onDark className="mt-6 max-w-[14ch]" />
          <motion.p
            className="mt-8 max-w-[44ch] font-sans text-lede text-white/70"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          >
            {copy}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          >
            <GlossButton to={primary.to} variant="red">{primary.label}</GlossButton>
            {secondary ? <GlossButton to={secondary.to} variant="glass">{secondary.label}</GlossButton> : null}
          </motion.div>
        </Container>
      </div>
    </section>
  )
}
