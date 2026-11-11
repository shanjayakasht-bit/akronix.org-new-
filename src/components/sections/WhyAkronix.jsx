import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Button } from '../ui/Button'
import { Label } from '../ui/Pill'
import { Arrow } from '../ui/Arrow'
import { RollText } from '../ui/RollText'
import { Headline } from './SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { advantages, quote } from '../../content/home'
import { cx } from '../../lib/cx'

const EASE = [0.16, 1, 0.3, 1]

/* "Why Businesses Choose Akronix" (Step 6 rebuild).
 *
 * The heading and the closing line are held in a column on the left; the six
 * reasons run past it as ruled rows. The row crossing the middle of the screen
 * is the one being read -- its number turns red and a bar slides in down its
 * left edge, its title comes to full strength and its link opens -- while the
 * rest fall back. Hovering a row does the same. No icons, no circles: the
 * numbers and the words are the whole identification.
 *
 * Every row is a link to the page that backs the claim up, so a claim and its
 * evidence are one click apart. The closing line is the live site's own. */
function Row({ item, index, reduced }) {
  const ref = useRef(null)
  /* A band across the middle of the screen. Narrow, so one row at a time. */
  const reading = useInView(ref, { margin: '-42% 0px -42% 0px' })

  return (
    <motion.li
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative border-t border-rule last:border-b"
    >
      <Link to={item.to} className="group/roll group relative block py-7 pl-5 pr-2 transition-colors duration-500 hover:bg-white md:py-9 md:pl-8">
        <span
          aria-hidden="true"
          className={cx(
            'absolute inset-y-0 left-0 w-[3px] origin-top bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100',
            reading ? 'scale-y-100' : 'scale-y-0',
          )}
        />
        <div className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 md:grid-cols-[4rem_1fr_auto] md:gap-x-8">
          <span className={cx('tnum pt-2 font-sans text-mark transition-colors duration-500', reading ? 'text-brand' : 'text-ink-3')}>
            {String(index + 1).padStart(2, '0')}
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h3
                className={cx(
                  'font-display text-h2 transition-colors duration-500 group-hover:text-ink',
                  reading ? 'text-ink' : 'text-ink/35',
                )}
              >
                {item.title}
              </h3>
              {item.stage ? (
                <span className="inline-flex items-center gap-2 border border-ink/25 px-2.5 py-1 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                  {item.stage}
                </span>
              ) : null}
            </div>
            <p className="mt-4 max-w-[52ch] font-sans text-body text-ink-2">{item.copy}</p>
            <span
              className={cx(
                'mt-5 inline-flex items-center gap-2.5 font-sans text-ui font-medium text-ink transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100',
                reading ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0',
              )}
            >
              <RollText>{item.cta}</RollText>
              <Arrow className="transition-transform duration-300 group-hover/roll:translate-x-1" />
            </span>
          </div>

          <Arrow className="mt-2 hidden h-6 w-6 -rotate-45 text-ink-3 transition-colors duration-500 group-hover:text-brand md:block" />
        </div>
      </Link>
    </motion.li>
  )
}

export default function WhyAkronix() {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="mist" pad="md">
      <Container wide>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Label index="03">Our approach</Label>
              <Headline title="Built on engineering." accent="Driven by outcomes." size="text-h2" className="mt-6 max-w-[16ch]" />

              <motion.div
                className="mt-10 max-w-[30rem]"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              >
                <p className="font-display text-h3 text-ink">
                  {quote.text[0]} <span className="text-ink-3">{quote.text[1]}</span>
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to="/contact">Get in Touch</Button>
                  <Button to="/about" variant="outline">How We Work</Button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul>
              {advantages.map((a, i) => (
                <Row key={a.title} item={a} index={i} reduced={reduced} />
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Band>
  )
}
