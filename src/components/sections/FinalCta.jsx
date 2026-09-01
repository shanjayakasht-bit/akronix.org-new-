import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Slab } from '../ui/Slab'
import SectionHead from './SectionHead'
import { Button } from '../ui/Button'
import Booking from '../home/Booking'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { finalCta } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

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
    <Slab tone="sand" id="book">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow={finalCta.eyebrow}
              tone="ochre"
              title="Ready to Talk About"
              accent="Your Project?"
              sub={finalCta.copy}
            />
            <motion.div className="mt-10 flex flex-wrap gap-4" {...up(0.2)}>
              <Button to="/contact">Get Started Today</Button>
              <Button as="a" href="#slots" variant="outline">Book a Free Consultation</Button>
            </motion.div>
          </div>

          <motion.div id="slots" className="scroll-mt-28 lg:col-span-6 lg:col-start-7" {...up(0.12)}>
            <Booking />
          </motion.div>
        </div>
      </Container>
    </Slab>
  )
}
