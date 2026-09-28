import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Button } from '../ui/Button'
import SectionHead from '../sections/SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { buildingUnique } from '../../content/building'

const EASE = [0.16, 1, 0.3, 1]

/* The live products page closes on "Have a Unique Requirement?" -- centred,
 * with two buttons -- and so does this one, in the same place, straight before
 * the footer. No background: it sits on the cream page itself, at the
 * client's request (Step 4.6). It was a sand slab before; do not put one
 * back. */
export default function UniqueRequirement() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="py-16 md:py-24">
        <Container>
          <SectionHead
            eyebrow={buildingUnique.eyebrow}
            tone="clay"
            title={buildingUnique.title}
            accent={buildingUnique.accent}
            sub={buildingUnique.copy}
            reveal="letters"
            className="mx-auto text-center"
          />

          {/* The FinalCta pair's arrangement: side by side on a phone at the
              compact size, content-width again from `sm`. */}
          <motion.div
            className="mt-10 flex flex-nowrap items-center justify-center gap-2 sm:flex-wrap sm:gap-4"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          >
            <Button
              to={buildingUnique.primary.to}
              size="compact"
              className="flex-auto justify-center whitespace-nowrap sm:flex-none"
            >
              {buildingUnique.primary.label}
            </Button>
            <Button
              to={buildingUnique.secondary.to}
              variant="outline"
              size="compact"
              className="flex-auto justify-center whitespace-nowrap sm:flex-none"
            >
              {buildingUnique.secondary.label}
            </Button>
          </motion.div>
        </Container>
    </section>
  )
}
