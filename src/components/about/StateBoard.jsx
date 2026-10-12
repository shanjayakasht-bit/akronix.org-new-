import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { RollText } from '../ui/RollText'
import { Arrow } from '../ui/Arrow'
import { SectionIntro } from '../sections/SectionHead'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { state } from '../../content/about'
import { products } from '../../content/products'

const EASE = [0.16, 1, 0.3, 1]

/* The page's demonstration.
 *
 * The live About page opens its case with a timeline and a team; this site has
 * neither to show, so it shows the thing that is checkable: five rows, each a
 * part of the studio, each with the stage it is actually at. Nothing is rounded
 * up. A row's marker says whether the work is moving (a slow pulse for "In
 * development" and "Forming"), settled ("Open", "Offered") or not started
 * ("Planned", hollow). The pulse is the one piece of continuous motion on the
 * page and it only ever marks work that is really in progress.
 *
 * The two product rows also carry the products' own colours (Step 7): six solid
 * blocks for the six being built, six pale ones for the six not started, the same
 * language as the colour bar on the home page and the spectrum on /building. They
 * lift one after another when the row is hovered. They are decoration -- the
 * names are in the sentence beside them.
 *
 * Set as a ruled table; every row links to the place that backs it up and
 * lights on hover with a bar down its left edge. With sound on, a row that is
 * being worked on pulses when the pointer reaches it and the rest give a soft
 * thud (`data-sound`, read by SoundScope). */
const STAGE = {
  'In development': { dot: 'bg-brand', pulse: true },
  Planned: { dot: 'border border-ink/60', pulse: false },
  Open: { dot: 'bg-ink', pulse: false },
  Offered: { dot: 'bg-ink', pulse: false },
  Forming: { dot: 'bg-brand', pulse: true },
}

/* literal, so Tailwind sees every one */
const LIFT = ['delay-0', 'delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300']

function Chips({ kind }) {
  const list = products.filter((p) => p.building === (kind === 'building'))
  return (
    <span aria-hidden="true" className="mt-5 flex gap-1.5">
      {list.map((p, i) => (
        <span
          key={p.name}
          className={cx(
            'h-2 w-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5',
            LIFT[i] ?? 'delay-300',
            kind === 'building' ? p.accent.bar : p.accent.soft,
          )}
        />
      ))}
    </span>
  )
}

export default function StateBoard() {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="mist">
      <Container wide>
        <SectionIntro eyebrow={state.eyebrow} index="03" title={state.title} accent={state.accent} sub={state.sub} />

        <ul className="mt-16 border-t border-ink/20">
          {state.rows.map((r, i) => {
            const st = STAGE[r.stage]
            return (
              <motion.li
                key={r.what}
                className="relative border-b border-ink/20"
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6% 0px' }}
                transition={{ duration: 0.85, ease: EASE }}
              >
                <Link
                  to={r.to}
                  data-sound={st.pulse ? 'pulse' : 'soft'}
                  className="group/roll group relative grid items-baseline gap-x-8 gap-y-3 py-8 pl-0 transition-all duration-500 hover:bg-white hover:pl-5 md:grid-cols-12 md:py-9"
                >
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                  <span className="flex items-baseline gap-5 font-display text-h2 text-ink md:col-span-4">
                    <span className="tnum w-6 shrink-0 font-sans text-mark text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <RollText>{r.what}</RollText>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-3 font-sans text-mark font-medium uppercase text-ink md:col-span-2">
                    <span className="relative inline-flex size-2">
                      {st.pulse && !reduced ? <span aria-hidden="true" className={cx('absolute inset-0 animate-ping rounded-full opacity-60', st.dot)} /> : null}
                      <span aria-hidden="true" className={cx('relative size-2 rounded-full', st.dot)} />
                    </span>
                    {r.stage}
                  </span>
                  <span className="block md:col-span-5">
                    <span className="block font-sans text-body text-ink-2">{r.note}</span>
                    {r.chips ? <Chips kind={r.chips} /> : null}
                  </span>
                  <Arrow className="hidden h-6 w-6 -rotate-45 justify-self-end text-ink-3 transition-all duration-500 group-hover:text-brand md:col-span-1 md:block" />
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </Container>
    </Band>
  )
}
