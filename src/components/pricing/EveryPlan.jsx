import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { SectionIntro } from '../sections/SectionHead'
import { GlossButton } from './GlossButton'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { everyPlan, customPlan } from '../../content/pricing'

const EASE = [0.16, 1, 0.3, 1]

/* Two blocks, glazed and curved (Step 7).
 *
 * "What every plan includes" is five rounded glossy tiles in a bento: two rows,
 * three tiles then two, so the grid has a rhythm instead of five equal boxes.
 * Each carries a round index, its name and one sentence, and a band of light
 * crosses it on hover.
 *
 * "Need something larger?" is a heading and a button on the left and, on the
 * right, the things a custom arrangement can include as glossy pills that spring
 * in one after another. */
const SPAN = ['md:col-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-3', 'md:col-span-3']

export default function EveryPlan() {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="light" pad="md">
      <Container wide>
        <SectionIntro eyebrow={everyPlan.eyebrow} index="02" title={everyPlan.title} accent={everyPlan.accent} />

        <ul className="mt-14 grid gap-4 md:grid-cols-6">
          {everyPlan.items.map((it, i) => (
            <motion.li
              key={it.name}
              className={cx('gloss rounded-[2rem] p-8 md:min-h-[14rem]', SPAN[i])}
              initial={reduced ? false : { opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.85, ease: EASE, delay: i * 0.08 }}
            >
              <span className="tnum inline-flex size-10 items-center justify-center rounded-full bg-ink font-sans text-[0.75rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-8 font-display text-h3 text-ink">{it.name}</h3>
              <p className="mt-3 max-w-[40ch] font-sans text-ui text-ink-2">{it.copy}</p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Label index="03">{customPlan.eyebrow}</Label>
            <Headline title={customPlan.title} accent={customPlan.accent} size="text-h2" className="mt-6" />
            <motion.p
              className="mt-6 max-w-[40ch] font-sans text-lede text-ink-2"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            >
              {customPlan.copy}
            </motion.p>
            <motion.div
              className="mt-9"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            >
              <GlossButton to={customPlan.primary.to} variant="dark">{customPlan.primary.label}</GlossButton>
            </motion.div>
          </div>

          <ul className="flex flex-wrap content-start gap-3 lg:col-span-7">
            {customPlan.items.map((t, i) => (
              <motion.li
                key={t}
                initial={reduced ? false : { opacity: 0, scale: 0.88, y: 22 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-6% 0px' }}
                transition={{ type: 'spring', stiffness: 170, damping: 18, delay: i * 0.07 }}
                className="gloss rounded-full px-7 py-4 font-display text-h3 text-ink transition-transform duration-500 hover:-translate-y-1"
              >
                {t}
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </Band>
  )
}
