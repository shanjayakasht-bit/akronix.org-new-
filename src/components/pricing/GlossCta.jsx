import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { FooterFigure } from '../brand/FooterFigure'
import { Reveal } from '../motion/Reveal'
import { GlossButton } from './GlossButton'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]
const STEP_DELAY = ['delay-[200ms]', 'delay-[350ms]', 'delay-[500ms]']

/* The close: one big rounded black card with a red light behind it, the figure
 * drawn across it, two glazed pills -- and, from Step 7.2, what happens after the
 * button. `copy` is `{ eyebrow, title, accent, copy, primary, secondary, steps }`
 * where `steps` is `[{ title, copy }]`. Three glass steps on a line down the
 * right say what a visitor can expect, each a promise this page already makes;
 * without `steps` the card is the text alone, as before. */
export default function GlossCta({ eyebrow, title, accent, copy, primary, secondary, steps }) {
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
        <Container wide className="relative grid gap-14 py-20 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className={steps?.length ? 'lg:col-span-7' : 'lg:col-span-12'}>
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
          </div>

          {steps?.length ? (
            <ol className="relative grid gap-4 lg:col-span-5">
              {/* the line the steps hang on */}
              <span aria-hidden="true" className="absolute bottom-9 left-[2.625rem] top-9 hidden w-px bg-white/15 sm:block" />
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={STEP_DELAY[i]} className="gloss-dark relative flex items-start gap-5 rounded-[1.75rem] p-5 sm:p-6">
                  <span className="tnum relative inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white font-sans text-[0.75rem] font-medium text-ink shadow-[inset_0_1px_0_#fff]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="block">
                    <span className="block font-display text-[1.375rem] leading-snug tracking-[-0.015em] text-white">{s.title}</span>
                    <span className="mt-1 block font-sans text-ui text-white/65">{s.copy}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
          ) : null}
        </Container>
      </div>
    </section>
  )
}
