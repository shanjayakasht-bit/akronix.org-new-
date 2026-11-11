import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Arrow } from '../ui/Arrow'
import { RollText } from '../ui/RollText'
import { SectionIntro } from './SectionHead'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { pillars } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* The four pillars, as four panels side by side.
 *
 * One panel is open at a time and it is wider than the rest; moving to another
 * hands the width over on a spring, the open one turns black and the others
 * stay white. Width is animated rather than height, so nothing below the
 * section is ever pushed -- which is why hovering is allowed to open a panel
 * here, where it was not on the old vertical accordion (Step 3t). Focus and
 * click open one too.
 *
 * The panel titles hold a fixed measure (10ch) so they wrap the same whether
 * the panel is wide or narrow, and the body of an open panel is a fixed-width
 * block clipped by the panel, so text never reflows while the width moves.
 *
 * Below `lg` it is an ordinary accordion: panels side by side would be a
 * column too narrow to read. */
function Panel({ p, i, active, onOpen }) {
  const on = active === i
  return (
    <motion.div
      animate={{ flexGrow: on ? 2.6 : 1 }}
      transition={{ type: 'spring', stiffness: 130, damping: 24, mass: 0.9 }}
      onMouseEnter={() => onOpen(i)}
      onFocusCapture={() => onOpen(i)}
      className={cx(
        'relative min-w-0 basis-0 overflow-hidden border-l border-rule transition-colors duration-500 first:border-l-0',
        on ? 'bg-coal text-white' : 'bg-white text-ink',
      )}
    >
      <Link to={p.to} className="group/roll absolute inset-0 flex flex-col justify-between p-7 xl:p-8">
        <span className="flex items-start justify-between">
          <span className={cx('tnum font-sans text-mark transition-colors duration-500', on ? 'text-white/55' : 'text-ink-3')}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <Arrow className={cx('h-6 w-6 -rotate-45 transition-all duration-500', on ? 'text-brand-soft' : 'text-ink-3 group-hover/roll:text-ink')} />
        </span>

        <span className="block">
          <span className={cx('block font-sans text-mark font-medium uppercase transition-colors duration-500', on ? 'text-white/55' : 'text-ink-3')}>
            {p.eyebrow}
          </span>
          <span className="mt-4 block max-w-[10ch] font-display text-h3">{p.title}</span>

          <span
            className={cx(
              'mt-7 block w-[26rem] transition-all duration-500',
              on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-5 opacity-0',
            )}
          >
            <span className="block font-sans text-body text-white/70">{p.copy}</span>
            <span className="mt-6 grid grid-cols-2 gap-x-6 border-t border-white/15">
              {p.items.map((it) => (
                <span key={it} className="border-b border-white/15 py-2.5 font-sans text-ui text-white/85">
                  {it}
                </span>
              ))}
            </span>
            <span className="mt-7 inline-flex items-center gap-3 font-sans text-ui font-medium text-white">
              <RollText>{p.cta}</RollText>
              <Arrow className="transition-transform duration-300 group-hover/roll:translate-x-1" />
            </span>
          </span>
        </span>
      </Link>
    </motion.div>
  )
}

function Row({ p, i, open, onToggle, reduced }) {
  const on = open === i
  return (
    <div className="border-b border-rule bg-white">
      <button type="button" onClick={() => onToggle(i)} aria-expanded={on} className="flex w-full items-center gap-5 px-5 py-6 text-left">
        <span className="tnum font-sans text-mark text-ink-3">{String(i + 1).padStart(2, '0')}</span>
        <span className="flex-1 font-display text-h3 text-ink">{p.title}</span>
        <span aria-hidden="true" className="relative block size-4">
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink" />
          <span className={cx('absolute inset-y-0 left-1/2 w-px bg-ink transition-transform duration-500', on && 'scale-y-0')} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {on ? (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-8 pl-[3.75rem]">
              <p className="font-sans text-mark font-medium uppercase text-ink-3">{p.eyebrow}</p>
              <p className="mt-3 font-sans text-body text-ink-2">{p.copy}</p>
              <ul className="mt-5 border-t border-rule">
                {p.items.map((it) => (
                  <li key={it} className="border-b border-rule py-2.5 font-sans text-ui text-ink">{it}</li>
                ))}
              </ul>
              <Link to={p.to} className="group/roll mt-6 inline-flex items-center gap-3 border-b border-ink pb-1 font-sans text-ui font-medium text-ink">
                <RollText>{p.cta}</RollText>
                <Arrow className="transition-transform duration-300 group-hover/roll:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function Pillars() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(-1)

  return (
    <Band tone="mist" pad="md">
      <Container wide>
        <SectionIntro
          eyebrow="What we do"
          index="01"
          title="Technology and expertise"
          accent="for every stage of growth."
          titleClass="text-h2"
          sub="Software development, digital marketing, business networking and mentorship, delivered from Chennai."
        />

        <motion.div
          className="mt-12 hidden h-[36rem] border border-rule lg:flex"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 1, ease: EASE }}
        >
          {pillars.map((p, i) => (
            <Panel key={p.title} p={p} i={i} active={active} onOpen={setActive} />
          ))}
        </motion.div>

        <div className="mt-12 border-t border-rule lg:hidden">
          {pillars.map((p, i) => (
            <Row key={p.title} p={p} i={i} open={open} onToggle={(n) => setOpen((v) => (v === n ? -1 : n))} reduced={reduced} />
          ))}
        </div>
      </Container>
    </Band>
  )
}
