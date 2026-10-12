import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Button } from '../ui/Button'
import { Arrow } from '../ui/Arrow'
import { RollText } from '../ui/RollText'
import { SectionIntro } from './SectionHead'
import { CoverFigure } from '../brand/CoverFigure'
import { Counter } from '../motion/Counter'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { building, planned, products, productSlug } from '../../content/products'

const EASE = [0.16, 1, 0.3, 1]

/* "Our Premium Products" (Step 7 rebuild).
 *
 * It was a black matrix of twelve cells. The client asked for it to be more
 * interesting, so it is now a showcase: twelve upright slabs in their twelve
 * colours, side by side. One is open at a time and it is wide; moving to
 * another hands the width over on a spring, and as a slab opens the Akronix
 * figure behind its code is traced again. The open slab shows what a card on the
 * products page shows -- the code set very large, the name, what it is for, what
 * it is being built to do -- and the whole slab is a link to the contact form
 * with that product chosen, as a request for EARLY ACCESS. Nothing here says or
 * implies a product can be bought.
 *
 * A product in development is a SOLID slab; a planned one is pale, in its own
 * hue. The stage is always also written. The colour is the product's.
 *
 * Width is animated, not height, so nothing below is ever pushed (which is why
 * hovering is allowed to open one). The open slab's text is a block of fixed
 * width, sized from the row itself (`cqw`), so it never reflows while the width
 * moves. From `xl` down, where twelve slabs would be too thin to read, it is a
 * row of cards you swipe through. */
function Slab({ p, i, active, onOpen }) {
  const on = active === i
  const built = p.building
  const slug = productSlug(p)
  const body = built ? 'text-white' : 'text-ink'

  return (
    <motion.li
      animate={{ flexGrow: on ? 6 : 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen(i)}
      onFocusCapture={() => onOpen(i)}
      className="relative min-w-0 basis-0 overflow-hidden"
    >
      <Link
        to={`/contact?product=${slug}`}
        aria-label={`${p.name}, ${p.stage}. Request early access.`}
        className={cx('group/roll absolute inset-0 block outline-offset-[-3px]', built ? cx(p.accent.bar, 'text-white') : cx(p.accent.chip))}
      >
        {/* the figure, traced again as the slab opens; shown only on the open slab, and held to the upper right so it never runs under the text */}
        <motion.span
          initial="rest"
          animate={on ? 'hover' : 'rest'}
          className={cx('pointer-events-none absolute inset-0 block transition-opacity duration-500', on ? 'opacity-100' : 'opacity-0')}
        >
          <CoverFigure className="absolute right-6 top-16 h-56 w-auto" />
        </motion.span>

        {/* shut: the index, the stage dot, the name standing up the slab */}
        <span
          className={cx(
            'absolute inset-x-0 top-0 flex flex-col items-center gap-3 pt-7 transition-opacity duration-300',
            on ? 'opacity-0' : 'opacity-100 delay-150',
          )}
        >
          <span className="tnum font-sans text-[0.75rem] font-medium">{String(i + 1).padStart(2, '0')}</span>
          <span aria-hidden="true" className={cx('size-2 rounded-full', built ? 'bg-white' : cx('border', p.accent.border))} />
        </span>
        <span
          aria-hidden="true"
          className={cx(
            'absolute bottom-7 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap font-display text-[1.375rem] [writing-mode:vertical-rl] transition-opacity duration-300',
            on ? 'opacity-0' : 'opacity-100 delay-150',
          )}
        >
          {p.name.replace('Akronix ', '')}
        </span>

        {/* open: a block of fixed width, so it never reflows while the slab does */}
        <span
          className={cx(
            'absolute inset-y-0 left-0 flex w-[calc(35cqw-1rem)] flex-col justify-between p-8 transition-all duration-500',
            on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-4 opacity-0',
          )}
        >
          <span className="flex items-center justify-between gap-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
            <span className="tnum">{String(i + 1).padStart(2, '0')} / 12</span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className={cx('size-2 rounded-full', built ? 'bg-white' : cx('border', p.accent.border))} />
              {p.stage}
            </span>
          </span>

          <span className="block">
            <span className="block font-display text-[clamp(5rem,3rem+4vw,7.5rem)] font-light leading-none tracking-[-0.05em]">{p.code}</span>
            <span className={cx('mt-5 block font-display text-h3', body)}>{p.name}</span>
            <span className={cx('mt-3 block max-w-[36ch] font-sans text-ui', built ? 'text-white/85' : 'text-ink-2')}>{p.summary}</span>
            <span className={cx('mt-5 grid grid-cols-2 gap-x-5 border-t', built ? 'border-white/30' : 'border-ink/20')}>
              {p.scope.map((s) => (
                <span key={s} className={cx('border-b py-2 font-sans text-[0.8125rem] leading-snug', built ? 'border-white/30' : 'border-ink/20', body)}>
                  {s}
                </span>
              ))}
            </span>
            <span className={cx('mt-6 inline-flex items-center gap-3 font-sans text-ui font-medium', body)}>
              <RollText>Request early access</RollText>
              <Arrow className="transition-transform duration-300 group-hover/roll:translate-x-1" />
            </span>
          </span>
        </span>
      </Link>
    </motion.li>
  )
}

/* The swipe row for narrower screens. */
function Card({ p, i }) {
  const built = p.building
  return (
    <li className="w-[82vw] shrink-0 snap-center sm:w-[24rem]">
      <Link
        to={`/contact?product=${productSlug(p)}`}
        className="group/roll flex h-full flex-col overflow-hidden border border-rule bg-white"
      >
        <span className={cx('relative block h-44 overflow-hidden', built ? cx(p.accent.bar, 'text-white') : p.accent.chip)}>
          <CoverFigure className="absolute -bottom-14 -right-8 h-72 w-auto" />
          <span className="tnum absolute left-6 top-5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] opacity-80">
            {String(i + 1).padStart(2, '0')} / 12
          </span>
          <span className="absolute bottom-5 left-6 block font-display text-[4rem] font-light leading-none tracking-[-0.05em]">{p.code}</span>
        </span>
        <span className="flex flex-1 flex-col p-6">
          <span className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink">
            <span aria-hidden="true" className={cx('size-2 rounded-full', built ? p.accent.dot : cx('border', p.accent.border))} />
            {p.stage}
          </span>
          <span className="mt-3 block font-display text-h3 text-ink">{p.name}</span>
          <span className="mt-2 block font-sans text-ui text-ink-2">{p.line}</span>
          <span className="mt-auto inline-flex items-center gap-3 pt-6 font-sans text-ui font-medium text-ink">
            <RollText>Request early access</RollText>
            <Arrow className="transition-transform duration-300 group-hover/roll:translate-x-1" />
          </span>
        </span>
      </Link>
    </li>
  )
}

export default function Showcase() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)

  return (
    <Band tone="light">
      <Container wide>
        <SectionIntro
          eyebrow="White-label SaaS"
          index="02"
          title="Our premium"
          accent="products."
          sub="White-label products to simplify your business operations. None has shipped. Here is where each of the twelve stands, and a way to ask for early access to any of them."
          actions={<Button to="/building">View All Products</Button>}
        />

        <ul className="mt-14 grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-3">
          {[
            { n: products.length, label: 'products on the roadmap' },
            { n: building.length, label: 'in development today' },
            { n: planned.length, label: 'planned, not started' },
          ].map((s) => (
            <li key={s.label} className="flex items-baseline gap-4">
              <span className="font-display text-h1 font-light leading-none tracking-[-0.04em] text-ink">
                <Counter to={s.n} />
              </span>
              <span className="font-sans text-ui text-ink-2">{s.label}</span>
            </li>
          ))}
        </ul>

        {/* the slabs */}
        <motion.ul
          className="@container mt-10 hidden h-[34rem] gap-1 xl:flex"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 1, ease: EASE }}
        >
          {products.map((p, i) => (
            <Slab key={p.name} p={p} i={i} active={active} onOpen={setActive} />
          ))}
        </motion.ul>

        {/* the swipe row. `relative` is what keeps it from widening the page: every
            label on a card carries a visually-hidden (position: absolute) copy of
            its text for screen readers, and with no positioned ancestor inside the
            row those copies take the section as their containing block, escape the
            row's clipping and sit at the far end of the scroll -- three thousand
            pixels of sideways scroll on the whole page. */}
        <ul className="relative -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 xl:hidden">
          {products.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 font-sans text-ui text-ink-2">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-3 w-8 bg-ink" />
              In development: a solid colour
            </li>
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-3 w-8 border border-ink/50 bg-ink/10" />
              Planned: the same colour, pale
            </li>
          </ul>
          <p className="max-w-[48ch] text-ink-3">Each one opens the contact form with that product chosen: a request for early access, not a purchase.</p>
        </div>
      </Container>
    </Band>
  )
}
