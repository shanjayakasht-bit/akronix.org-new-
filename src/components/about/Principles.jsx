import { useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { SectionIntro } from '../sections/SectionHead'
import { cx } from '../../lib/cx'
import { play } from '../../lib/sound'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { principles } from '../../content/about'
import { ART } from './PrincipleArt'

/* Five working principles as a stack of sheets.
 *
 * Each sheet sticks near the top as the next one slides up over it, so they pile
 * like papers on a desk; the ones underneath ease back (a little smaller, a
 * little darker) as they are covered. The effect is driven by the scroll through
 * the whole stack, so the pile builds as you read and unbuilds going back. The
 * tops are a ladder of literal classes because Tailwind has to see them spelled
 * out, and each is a little lower than the one before so a strip of every buried
 * sheet stays visible.
 *
 * The red bar down a sheet's left edge fills from the top as that sheet's turn
 * comes, and stays filled once it has been read: a progress mark for the stack.
 * With sound on, each time a new sheet takes the top there is the whisper of
 * paper sliding over paper (Step 7).
 *
 * Step 7.2 (client: "I love this card animation and card size, don't change it;
 * make the cards more interesting and more unique"): the pile, the scale, the
 * shade, the red bar and the sound are exactly as they were, and so is each sheet's
 * size. What changed is what is on a sheet. Each carries a small diagram of its
 * own principle (`PrincipleArt`), drawn as the sheet's turn comes, in the space
 * that was empty to the right of the copy; and the third sheet is black, so the
 * pile has a dark leaf in it and the five do not read as one repeated card. The
 * numeral column is narrower to make room, which moves the copy left and leaves
 * its wrap unchanged.
 *
 * The id `how` is what the footer's "How We Work" and the Long-Term Partnership
 * row link to. */
const TOP = ['top-28', 'top-[8.25rem]', 'top-[9.5rem]', 'top-[10.75rem]', 'top-[12rem]']
const PAPER = ['bg-mist', 'bg-white', 'bg-coal', 'bg-white', 'bg-mist']
const DARK = [false, false, true, false, false]

function Sheet({ item, index, count, progress, reduced }) {
  /* A sheet eases back and darkens once the next one starts to come over it, so
     the one on top -- the last, and whichever is being read -- stays at full size
     and full brightness. */
  const last = index === count - 1
  const at = index / count
  const nxt = (index + 1) / count
  const scale = useTransform(progress, [Math.max(0, nxt - 0.1), 1], [1, 1 - (count - 1 - index) * 0.018])
  const shade = useTransform(progress, [Math.max(0, nxt - 0.1), Math.min(1, nxt + 0.12)], [0, 0.07])
  const fill = useTransform(progress, [at, Math.min(1, at + 1 / count)], [0, 1])

  /* The diagram follows the same turn as the red bar. Held complete when motion
     is reduced. */
  const done = useMotionValue(1)
  const dark = DARK[index]
  const Art = ART[index]

  return (
    <motion.li style={reduced || last ? undefined : { scale }} className={cx('sticky origin-top', TOP[index])}>
      <div className={cx('relative overflow-hidden border p-8 md:p-12', dark ? 'border-white/10' : 'border-rule', PAPER[index])}>
        {!reduced && !last ? <motion.span aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" /> : null}
        <span aria-hidden="true" className={cx('absolute inset-y-0 left-0 w-[3px]', dark ? 'bg-white/15' : 'bg-ink/10')} />
        <motion.span
          aria-hidden="true"
          style={reduced ? undefined : { scaleY: fill }}
          className="absolute inset-y-0 left-0 w-[3px] origin-top bg-brand"
        />
        <div className="relative grid gap-6 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-x-10 xl:grid-cols-[8rem_minmax(0,1fr)_17rem] wide:grid-cols-[11rem_minmax(0,1fr)_clamp(18rem,22vw,21rem)]">
          <span className={cx('tnum font-display text-[5rem] font-light leading-none tracking-[-0.05em]', dark ? 'text-white' : 'text-ink', 'md:text-[7rem]')}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className={cx('font-display text-h2', dark ? 'text-white' : 'text-ink')}>{item.name}</h3>
            <p className={cx('mt-4 max-w-[52ch] font-sans text-lede', dark ? 'text-white/70' : 'text-ink-2')}>{item.copy}</p>
          </div>
          <div aria-hidden="true" className="max-w-[24rem] md:col-start-2 xl:col-start-3 xl:max-w-none xl:self-center">
            <Art fill={reduced ? done : fill} />
          </div>
        </div>
      </div>
    </motion.li>
  )
}

export default function Principles() {
  const reduced = usePrefersReducedMotion()
  const stack = useRef(null)
  const turn = useRef(-1)
  const { scrollYProgress } = useScroll({ target: stack, offset: ['start 0.2', 'end end'] })
  const count = principles.items.length

  /* The sheet on top changes at each fifth of the scroll. Note it silently the
     first time, so landing part-way down the page is not announced. */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const now = Math.max(0, Math.min(count - 1, Math.floor(v * count)))
    if (turn.current === -1) {
      turn.current = now
      return
    }
    if (now !== turn.current) {
      turn.current = now
      play('slide', 220)
    }
  })

  return (
    <Band tone="light" id="how" className="scroll-mt-24">
      <Container wide>
        <SectionIntro eyebrow={principles.eyebrow} index="04" title={principles.title} accent={principles.accent} />

        <ol ref={stack} className="mt-16 space-y-6 pb-8 md:space-y-10">
          {principles.items.map((p, i) => (
            <Sheet key={p.name} item={p} index={i} count={count} progress={scrollYProgress} reduced={reduced} />
          ))}
        </ol>
      </Container>
    </Band>
  )
}
