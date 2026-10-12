import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Arrow } from '../ui/Arrow'
import { RollText } from '../ui/RollText'
import { SectionIntro } from '../sections/SectionHead'
import { CoverFigure } from '../brand/CoverFigure'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { products, productSlug } from '../../content/products'
import { buildingIndex } from '../../content/building'

const EASE = [0.16, 1, 0.3, 1]

/* The portfolio: twelve products behind two filters and a choice of view.
 *
 * Category is the live products page's own filter (All, CRM, HR & Workforce,
 * Operations, Finance, Education, Retail, AI & Automation, with the live page's
 * counts). Stage is added: All, In development, Planned. Both are live counts --
 * what each choice would leave -- and a choice that would leave none is
 * disabled, so the list is never empty. The active choice is a black block that
 * SLIDES from chip to chip (a shared layout element, `layoutId`); when a filter
 * changes the cards that go fade and shrink, the ones that stay glide to their
 * new places and the ones that arrive rise in.
 *
 * Two views of the same twelve: CARDS (the product card an enterprise buyer
 * expects -- a coloured app tile, the name, what it is for, what it is being
 * built to do) and LIST (a ruled table, for comparing). The views swap with a
 * short fade; the filters apply to both.
 *
 * Step 7 reworked the card. The first version of this page (Step 6.1) gave each
 * card a large saturated cover with the code set huge -- vivid, but it read as a
 * portfolio piece rather than as a product. The cover is now a 56px app tile in
 * the product's colour (solid for a product being built, pale for a planned one),
 * on a plain white card; the colour also runs as a bar along the top and the
 * figure of the Akronix mark sits very faintly in the corner, drawn again on hover.
 *
 * A card is a link. Anywhere on it opens the contact form with that product
 * chosen, as a request for EARLY ACCESS -- never a purchase. Nothing on a card
 * says or implies a product can be bought: the stage is written in it. */
const CATS = ['All', 'CRM', 'HR & Workforce', 'Operations', 'Finance', 'Education', 'Retail', 'AI & Automation']
const STAGES = [
  { key: 'all', label: 'All stages' },
  { key: 'building', label: 'In development' },
  { key: 'planned', label: 'Planned' },
]
const VIEWS = [
  { key: 'cards', label: 'Cards' },
  { key: 'list', label: 'List' },
]

const matchStage = (p, stage) => stage === 'all' || (stage === 'building' ? p.building : !p.building)
const matchCat = (p, cat) => cat === 'All' || p.category === cat

export function matches(p, cat, stage) {
  return matchCat(p, cat) && matchStage(p, stage)
}

/* A choice in a filter. The black block behind the active one is shared between
   the chips of its row (`pill`), so it travels. */
function Choice({ active, disabled, onClick, pill, count, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cx(
        'group/roll relative border px-4 py-2.5 font-sans text-ui font-medium transition-colors duration-300',
        active ? 'border-ink text-white' : 'border-rule text-ink',
        disabled ? 'cursor-not-allowed opacity-35' : !active && 'hover:border-ink',
      )}
    >
      {active ? (
        <motion.span
          layoutId={pill}
          aria-hidden="true"
          className="absolute inset-0 bg-ink"
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        />
      ) : null}
      <span className="relative inline-flex items-baseline gap-2">
        <RollText>{children}</RollText>
        {count != null ? <span className={cx('tnum text-[0.6875rem]', active ? 'text-white/60' : 'text-ink-3')}>{count}</span> : null}
      </span>
    </button>
  )
}

/* A number that rolls to its new value. */
function Roll({ value }) {
  return (
    <span className="relative inline-flex h-[1.5em] w-[2ch] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="tnum absolute inset-0 text-center"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* The product's tile: solid colour and white letters for a product being built;
   its pale tint, its own hue for the letters and a hairline for a planned one. */
function Tile({ p, className }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center font-display text-[1.0625rem] font-medium tracking-[0.04em]',
        p.building ? cx(p.accent.bar, 'text-white') : cx(p.accent.chip, 'border', p.accent.border),
        className ?? 'size-14',
      )}
    >
      <RollText>{p.code}</RollText>
    </span>
  )
}

function Stage({ p }) {
  return (
    <span className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink">
      <span aria-hidden="true" className={cx('size-2 rounded-full', p.building ? p.accent.dot : cx('border', p.accent.border))} />
      {p.stage}
    </span>
  )
}

function Tick({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeWidth="2" strokeLinecap="square" stroke="currentColor" aria-hidden="true" className={cx('mt-[3px] h-3.5 w-3.5 shrink-0', className)}>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  )
}

function Card({ p, index, flash, reduced }) {
  const slug = productSlug(p)

  /* The faint figure in the corner drifts with the pointer, a few pixels on a
     spring. Mouse only. */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const fx = useSpring(mx, { stiffness: 110, damping: 16 })
  const fy = useSpring(my, { stiffness: 110, damping: 16 })
  const move = (e) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * -22)
    my.set(((e.clientY - r.top) / r.height - 0.5) * -14)
  }
  const rest = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.li
      layout="position"
      initial={reduced ? false : { opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
      transition={{
        layout: { duration: 0.65, ease: EASE },
        default: { duration: 0.8, ease: EASE, delay: (index % 3) * 0.08 },
      }}
      className="relative"
    >
      <motion.article
        id={slug}
        initial="rest"
        animate="rest"
        whileHover="hover"
        onPointerMove={move}
        onPointerLeave={rest}
        className="group/roll group relative flex h-full scroll-mt-32 flex-col overflow-hidden border border-rule bg-white transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-ink hover:shadow-[0_32px_60px_-32px_rgba(11,12,15,0.4)] has-[a:focus-visible]:border-ink has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-brand"
      >
        {/* the colour, along the top; fainter for a planned product */}
        <span aria-hidden="true" className={cx('absolute inset-x-0 top-0 h-[4px]', p.building ? p.accent.bar : p.accent.soft)} />

        {/* the figure, very faint, in the corner */}
        <motion.div
          aria-hidden="true"
          style={reduced ? undefined : { x: fx, y: fy }}
          className={cx('pointer-events-none absolute -right-10 -top-4 h-56 w-auto opacity-[0.16]', p.accent.text)}
        >
          <CoverFigure className="h-full w-auto" />
        </motion.div>

        <div className="relative flex flex-1 flex-col p-7 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <Tile p={p} />
            <Stage p={p} />
          </div>

          <p className="mt-8 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-3">{p.category}</p>
          <h3 className="mt-2 font-display text-h3 text-ink">{p.name}</h3>
          <p className="mt-2 font-sans text-ui font-medium text-ink">{p.line}</p>
          <p className="mt-3 font-sans text-ui text-ink-2">{p.summary}</p>

          <p className="mt-7 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-3">Being built to do</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-5 border-t border-rule">
            {p.scope.map((item) => (
              <li key={item} className="flex items-start gap-2.5 border-b border-rule py-2.5 font-sans text-[0.8125rem] leading-snug text-ink">
                <Tick className={p.accent.text} />
                {item}
              </li>
            ))}
          </ul>

          {/* The whole card is this link: `after` stretches it over the card. */}
          <Link
            to={`/contact?product=${slug}`}
            className="mt-auto inline-flex items-center gap-3 pt-8 font-sans text-ui font-medium text-ink outline-none after:absolute after:inset-0 after:content-['']"
          >
            <RollText>Request early access</RollText>
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* the colour, drawn thicker along the foot on hover */}
        <span
          aria-hidden="true"
          className={cx(
            'absolute inset-x-0 bottom-0 h-[4px] origin-left scale-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100',
            p.accent.bar,
          )}
        />
      </motion.article>

      {/* When a link elsewhere on the page points at this card, it flashes. */}
      <AnimatePresence>
        {flash ? (
          <motion.span
            key="ping"
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1.5 border-2 border-brand"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.985, 1, 1, 1.03] }}
            transition={{ duration: 2.2, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>
    </motion.li>
  )
}

/* The list view: the same twelve as a ruled table. */
const COLS = 'md:grid-cols-[3.5rem_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,2fr)_1.5rem]'

function Row({ p, index, flash, reduced }) {
  const slug = productSlug(p)
  return (
    <motion.li
      layout="position"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-4% 0px' }}
      exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
      transition={{ layout: { duration: 0.6, ease: EASE }, default: { duration: 0.6, ease: EASE, delay: index * 0.03 } }}
      className="relative border-b border-rule"
    >
      <Link
        id={slug}
        to={`/contact?product=${slug}`}
        className={cx(
          'group/roll group relative grid scroll-mt-32 items-center gap-x-6 gap-y-2 px-1 py-5 transition-[background-color,padding] duration-500 hover:bg-mist md:px-0 md:py-4 md:hover:pl-3',
          COLS,
        )}
      >
        <span aria-hidden="true" className={cx('absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100', p.accent.bar)} />
        <Tile p={p} className="size-11 text-[0.8125rem]" />
        <span className="font-display text-h3 text-ink">{p.name}</span>
        <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-3">{p.category}</span>
        <Stage p={p} />
        <span className="font-sans text-ui text-ink-2">{p.scope.join(' · ')}</span>
        <Arrow className="hidden h-5 w-5 -rotate-45 text-ink-3 transition-all duration-300 group-hover:text-brand md:block" />
        {flash ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-2 border-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, times: [0, 0.15, 0.7, 1] }}
          />
        ) : null}
      </Link>
    </motion.li>
  )
}

export default function Portfolio({ cat, setCat, stage, setStage, flash }) {
  const reduced = usePrefersReducedMotion()
  const [view, setView] = useState('cards')
  const shown = products.filter((p) => matches(p, cat, stage))

  /* Counts are what each choice would leave given the OTHER filter. */
  const catCount = (c) => products.filter((p) => matches(p, c, stage)).length
  const stageCount = (s) => products.filter((p) => matches(p, cat, s)).length

  return (
    <Band tone="light" pad="md" id="portfolio" className="scroll-mt-24">
      <Container wide>
        <SectionIntro
          eyebrow={buildingIndex.eyebrow}
          index="01"
          title={buildingIndex.title}
          accent={buildingIndex.accent}
          sub={buildingIndex.sub}
        />

        <LayoutGroup id="portfolio">
          <div className="mt-16 flex flex-col gap-8 border-b border-rule pb-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="font-sans text-mark font-medium uppercase text-ink-3">Category</p>
              <div role="group" aria-label="Filter by category" className="mt-3 flex flex-wrap gap-2">
                {CATS.map((c) => {
                  const n = catCount(c)
                  const active = cat === c
                  return (
                    <Choice key={c} pill="cat-pill" active={active} disabled={n === 0 && !active} count={n} onClick={() => setCat(c)}>
                      {c}
                    </Choice>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-6">
              <div>
                <p className="font-sans text-mark font-medium uppercase text-ink-3">Stage</p>
                <div role="group" aria-label="Filter by stage" className="mt-3 flex flex-wrap gap-2">
                  {STAGES.map((s) => {
                    const n = stageCount(s.key)
                    const active = stage === s.key
                    return (
                      <Choice key={s.key} pill="stage-pill" active={active} disabled={n === 0 && !active} count={n} onClick={() => setStage(s.key)}>
                        {s.label}
                      </Choice>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="font-sans text-mark font-medium uppercase text-ink-3">View</p>
                <div role="group" aria-label="Choose a view" className="mt-3 flex gap-2">
                  {VIEWS.map((v) => (
                    <Choice key={v.key} pill="view-pill" active={view === v.key} onClick={() => setView(v.key)}>
                      {v.label}
                    </Choice>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p aria-live="polite" className="mt-6 flex items-center gap-2 font-sans text-ui text-ink-2">
            Showing <Roll value={shown.length} /> of {String(products.length).padStart(2, '0')} products
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {view === 'cards' ? (
              <motion.div
                key="cards"
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <ul className="relative mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {shown.map((p, i) => (
                      <Card key={p.name} p={p} index={i} flash={flash === productSlug(p)} reduced={reduced} />
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div
                  aria-hidden="true"
                  className={cx(
                    'mt-8 hidden gap-x-6 border-b border-ink pb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-3 md:grid',
                    COLS,
                  )}
                >
                  <span />
                  <span>Product</span>
                  <span>Category</span>
                  <span>Stage</span>
                  <span>Being built to do</span>
                  <span />
                </div>
                <ul className="relative mt-4 md:mt-0">
                  <AnimatePresence mode="popLayout">
                    {shown.map((p, i) => (
                      <Row key={p.name} p={p} index={i} flash={flash === productSlug(p)} reduced={reduced} />
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        <p className="mt-12 max-w-[64ch] font-sans text-ui text-ink-3">
          Every card and row opens the contact form with that product chosen. It is a request for early access, not a purchase: none of the twelve has shipped.
        </p>
      </Container>
    </Band>
  )
}
