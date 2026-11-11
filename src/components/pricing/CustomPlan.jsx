import { useState } from 'react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { RollText } from '../ui/RollText'
import { GlossButton } from './GlossButton'
import { Reveal } from '../motion/Reveal'
import { FooterFigure } from '../brand/FooterFigure'
import { cx } from '../../lib/cx'
import { customPlan } from '../../content/pricing'

/* "Need something larger?", as a picker (Step 7.2).
 *
 * It was a heading, a button and six glazed pills that only decorated. The six
 * things a custom arrangement can include are now buttons: tap whatever applies
 * and each lights the way the chosen plan does in "Choose a plan" -- white glass
 * with a red ring -- while a line under them says what has been picked. The
 * button then opens the contact form with the Enterprise plan chosen and the
 * picked lines written into the message (`?custom=0,3`, positions in
 * `customPlan.items`; ContactForm reads only those). Pick nothing and it is the
 * same plain "Book a Free Consultation" as before.
 *
 * A dark glass card inside the page's own width, so it reads as a feature of
 * the page and not as a third full-bleed stage beside "Choose a plan" and the
 * close. */
export default function CustomPlan() {
  const [picked, setPicked] = useState([])
  const toggle = (i) => setPicked((p) => (p.includes(i) ? p.filter((n) => n !== i) : [...p, i]))
  const chosen = [...picked].sort((a, b) => a - b)
  const href = chosen.length ? `/contact?plan=enterprise&custom=${chosen.join(',')}` : customPlan.primary.to

  return (
    <Band tone="light" pad="none" className="pb-16 md:pb-24">
      <Container wide>
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-coal text-white md:rounded-[3.5rem]">
          {/* a drafting grid that fades out toward the chips, and the figure, very faint */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <span className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:3.5rem_3.5rem] [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
            <FooterFigure className="absolute -bottom-20 -left-10 h-[26rem] w-auto" />
          </div>

          <div className="relative grid gap-12 p-8 py-14 md:p-14 lg:grid-cols-12 lg:gap-14 lg:py-20">
            <div className="lg:col-span-5">
              <Label onDark index="03">{customPlan.eyebrow}</Label>
              <Headline title={customPlan.title} accent={customPlan.accent} onDark size="text-h2" className="mt-6" />
              <Reveal as="p" delay="delay-[150ms]" className="mt-6 max-w-[40ch] font-sans text-lede text-white/70">
                {customPlan.copy}
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <p className="font-sans text-ui text-white/60">Tap whatever applies.</p>
              <ul className="mt-5 flex flex-wrap gap-3">
                {customPlan.items.map((t, i) => {
                  const on = picked.includes(i)
                  return (
                    <Reveal as="li" key={t} delay={['delay-[0ms]', 'delay-[70ms]', 'delay-[140ms]', 'delay-[210ms]', 'delay-[280ms]', 'delay-[350ms]'][i]}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(i)}
                        className={cx(
                          'gloss-dark group/roll relative inline-flex items-center gap-3 rounded-full py-3 pl-4 pr-6 text-left font-display text-[1.0625rem] tracking-[-0.01em] outline-offset-[3px] transition-[color,translate,outline-color] duration-300 hover:-translate-y-0.5 md:text-[1.3125rem]',
                          on ? 'text-ink outline outline-2 outline-brand-soft' : 'text-white outline outline-2 outline-transparent',
                        )}
                      >
                        {/* the white glass a chosen chip turns into */}
                        <span
                          aria-hidden="true"
                          className={cx(
                            'absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-b from-white via-[#f4f6f9] to-[#dde1e8] transition-opacity duration-500',
                            on ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <span
                          aria-hidden="true"
                          className={cx(
                            'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                            on ? 'border-brand bg-brand text-white' : 'border-white/35 text-transparent',
                          )}
                        >
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                            <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                          </svg>
                        </span>
                        <span className="relative">
                          <RollText>{t}</RollText>
                        </span>
                      </button>
                    </Reveal>
                  )
                })}
              </ul>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-white/12 pt-8">
                <p className="max-w-[44ch] font-sans text-ui text-white/65" aria-live="polite">
                  {chosen.length ? (
                    <>
                      <span className="tnum text-white">{String(chosen.length).padStart(2, '0')}</span> picked: {chosen.map((i) => customPlan.items[i]).join(', ')}.
                    </>
                  ) : (
                    'Nothing picked yet. You can also just tell us in your own words.'
                  )}
                </p>
                <GlossButton to={href} variant="white">
                  {chosen.length ? 'Talk about these' : customPlan.primary.label}
                </GlossButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Band>
  )
}
