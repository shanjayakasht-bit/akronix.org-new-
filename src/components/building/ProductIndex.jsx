import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { RollText } from '../ui/RollText'
import { Slab } from '../ui/Slab'
import SectionHead from '../sections/SectionHead'
import * as Glyphs from '../brand/Glyphs'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { useScrollToId } from '../../lib/useScrollToId'
import { Pill } from '../ui/Pill'
import { building, planned, products, productShort, productSlug } from '../../content/products'
import { buildingIndex } from '../../content/building'

const EASE = [0.16, 1, 0.3, 1]

/* All twelve at length, on the forest slab -- the colour the products already own
 * on the homepage, so the two pages agree on where products live.
 *
 * Deliberately not the homepage's 3x2 card grid, and not the Ecosystem
 * accordion either: a sticky numbered index on the left, the entries running
 * past it on the right. The index marks the entry being read and jumps to any
 * other. It is a long page, and this is what keeps the reader placed in it.
 *
 * The cards are the homepage product card at full length -- same border, same
 * translucent fill, same glyph chip and stage tag -- so a card read on its own
 * still carries its stage. The scope list is labelled as what the product is
 * being BUILT to do. None of it works yet, and the label must say so.
 *
 * Twelve, in two groups: the six being built, then the six planned. Both the
 * index and the entries carry the split, so the stage reads from the layout as
 * well as from each card's tag. Numbering runs 01-12 across both.
 *
 * The slab is `clip`, not the default: `overflow-hidden` would make it a
 * scroll container and the index would never stick. See `Slab`. */
function Entry({ product, index, onRead }) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  /* A band across the middle of the screen: the entry crossing it is the one
     being read. Narrow, so exactly one entry is in it at a time. */
  const reading = useInView(ref, { margin: '-45% 0px -50% 0px' })
  useEffect(() => {
    if (reading) onRead(index)
  }, [reading, index, onRead])

  /* The whole card arrives, and nothing inside it does (Step 4.5, client's
     call: animating the text inside a card was ruled out). Scrubbed by
     scroll, like the slabs: the card starts its run as its top edge enters
     the bottom of the screen and has settled by the time that edge is 60% of
     the way up. On the way it rises 96px, grows from 92% and swings forward
     out of a 12 degree tilt about its top edge, fading in over the first
     half. Scroll back and it runs in reverse.

     `useScroll` measures the untransformed wrapper, never the card: measuring
     the thing being moved would feed the motion back into its own driver --
     the same rule `Slab` keeps. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.4'] })
  const eased = useTransform(scrollYProgress, (v) => 1 - (1 - v) ** 3)
  const y = useTransform(eased, [0, 1], [96, 0])
  const scale = useTransform(eased, [0, 1], [0.92, 1])
  const rotateX = useTransform(eased, [0, 1], [12, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  const Glyph = Glyphs[product.glyph]

  return (
    <div ref={ref} id={productSlug(product)} className="[perspective:1400px]">
    <motion.article
      style={reduced ? undefined : { y, scale, rotateX, opacity }}
      className="group origin-top rounded-[1.75rem] border border-paper/12 bg-paper/4 p-7 transition-colors duration-500 hover:border-paper/30 hover:bg-paper/8 md:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper/80 transition-colors duration-500 group-hover:bg-clay-soft group-hover:text-paper">
            {Glyph ? <Glyph className="h-5 w-5" /> : null}
          </span>
          <span className="font-sans text-mark text-paper/45">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <span className="rounded-full border border-paper/20 px-3 py-1 font-sans text-mark uppercase text-paper/50">
          {product.stage}
        </span>
      </div>

      <p className="mt-8 font-sans text-mark uppercase tracking-[0.16em] text-paper/45">{product.category}</p>
      <h3 className="mt-2.5 font-serif text-h2 tracking-tight text-paper">{product.name}</h3>
      <p className="mt-4 max-w-[52ch] font-sans text-body leading-relaxed text-paper/60">{product.summary}</p>

      {/* The label sits beside the list only from `xl`. Beside it at `lg`,
          where the card shares the row with the index, it took a third of a
          ~540px card and "Inventory management" broke onto two lines. */}
      <div className="mt-9 grid gap-4 border-t border-paper/10 pt-7 xl:grid-cols-12 xl:gap-6">
        <p className="font-sans text-mark uppercase tracking-[0.16em] text-paper/45 xl:col-span-4">
          Being built to do
        </p>
        <ul className="grid gap-x-6 sm:grid-cols-2 xl:col-span-8">
          {product.scope.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 border-t border-paper/[0.08] py-2.5 font-sans text-ui text-paper/70 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
            >
              <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-clay-soft" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
    </div>
  )
}

const GROUPS = [
  { key: 'building', items: building },
  { key: 'planned', items: planned },
]

export default function ProductIndex() {
  const reduced = usePrefersReducedMotion()
  const scrollTo = useScrollToId()
  const [reading, setReading] = useState(0)

  return (
    <Slab tone="forest" clip anchor="top" id="products">
      <Container wide>
        <SectionHead
          eyebrow={buildingIndex.eyebrow}
          title={buildingIndex.title}
          accent={buildingIndex.accent}
          sub={buildingIndex.sub}
          onDark
          className="mx-auto text-center"
        />

        <div className="mt-14 grid gap-4 md:mt-18 lg:grid-cols-12 lg:gap-5">
          {/* Desktop only. On a phone the hero's row of names is the index,
              and a sticky column has no side to sit on.

              Twelve rows have to fit under the nav on a 768px-tall screen, so
              the names are a size down from the six-row version and the rows
              are tighter: ~44px each plus two group labels is ~620px, under
              the ~650px there is below `top-28`. */}
          <nav aria-label="All twelve products" className="hidden lg:col-span-4 lg:block">
            <motion.div
              className="sticky top-28"
              initial={reduced ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              {GROUPS.map((g, gi) => (
                <div key={g.key} className={cx(gi > 0 && 'mt-6')}>
                  <p className="pb-3 font-sans text-mark uppercase tracking-[0.16em] text-paper/45">
                    {buildingIndex.groups[g.key]}
                  </p>
                  <ol>
                    {g.items.map((p) => {
                      const i = products.indexOf(p)
                      const id = productSlug(p)
                      const on = reading === i
                      return (
                        <li key={p.name} className="border-t border-paper/12 last:border-b">
                          <a
                            href={`#${id}`}
                            onClick={(e) => scrollTo(e, id)}
                            aria-current={on ? 'true' : undefined}
                            className="group/roll flex items-center gap-4 py-2.5 pr-2"
                          >
                            <span
                              className={cx(
                                'w-8 shrink-0 font-sans text-mark transition-colors duration-500',
                                on ? 'text-clay-soft' : 'text-paper/35',
                              )}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={cx(
                                'min-w-0 flex-1 font-serif text-xl tracking-tight transition-colors duration-500',
                                on ? 'text-paper' : 'text-paper/40 group-hover/roll:text-paper/70',
                              )}
                            >
                              <RollText>{productShort(p)}</RollText>
                            </span>
                            <span
                              aria-hidden="true"
                              className={cx(
                                'size-1.5 shrink-0 rounded-full bg-clay-soft transition-opacity duration-500',
                                on ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </a>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              ))}
            </motion.div>
          </nav>

          <div className="lg:col-span-8">
            {GROUPS.map((g, gi) => (
              <div key={g.key} className={cx(gi > 0 && 'mt-14 md:mt-18')}>
                {/* The group's own label beside the cards, so a phone -- which
                    has no index -- still sees where "Planned" begins. */}
                <Pill tone="onDark">{buildingIndex.groups[g.key]}</Pill>
                <div className="mt-6 space-y-4 lg:space-y-5">
                  {g.items.map((p) => (
                    <Entry key={p.name} product={p} index={products.indexOf(p)} onRead={setReading} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Slab>
  )
}
