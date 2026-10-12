import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Button } from '../ui/Button'
import ScrollHighlight from '../motion/ScrollHighlight'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { quote } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* A statement on black, lit a letter at a time as it is scrolled through.
 *
 * It was a quote on cocoa with a large quotation mark behind it; it is a
 * statement now, because nobody is being quoted. `lines` and `cta` let each page
 * say its own line in the same band; left out, it is the homepage's closing
 * line exactly as it was. `videoUrl` is accepted for old callers and ignored --
 * there is no film to watch. */
const HOME_CTA = { label: 'Get in Touch', to: '/contact' }

export default function QuoteBand({ lines = quote.text, cta = HOME_CTA, label = 'In one line', index }) {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="dark">
      <Container wide>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Label onDark index={index}>{label}</Label>
          </div>
          <div className="lg:col-span-9">
            <ScrollHighlight
              lines={lines}
              className="font-light text-[clamp(1.875rem,1.1rem+3.1vw,4.25rem)] leading-[1.1] tracking-[-0.035em]"
              dim="text-white/[0.15]"
              lit="text-white"
            />
            {cta ? (
              <motion.div
                className="mt-12"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              >
                <Button to={cta.to} variant="onDark">{cta.label}</Button>
              </motion.div>
            ) : null}
          </div>
        </div>
      </Container>
    </Band>
  )
}
