import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Container } from '../primitives'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { FooterFigure } from '../brand/FooterFigure'
import { RollText } from '../ui/RollText'
import { GlossButton } from './GlossButton'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { finder, plans, pricingNote } from '../../content/pricing'

const EASE = [0.16, 1, 0.3, 1]

/* The plans, as glass on a dark curved stage (Step 7).
 *
 * The client asked for the pricing page to be glossier and curvier. So the plans
 * leave the flat white table and sit on a black slab with a large radius, lit
 * from above by a slow red light and with the Akronix figure drawn very large
 * behind them -- which is what the frosted cards are for: they blur it. Each plan
 * is a rounded sheet of that glass with a bright top rim, a pale dome across it
 * and a band of light that crosses it on hover.
 *
 * One plan is lit: it turns to white glass with a red ring around it. Which one
 * is chosen by the FINDER above the cards -- "I am a student or founder / a
 * growing business / an established company / a large organisation" -- or by
 * clicking a card. The ring is one shared element that SLIDES from plan to plan,
 * and the finder's white pill slides the same way. The finder only maps a person
 * to the plan the live page already wrote for them ("Students, individuals and
 * early-stage startups" is Starter's own line); the lit card is a suggestion, not
 * a popularity claim, and the page still says nothing about anyone having bought
 * a plan.
 *
 * Every plan's button opens the contact form with that plan chosen.
 *
 * Prices and contents are the live page's, unchanged (settled -- see
 * `content/pricing.js`). */
function Tick({ delay, reduced, className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" aria-hidden="true" className={cx('mt-[3px] h-4 w-4 shrink-0', className)}>
      <motion.path
        d="m4.5 10.5 3.5 3.5 7.5-8"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE, delay }}
      />
    </svg>
  )
}

function PlanCard({ p, i, lit, onLight, reduced }) {
  return (
    <motion.li
      className="relative"
      initial={reduced ? false : { opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: i * 0.09 }}
    >
      <article
        onClick={(e) => {
          if (!e.target.closest('a')) onLight()
        }}
        className={cx(
          'gloss-dark group relative flex h-full cursor-pointer flex-col rounded-[2rem] p-8 transition-[transform,color] duration-500 hover:-translate-y-1.5 xl:p-9',
          lit ? 'text-ink' : 'text-white',
        )}
      >
        {/* the white glass the lit plan turns into */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-b from-white via-[#f4f6f9] to-[#dde1e8]"
          initial={false}
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        />

        <div className="flex items-center justify-between gap-3">
          <p className={cx('font-sans text-mark font-medium uppercase transition-colors duration-500', lit ? 'text-ink' : 'text-white')}>{p.name}</p>
          <AnimatePresence>
            {lit ? (
              <motion.span
                key="tag"
                className="rounded-full bg-brand px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.12em] text-white"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                For you
              </motion.span>
            ) : (
              <motion.span key="n" exit={{ opacity: 0 }} className="tnum font-sans text-mark text-white/40">
                {String(i + 1).padStart(2, '0')} / 04
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <p className={cx('mt-4 min-h-[3.25rem] font-sans text-ui transition-colors duration-500', lit ? 'text-ink-2' : 'text-white/65')}>{p.for}</p>

        <p className="mt-9 flex items-baseline gap-2">
          <span className="tnum font-display text-[3.25rem] font-light leading-none tracking-[-0.045em]">{p.price}</span>
          <span className={cx('font-sans text-ui transition-colors duration-500', lit ? 'text-ink-3' : 'text-white/55')}>{p.per}</span>
        </p>

        <GlossButton to={`/contact?plan=${p.key}`} variant={lit ? 'dark' : 'white'} className="mt-8 w-full">
          {p.cta}
        </GlossButton>

        <p className={cx('mt-9 border-t pt-5 font-sans text-mark font-medium uppercase transition-colors duration-500', lit ? 'border-ink/10 text-ink-3' : 'border-white/15 text-white/50')}>
          {p.lead}
        </p>
        <ul className="mt-2">
          {p.items.map((t, j) => (
            <li
              key={t}
              className={cx(
                'flex items-start gap-3 border-b py-3 font-sans text-ui transition-colors duration-500 last:border-b-0',
                lit ? 'border-ink/10 text-ink-2' : 'border-white/10 text-white/85',
              )}
            >
              <Tick delay={0.25 + j * 0.07} reduced={reduced} className={lit ? 'text-brand' : 'text-brand-soft'} />
              {t}
            </li>
          ))}
        </ul>
      </article>

      {/* one ring for all four, sliding to whichever is lit */}
      {lit ? (
        <motion.span
          layoutId="plan-ring"
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[5px] rounded-[2.25rem] border-2 border-brand-soft"
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        />
      ) : null}
    </motion.li>
  )
}

export default function Plans() {
  const reduced = usePrefersReducedMotion()
  const [lit, setLit] = useState('growth')

  return (
    <section id="plans" className="scroll-mt-24 px-3 py-4 md:px-5 md:py-6">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-coal text-white md:rounded-[3.5rem]">
        {/* the stage: a red light from above that drifts, a pale one low on the
            left, and the figure, enormous, to be blurred by the glass */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <motion.span
            className="absolute left-1/2 top-[-18%] h-[44rem] w-[64rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(221,25,22,0.42),transparent)]"
            animate={reduced ? undefined : { x: [0, 90, -40, 0], y: [0, 36, 10, 0] }}
            transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity }}
          />
          <span className="absolute -left-40 bottom-[-12%] h-[34rem] w-[34rem] bg-[radial-gradient(closest-side,rgba(255,255,255,0.1),transparent)]" />
          <FooterFigure className="absolute left-1/2 top-[18%] h-[52rem] w-auto -translate-x-1/2 opacity-90" />
        </div>

        <Container wide className="relative py-20 md:py-28">
          <Label onDark index="01">Choose a plan</Label>
          <Headline title="Pick the plan" accent="that fits." onDark className="mt-6 max-w-[14ch]" />

          {/* the finder */}
          <LayoutGroup id="finder">
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <p className="font-sans text-ui text-white/60">{finder.prompt}</p>
              <div
                role="radiogroup"
                aria-label="Which plan was written for you?"
                className="gloss-dark -mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]"
              >
                {finder.options.map((o) => {
                  const on = lit === o.key
                  return (
                    <button
                      key={o.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setLit(o.key)}
                      className={cx(
                        'group/roll relative shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 font-sans text-ui font-medium transition-colors duration-300',
                        on ? 'text-ink' : 'text-white/80 hover:text-white',
                      )}
                    >
                      {on ? (
                        <motion.span
                          layoutId="finder-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-[#dfe3ea] shadow-[inset_0_1px_0_#fff,0_8px_18px_-8px_rgba(0,0,0,0.6)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      <span className="relative">
                        <RollText>{o.label}</RollText>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </LayoutGroup>

          <LayoutGroup id="plans">
            <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((p, i) => (
                <PlanCard key={p.key} p={p} i={i} lit={lit === p.key} onLight={() => setLit(p.key)} reduced={reduced} />
              ))}
            </ul>
          </LayoutGroup>

          <p className="mt-12 max-w-[76ch] font-sans text-ui text-white/55">{pricingNote}</p>
        </Container>
      </div>
    </section>
  )
}
