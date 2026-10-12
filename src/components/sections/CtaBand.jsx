import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Button } from '../ui/Button'
import { Headline } from './SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* The closing call to action of an inner page: the question set large on the
 * left, a sentence and the buttons on the right, on light grey. One component
 * for every page, each with its own words. `copy` is
 * `{ eyebrow, title, accent, copy, primary, secondary }`. */
export default function CtaBand({ eyebrow, title, accent, copy, primary, secondary }) {
  const reduced = usePrefersReducedMotion()
  const up = (d) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 0.8, ease: EASE, delay: d },
        }

  return (
    <Band tone="mist">
      <Container wide>
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.div {...up(0)}>
              <Label>{eyebrow}</Label>
            </motion.div>
            <Headline title={title} accent={accent} className="mt-6 max-w-[14ch]" size="text-h1" delay={0.05} />
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <motion.p className="max-w-[44ch] font-sans text-lede text-ink-2" {...up(0.2)}>
              {copy}
            </motion.p>
            <motion.div className="mt-9 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3" {...up(0.3)}>
              <Button to={primary.to} size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                {primary.label}
              </Button>
              {secondary ? (
                <Button to={secondary.to} variant="outline" size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                  {secondary.label}
                </Button>
              ) : null}
            </motion.div>
          </div>
        </div>
      </Container>
    </Band>
  )
}
