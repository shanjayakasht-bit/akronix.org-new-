import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
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
const SPRING = { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }

/* How long each slab stays open on its own, in ms. */
const DWELL = 5500

/* The matte palette (Step 7.6).
 *
 * The slabs were twelve saturated product colours side by side, which read as twelve
 * unrelated colourful sites. They are now one family: the six in development are dark
 * panels (charcoal, muted navy, and one deep muted purple), the six planned are light
 * ones (soft off-white and a neutral grey), and each product keeps its own identity
 * as a single desaturated accent -- its top rule, its stage dot and its stage word.
 * Light panels take a darker accent so the small stage word stays readable (each is at
 * least 4.5:1 on both light panel colours, measured -- the first choice of accents was
 * only 3.7-4.1:1 and was darkened); dark panels take a lighter one.
 *
 * This is local to the section on purpose: the products' own colours in
 * `content/products.js` (`accent`) are what /building, the menus and the cards use,
 * and they are unchanged. The class strings are literal so Tailwind sees them. */
const DARK = {
  crm: { panel: 'bg-ui-navy text-white', rule: 'bg-[#86a4e0]', ring: 'border-[#86a4e0]', text: 'text-[#86a4e0]' },
  hrms: { panel: 'bg-ui-charcoal text-white', rule: 'bg-[#8dbb9f]', ring: 'border-[#8dbb9f]', text: 'text-[#8dbb9f]' },
  erp: { panel: 'bg-ui-navy text-white', rule: 'bg-[#d49a78]', ring: 'border-[#d49a78]', text: 'text-[#d49a78]' },
  inventory: { panel: 'bg-ui-charcoal text-white', rule: 'bg-[#7fbdb8]', ring: 'border-[#7fbdb8]', text: 'text-[#7fbdb8]' },
  pos: { panel: 'bg-ui-navy text-white', rule: 'bg-[#d98ca0]', ring: 'border-[#d98ca0]', text: 'text-[#d98ca0]' },
  'ai-assistant': { panel: 'bg-[#241f3d] text-white', rule: 'bg-[#a99af2]', ring: 'border-[#a99af2]', text: 'text-[#a99af2]' },
}
const LIGHT = {
  attendance: { panel: 'bg-ui-cream text-ui-charcoal', rule: 'bg-[#2f6a8c]', ring: 'border-[#2f6a8c]', text: 'text-[#2f6a8c]' },
  'project-management': { panel: 'bg-[#e9e8e4] text-ui-charcoal', rule: 'bg-[#3c6f54]', ring: 'border-[#3c6f54]', text: 'text-[#3c6f54]' },
  books: { panel: 'bg-ui-cream text-ui-charcoal', rule: 'bg-[#865c17]', ring: 'border-[#865c17]', text: 'text-[#865c17]' },
  'e-commerce': { panel: 'bg-[#e9e8e4] text-ui-charcoal', rule: 'bg-[#8f3f60]', ring: 'border-[#8f3f60]', text: 'text-[#8f3f60]' },
  lms: { panel: 'bg-ui-cream text-ui-charcoal', rule: 'bg-[#6a4aa6]', ring: 'border-[#6a4aa6]', text: 'text-[#6a4aa6]' },
  helpdesk: { panel: 'bg-[#e9e8e4] text-ui-charcoal', rule: 'bg-[#566f1b]', ring: 'border-[#566f1b]', text: 'text-[#566f1b]' },
}
/* A product with no entry (one added later) falls back to the dark or light default,
   with a neutral accent, rather than to a saturated colour. */
const FALLBACK = {
  dark: { panel: 'bg-ui-charcoal text-white', rule: 'bg-ui-grey', ring: 'border-ui-grey', text: 'text-ui-grey' },
  light: { panel: 'bg-ui-cream text-ui-charcoal', rule: 'bg-ui-charcoal/40', ring: 'border-ui-charcoal/40', text: 'text-ui-charcoal/70' },
}
const lookOf = (p) => (p.building ? DARK[productSlug(p)] ?? FALLBACK.dark : LIGHT[productSlug(p)] ?? FALLBACK.light)

/* One delay per slab for the rise, so each waits for the one before it. A ladder
   of literal classes rather than a computed style, as in RollText: Tailwind only
   emits what it can see spelled out, and there is no inline CSS. */
const RISE_DELAY = [
  'delay-[0ms]', 'delay-[70ms]', 'delay-[140ms]', 'delay-[210ms]', 'delay-[280ms]', 'delay-[350ms]',
  'delay-[420ms]', 'delay-[490ms]', 'delay-[560ms]', 'delay-[630ms]', 'delay-[700ms]', 'delay-[770ms]',
]

/* "Our Premium Products" (Step 7 rebuild, then Step 7.1).
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
 * Step 7.1 (asked again, "more interesting"):
 *  - the slabs rise from the baseline one after another as the row comes into
 *    view, left to right, so the row arrives as a skyline rather than fading in;
 *  - it tours itself: the open slab changes every few seconds while the row is on
 *    screen, with a line running along its top edge to show the time left. A
 *    pointer or focus on the row holds it, there is a Pause control (an
 *    auto-moving thing needs one), and reduced motion turns it off;
 *  - the open slab is staged: the code's letters rise one by one, then the rows
 *    of what it is being built to do;
 *  - the legend became a rail under the row, spanning 01-06 and 07-12. Its two
 *    segments are on the same spring as the slabs, so each stays exactly under
 *    its own slabs as the width moves. It says the same thing the legend did:
 *    solid is in development, pale is planned. A dot that pulses marks a
 *    product in development (the work is active, not available);
 *  - the figure no longer runs under the name.
 *
 * A product in development is a SOLID slab; a planned one is pale, in its own
 * hue. The stage is always also written. The colour is the product's.
 *
 * Width is animated, not height, so nothing below is ever pushed (which is why
 * hovering is allowed to open one). The open slab's text is a block of fixed
 * width, sized from the row itself (`cqw`), so it never reflows while the width
 * moves. From `xl` down, where twelve slabs would be too thin to read, it is a
 * row of cards you swipe through. */
function Slab({ p, i, active, playing, entered, reduced, onOpen }) {
  const on = active === i
  const built = p.building
  const slug = productSlug(p)
  const body = built ? 'text-white' : 'text-ui-charcoal'
  const look = lookOf(p)

  /* The staging inside the open slab: nothing waits when it closes. */
  const stage = (delay) => ({ duration: reduced ? 0 : 0.7, ease: EASE, delay: on && !reduced ? delay : 0 })

  return (
    <motion.li
      animate={{ flexGrow: on ? 6 : 1 }}
      transition={SPRING}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen(i)}
      onFocusCapture={() => onOpen(i)}
      className="relative min-w-0 basis-0 overflow-hidden"
    >
      <Link
        to={`/contact?product=${slug}`}
        aria-label={`${p.name}, ${p.stage}. Request early access.`}
        className={cx(
          'group/roll absolute inset-0 block outline-offset-[-3px]',
          look.panel,
          on ? (built ? 'ring-1 ring-inset ring-white/15' : 'ring-1 ring-inset ring-ui-charcoal/10') : '',
          /* the rise from the baseline: the clip opens from the bottom edge up, once, when the row is first seen. A class swap on a transition, so a re-render can never replay it. Reduced motion has no entry. */
          reduced ? '' : cx('transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]', RISE_DELAY[i]),
          entered || reduced ? '[clip-path:inset(0)]' : '[clip-path:inset(100%_0_0_0)]',
        )}
      >
        {/* the product's own mark: a rule along the top edge, and over it, while the row is touring, the time left */}
        <span aria-hidden="true" className={cx('absolute inset-x-0 top-0 block h-0.5 transition-opacity duration-300', look.rule, on ? 'opacity-100' : 'opacity-70')} />
        {on && playing ? (
          <span aria-hidden="true" className={cx('akx-tour absolute inset-x-0 top-0 z-10 block h-1 origin-left', look.rule)} />
        ) : null}
        {/* hover on a shut slab: the panel lifts a shade */}
        <span aria-hidden="true" className={cx('pointer-events-none absolute inset-0 transition-opacity duration-300', built ? 'bg-white/[0.06]' : 'bg-ui-charcoal/[0.04]', on ? 'opacity-0' : 'opacity-0 group-hover/roll:opacity-100')} />

        {/* the figure, traced again as the slab opens; shown only on the open slab, and held to the upper right above the name so it never runs under the text */}
        <motion.span
          initial="rest"
          animate={on ? 'hover' : 'rest'}
          className={cx('pointer-events-none absolute inset-0 block transition-opacity duration-500', on ? 'opacity-100' : 'opacity-0')}
        >
          <CoverFigure className="absolute right-8 top-16 h-40 w-auto" />
        </motion.span>

        {/* shut: the index, the stage dot, the name standing up the slab */}
        <span
          className={cx(
            'absolute inset-x-0 top-0 flex flex-col items-center gap-3 pt-7 transition-opacity duration-300',
            on ? 'opacity-0' : 'opacity-100 delay-150',
          )}
        >
          <span className="tnum font-sans text-[0.75rem] font-medium opacity-75">{String(i + 1).padStart(2, '0')}</span>
          <span aria-hidden="true" className={cx('size-2 rounded-full', built ? cx(look.rule, 'motion-safe:animate-pulse') : cx('border', look.ring))} />
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
            <span className={cx('inline-flex items-center gap-2', look.text)}>
              <span aria-hidden="true" className={cx('size-2 rounded-full', built ? cx(look.rule, 'motion-safe:animate-pulse') : cx('border', look.ring))} />
              {p.stage}
            </span>
          </span>

          <span className="block">
            {/* the code: each letter climbs out of the baseline, one behind the next */}
            <span className="block overflow-hidden font-display text-[clamp(5rem,3rem+4vw,7.5rem)] font-light leading-none tracking-[-0.05em]">
              {[...p.code].map((ch, k) => (
                <motion.span
                  key={`${ch}-${k}`}
                  className="inline-block"
                  initial={false}
                  animate={{ y: on ? '0%' : '110%' }}
                  transition={stage(0.25 + k * 0.06)}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            <span className={cx('mt-5 block font-display text-h3', body)}>{p.name}</span>
            <span className={cx('mt-3 block max-w-[36ch] font-sans text-ui', built ? 'text-white/80' : 'text-ui-charcoal/75')}>{p.summary}</span>
            <span className={cx('mt-5 grid grid-cols-2 gap-x-5 border-t', built ? 'border-white/25' : 'border-ui-charcoal/15')}>
              {p.scope.map((s, k) => (
                <motion.span
                  key={s}
                  initial={false}
                  animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={stage(0.5 + k * 0.07)}
                  className={cx('border-b py-2 font-sans text-[0.8125rem] leading-snug', built ? 'border-white/25' : 'border-ui-charcoal/15', body)}
                >
                  {s}
                </motion.span>
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

/* The rail under the slabs: 01-06 in development, 07-12 planned.
 *
 * Each segment is a flex item on the same spring as the slabs and the same
 * 0.25rem gap, with a flex-basis of the five gaps inside its own group
 * (`basis-5`, 1.25rem). Between them that leaves exactly the free space the
 * slabs share, so a segment is as wide as its own six slabs and their gaps, and
 * stays under them while the width moves. The open slab is 6 shares and each
 * shut one is 1, so the group holding the open slab is 11 shares and the other
 * is 6. This relies on the first six products being the ones in development
 * (see products.js). */
function Rail({ active }) {
  const inBuilding = active < building.length
  const nBuilding = building.length
  const nPlanned = planned.length

  return (
    <ul className="mt-4 hidden gap-1 xl:flex">
      <motion.li animate={{ flexGrow: inBuilding ? 11 : 6 }} transition={SPRING} className="min-w-0 basis-5">
        <span aria-hidden="true" className="block h-3 bg-ink" />
        <span className="mt-3 block whitespace-nowrap font-sans text-ui text-ink-2">
          <span className="tnum text-ink">01 – {String(nBuilding).padStart(2, '0')}</span>
          <span className="ml-3">In development: a dark panel</span>
        </span>
      </motion.li>
      <motion.li animate={{ flexGrow: inBuilding ? 6 : 11 }} transition={SPRING} className="min-w-0 basis-5">
        <span aria-hidden="true" className="block h-3 border border-ink/50 bg-ink/10" />
        <span className="mt-3 block whitespace-nowrap font-sans text-ui text-ink-2">
          <span className="tnum text-ink">
            {String(nBuilding + 1).padStart(2, '0')} – {String(nBuilding + nPlanned).padStart(2, '0')}
          </span>
          <span className="ml-3">Planned: a light panel</span>
        </span>
      </motion.li>
    </ul>
  )
}

/* The swipe row for narrower screens. */
function Card({ p, i }) {
  const built = p.building
  const look = lookOf(p)
  return (
    <li className="w-[82vw] shrink-0 snap-center sm:w-[24rem]">
      <Link
        to={`/contact?product=${productSlug(p)}`}
        className="group/roll flex h-full flex-col overflow-hidden border border-rule bg-white"
      >
        <span className={cx('relative block h-44 overflow-hidden', look.panel)}>
          <span aria-hidden="true" className={cx('absolute inset-x-0 top-0 z-10 block h-0.5', look.rule)} />
          <CoverFigure className="absolute -bottom-14 -right-8 h-72 w-auto" />
          <span className="tnum absolute left-6 top-5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] opacity-80">
            {String(i + 1).padStart(2, '0')} / 12
          </span>
          <span className="absolute bottom-5 left-6 block font-display text-[4rem] font-light leading-none tracking-[-0.05em]">{p.code}</span>
        </span>
        <span className="flex flex-1 flex-col p-6">
          <span className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink">
            <span aria-hidden="true" className={cx('size-2 rounded-full', built ? cx(look.rule, 'motion-safe:animate-pulse') : cx('border', look.ring))} />
            <span className={look.text}>{p.stage}</span>
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
  const rowRef = useRef(null)
  const onScreen = useInView(rowRef, { margin: '-15% 0px' })
  const entered = useInView(rowRef, { once: true, margin: '-8% 0px' })
  const [active, setActive] = useState(0)
  /* held: a pointer or focus is on the row. paused: the visitor pressed Pause. */
  const [held, setHeld] = useState(false)
  const [paused, setPaused] = useState(false)
  const playing = !reduced && onScreen && !held && !paused

  /* One timer per slab: it is set when a slab opens (or the tour resumes) and
     cleared the moment anything holds the row. */
  useEffect(() => {
    if (!playing) return undefined
    const t = setTimeout(() => setActive((a) => (a + 1) % products.length), DWELL)
    return () => clearTimeout(t)
  }, [playing, active])

  return (
    <Band tone="light" pad="md">
      <Container wide>
        <SectionIntro
          eyebrow="White-label SaaS"
          index="02"
          title="Products designed for"
          accent="real business challenges."
          titleClass="text-h2"
          sub="Twelve white-label products for core business operations. None has shipped: this is where each one stands, and how to ask for early access."
          actions={<Button to="/building">View All Products</Button>}
        />

        <ul className="mt-12 grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-3">
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
        <ul
          ref={rowRef}
          className="@container mt-10 hidden h-[34rem] gap-1 xl:flex"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          {products.map((p, i) => (
            <Slab key={p.name} p={p} i={i} active={active} playing={playing} entered={entered} reduced={reduced} onOpen={setActive} />
          ))}
        </ul>

        <Rail active={active} />

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
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 xl:hidden">
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-3 w-8 bg-ink" />
              In development: a dark panel
            </li>
            <li className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-3 w-8 border border-ink/50 bg-ink/10" />
              Planned: a light panel
            </li>
          </ul>
          {/* the tour moves by itself, so it can be stopped */}
          {reduced ? null : (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="group/roll hidden items-center gap-3 font-sans text-ui font-medium text-ink xl:inline-flex"
            >
              <RollText>{paused ? 'Resume the tour' : 'Pause the tour'}</RollText>
            </button>
          )}
          <p className="max-w-[48ch] text-ink-3">Each one opens the contact form with that product chosen: a request for early access, not a purchase.</p>
        </div>
      </Container>
    </Band>
  )
}
