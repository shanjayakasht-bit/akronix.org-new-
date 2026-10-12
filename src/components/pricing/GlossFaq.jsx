import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* The questions, as rounded glossy cards in two columns (Step 7).
 *
 * Still set out in the open, not behind a click: with no clients and nothing
 * shipped, a plain answer to a hard question is the only proof there is. Each
 * card carries a round number, the question and the answer, and rises into place
 * a beat after its neighbour. `items` is `[{ q, a: [paragraph] }]`. */
export default function GlossFaq({ eyebrow, title, accent, items, index = '04' }) {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="mist" pad="md">
      <Container wide>
        <div className="max-w-[40rem]">
          <Label index={index}>{eyebrow}</Label>
          <Headline title={title} accent={accent} size="text-h1" className="mt-6" />
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <motion.li
              key={item.q}
              className="gloss rounded-[2rem] p-8 md:p-10"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.85, ease: EASE, delay: (i % 2) * 0.1 }}
            >
              <span className="tnum inline-flex size-9 items-center justify-center rounded-full bg-ink font-sans text-[0.75rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-display text-h3 text-ink">{item.q}</h3>
              <div className="mt-4 space-y-3">
                {item.a.map((p) => (
                  <p key={p} className="font-sans text-ui leading-relaxed text-ink-2">
                    {p}
                  </p>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </Container>
    </Band>
  )
}
