import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { RollText } from '../ui/RollText'
import { Slab } from '../ui/Slab'
import SectionHead from './SectionHead'
import * as Glyphs from '../brand/Glyphs'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { pillars } from '../../content/home'
import { cx } from '../../lib/cx'

const EASE = [0.16, 1, 0.3, 1]
/* Each pillar owns a colour. The open one is painted with it, so which row is
   expanded is obvious at a glance -- the previous version only changed the
   text colour and was effectively invisible. */
const TONE = {
  teal:  { text: 'text-slate', panel: 'bg-slate-tint', bar: 'bg-slate', chip: 'bg-slate text-paper' },
  sage:  { text: 'text-moss',  panel: 'bg-moss-tint',  bar: 'bg-moss',  chip: 'bg-moss text-paper' },
  plum:  { text: 'text-clay',  panel: 'bg-clay-tint',  bar: 'bg-clay',  chip: 'bg-clay text-paper' },
  ember: { text: 'text-ochre', panel: 'bg-ochre-tint', bar: 'bg-ochre', chip: 'bg-ochre text-paper' },
}

/* Deliberately not the live site's 2x2 card grid. Four pillars as an opened
 * list: one is expanded at a time, and the row you click takes over.
 *
 * Clicking. Not scrolling, and no longer pointing either -- two drivers have
 * been tried here and dropped, in that order, both on request.
 *
 * Scroll position went first: each row opened as it reached the middle of the
 * screen and closed as the next took over. The reader sets the pace in this
 * section, not the page.
 *
 * `onMouseEnter` went second, and is the current change. Crossing the list on
 * the way down the page threw all four rows open and shut behind the cursor,
 * and a row that opens without being asked pushes everything below it while it
 * is still being read. Click is the only driver left, which also means the
 * desktop behaviour is now the phone's -- there was never a hover there, so the
 * two only agree once hover is gone.
 *
 * The row keeps its faint `hover:bg-ink/[0.03]` and gains `cursor-pointer`.
 * With the expansion gone, those are the whole of the affordance: preflight
 * leaves a `button` on the default arrow, and a row that neither moves nor
 * changes the cursor does not read as pressable.
 *
 * If the scroll driver is ever revived, the one thing to keep from it is that
 * it must measure the *list's* top edge and never a row's: a row's position
 * depends on whether the rows above it are open, so triggering on it feeds the
 * layout back into the thing deciding the layout and oscillates. */
export default function Ecosystem() {
  const reduced = usePrefersReducedMotion()
  /* Nothing is open until the reader clicks a row. */
  const [open, setOpen] = useState(-1)

  return (
    <Slab tone="sand">
      <Container>
        <SectionHead
          eyebrow="Our platform"
          title="The Akronix"
          accent="Ecosystem"
          sub="One platform. Four pillars of growth."
          /* Held to one line on a phone, by request. The three words come to
             11.33x the font size set as they are here, measured, so 7.5vw
             lands at 28px on a 375px screen and leaves 17px over. It meets
             `text-h1` within a pixel at 640px, which is why the handover is
             there and not at a width where it would visibly step. */
          titleClass="flex-nowrap whitespace-nowrap text-[7.5vw] leading-none sm:flex-wrap sm:text-h1"
        />
      </Container>

      {/* Full bleed inside the slab: the list runs to the slab's own edges
          rather than sitting in the 1280 measure, so as the slab opens out the
          rows open with it. The head stays in the measure -- the mismatch is
          the point. */}
      <div className="mt-14 space-y-2 md:mt-18">
        {pillars.map((p, i) => {
          const Glyph = Glyphs[p.glyph]
          const isOpen = open === i
          return (
            <div
              key={p.title}
              className={cx(
                'overflow-hidden rounded-[1.5rem] transition-colors duration-500',
                isOpen ? TONE[p.tone].panel : 'bg-transparent hover:bg-ink/[0.03]',
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="group flex w-full cursor-pointer items-center gap-5 px-6 py-7 text-left md:gap-8 md:px-10 md:py-8 lg:px-14"
              >
                <span
                  className={cx(
                    'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500',
                    isOpen ? TONE[p.tone].chip : 'bg-ink/[0.05] text-ink-3',
                  )}
                >
                  {Glyph ? <Glyph className="h-5.5 w-5.5" /> : null}
                </span>
                <span className={cx('w-8 shrink-0 font-sans text-mark transition-colors duration-500', isOpen ? TONE[p.tone].text : 'text-ink-3')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-mark uppercase text-ink-3">{p.eyebrow}</span>
                  <span
                    className={cx(
                      'mt-1.5 block font-serif text-h3 tracking-tight transition-colors duration-300',
                      isOpen ? TONE[p.tone].text : 'text-ink',
                    )}
                  >
                    {p.title}
                  </span>
                </span>
                {/* 28px, up from 14px, by request -- and it carries more weight
                    now that it is the only thing marking the row as openable.
                    `leading-none` is what keeps the row height where it was:
                    the row is set by the title block at ~51.7px, and a 28px
                    glyph on the default 1.5 line box would have been 42px and
                    still under it, but the two are close enough that the line
                    height is worth pinning rather than leaving to the scale.
                    Rotation is about the centre, so the 45 degrees costs no
                    layout. */}
                <span
                  aria-hidden="true"
                  className={cx(
                    'shrink-0 font-sans text-[1.75rem] leading-none text-ink-3 transition-transform duration-500',
                    isOpen && 'rotate-45',
                  )}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-8 px-6 pb-9 md:grid-cols-12 md:gap-10 md:px-10 lg:px-14">
                      <p className="font-sans text-body leading-relaxed text-ink-2 md:col-span-5 md:col-start-3">
                        {p.copy}
                      </p>
                      <ul className="md:col-span-4">
                        {p.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 border-t border-ink/[0.08] py-2.5 font-sans text-ui text-ink-2 first:border-t-0 first:pt-0"
                          >
                            <span aria-hidden="true" className={cx('h-1 w-1 shrink-0 rounded-full', TONE[p.tone].bar)} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="md:col-span-3">
                        <Link
                          to={p.to}
                          className="group/roll group/cta inline-flex items-center gap-2 border-b border-ink pb-1 font-sans text-ui text-ink transition-colors hover:border-clay hover:text-clay"
                        >
                          <RollText>{p.cta}</RollText>
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </Slab>
  )
}
