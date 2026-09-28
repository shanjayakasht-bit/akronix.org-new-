import { motion } from 'motion/react'
import { Container } from '../primitives'
import SectionHead from './SectionHead'
import { Button } from '../ui/Button'
import Booking from '../home/Booking'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { finalCta } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* No slab behind this one, by request -- it sits straight on the cream page.
   Everything inside it, Booking included, is untouched.

   Every piece of copy is a prop so another page can close the same way with
   its own words. Left out, each one is the homepage's, exactly as it was. */
const HOME = {
  eyebrow: finalCta.eyebrow,
  title: 'Ready to Talk About',
  accent: 'Your Project?',
  copy: finalCta.copy,
  primary: { label: 'Get Started Today', to: '/contact' },
  secondary: { label: 'Book a Free Consultation', href: '#slots' },
}

export default function FinalCta({
  eyebrow = HOME.eyebrow,
  title = HOME.title,
  accent = HOME.accent,
  copy = HOME.copy,
  primary = HOME.primary,
  secondary = HOME.secondary,
}) {
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
              eyebrow={eyebrow}
              tone="ochre"
              title={title}
              accent={accent}
              reveal="letters"
              sub={copy}
            />
            {/* Side by side on a phone, by request, which is only possible at
                the compact size -- see `Button`. They are back on their own
                terms, and free to wrap again, from `sm`.

                `flex-auto` fills the column edge to edge rather than hugging
                the labels, and keeps the two in the proportion of their own
                words rather than halving the row -- see the hero pair for why
                the basis is `auto` and not 0. Off at `sm` the same way. */}
            <motion.div className="mt-10 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-4" {...up(0.2)}>
              <Button to={primary.to} size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                {primary.label}
              </Button>
              <Button as="a" href={secondary.href} variant="outline" size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                {secondary.label}
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
