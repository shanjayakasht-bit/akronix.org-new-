import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Button } from '../ui/Button'
import { Headline } from './SectionHead'
import Booking from '../home/Booking'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { finalCta } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* The close: the question on the left, the scheduler on the right, so a visitor
 * who is ready can book without leaving the page. On white, straight before the
 * black footer. `#book` and `#slots` are still the anchors other links use. */
export default function FinalCta() {
  const reduced = usePrefersReducedMotion()
  const up = (d) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 0.8, ease: EASE, delay: d },
        }

  return (
    <Band tone="mist" id="book">
      <Container wide>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <motion.div {...up(0)}>
              <Label index="05">{finalCta.eyebrow}</Label>
            </motion.div>
            <Headline title="Ready to Talk About" accent="Your Project?" className="mt-6 max-w-[14ch]" size="text-h1" />
            <motion.p className="mt-8 max-w-[44ch] font-sans text-lede text-ink-2" {...up(0.25)}>
              {finalCta.copy}
            </motion.p>
            <motion.div className="mt-10 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3" {...up(0.35)}>
              <Button to="/contact" size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                Get Started Today
              </Button>
              <Button as="a" href="#slots" variant="outline" size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                Book a Free Consultation
              </Button>
            </motion.div>
          </div>

          <motion.div id="slots" className="scroll-mt-32 lg:col-span-6" {...up(0.15)}>
            <Booking />
          </motion.div>
        </div>
      </Container>
    </Band>
  )
}
