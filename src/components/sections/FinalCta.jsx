import { motion } from 'motion/react'
import { Container } from '../primitives'
import SectionHead from './SectionHead'
import { Button } from '../ui/Button'
import Booking from '../home/Booking'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { finalCta } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* No slab behind this one, by request -- it sits straight on the cream page.
   Everything inside it, Booking included, is untouched. */

export default function FinalCta() {
  const reduced = usePrefersReducedMotion()
  const up = (d) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-10% 0px' },
      transition: { duration: 0.7, ease: EASE, delay: d },
    }

  return (
    <section id="book" className="py-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow={finalCta.eyebrow}
              tone="ochre"
              title="Ready to Talk About"
              accent="Your Project?"
              reveal="letters"
              sub={finalCta.copy}
            />
            {/* Side by side on a phone, by request, which is only possible at
                the compact size -- see `Button`. They are back on their own
                terms, and free to wrap again, from `sm`. */}
            <motion.div className="mt-10 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-4" {...up(0.2)}>
              <Button to="/contact" size="compact" className="whitespace-nowrap">
                Get Started Today
              </Button>
              <Button as="a" href="#slots" variant="outline" size="compact" className="whitespace-nowrap">
                Book a Free Consultation
              </Button>
            </motion.div>
          </div>

          <motion.div id="slots" className="scroll-mt-28 lg:col-span-6 lg:col-start-7" {...up(0.12)}>
            <Booking />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
