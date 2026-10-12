import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Headline } from './SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* Questions with answers that are paragraphs, not one-liners, set out in the
 * open rather than behind an accordion: with nothing shipped and no clients to
 * point to, a plain answer to a hard question is the only proof there is, and
 * hiding it behind a click defeats the purpose. The question is on the left,
 * the answer on the right, and a hairline draws across above each pair as it
 * arrives. The heading holds still in a sticky column while they pass.
 *
 * `faq` is `{ eyebrow, title, accent, items: [{ q, a: [paragraph] }] }`. */
export default function Faq({ eyebrow, title, accent, items, index = '04' }) {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="light">
      <Container wide>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Label index={index}>{eyebrow}</Label>
              <Headline title={title} accent={accent} size="text-h2" className="mt-6 max-w-[12ch]" />
            </div>
          </div>

          <div className="lg:col-span-8">
            {items.map((item, i) => (
              <div key={item.q} className="relative grid gap-4 py-9 first:pt-0 md:grid-cols-12 md:gap-8 md:py-11 md:first:pt-0">
                {i > 0 ? (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20"
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 1.1, ease: EASE }}
                  />
                ) : null}
                <motion.h3
                  className="font-display text-h3 text-ink md:col-span-5"
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  {item.q}
                </motion.h3>
                <motion.div
                  className="space-y-4 md:col-span-7"
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                >
                  {item.a.map((p) => (
                    <p key={p} className="font-sans text-body text-ink-2">
                      {p}
                    </p>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Band>
  )
}
