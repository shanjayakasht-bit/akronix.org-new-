import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
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
 * list: one is expanded at a time, and the row you point at takes over. Same
 * four pillars, same copy -- a different shape, and it moves. */
export default function Ecosystem() {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(0)

  return (
    <Slab tone="sand">
      <Container>
        <SectionHead
          eyebrow="Our platform"
          title="The Akronix"
          accent="Ecosystem"
          sub="One platform. Four pillars of growth."
        />

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
                  onMouseEnter={() => setOpen(i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 px-5 py-7 text-left md:gap-8 md:px-8 md:py-8"
                >
                  <span
                    className={cx(
                      'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500',
                      isOpen ? TONE[p.tone].chip : 'bg-ink/[0.05] text-ink-3',
                    )}
                  >
                    {Glyph ? <Glyph className="h-5.5 w-5.5" /> : null}
                  </span>
                  <span className={cx('w-8 shrink-0 font-mono text-mark transition-colors duration-500', isOpen ? TONE[p.tone].text : 'text-ink-3')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-mark uppercase text-ink-3">{p.eyebrow}</span>
                    <span
                      className={cx(
                        'mt-1.5 block font-serif text-h3 tracking-tight transition-colors duration-300',
                        isOpen ? TONE[p.tone].text : 'text-ink',
                      )}
                    >
                      {p.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      'shrink-0 font-sans text-ui text-ink-3 transition-transform duration-500',
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
                      <div className="grid gap-8 px-5 pb-9 md:grid-cols-12 md:gap-10 md:px-8">
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
                            className="group/cta inline-flex items-center gap-2 border-b border-ink pb-1 font-sans text-ui text-ink transition-colors hover:border-clay hover:text-clay"
                          >
                            {p.cta}
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
      </Container>
    </Slab>
  )
}
