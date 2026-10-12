import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { SectionIntro } from '../sections/SectionHead'
import { cx } from '../../lib/cx'
import { play } from '../../lib/sound'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { principles } from '../../content/about'

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
 * The id `how` is what the footer's "How We Work" and the Long-Term Partnership
 * row link to. */
const TOP = ['top-28', 'top-[8.25rem]', 'top-[9.5rem]', 'top-[10.75rem]', 'top-[12rem]']
const PAPER = ['bg-mist', 'bg-white', 'bg-mist', 'bg-white', 'bg-mist']

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

  return (
    <motion.li style={reduced || last ? undefined : { scale }} className={cx('sticky origin-top', TOP[index])}>
      <div className={cx('relative overflow-hidden border border-rule p-8 md:p-12', PAPER[index])}>
        {!reduced && !last ? <motion.span aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" /> : null}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-ink/10" />
        <motion.span
          aria-hidden="true"
          style={reduced ? undefined : { scaleY: fill }}
          className="absolute inset-y-0 left-0 w-[3px] origin-top bg-brand"
        />
        <div className="relative grid gap-6 md:grid-cols-12 md:gap-10">
          <span className="tnum font-display text-[5rem] font-light leading-none tracking-[-0.05em] text-ink md:col-span-3 md:text-[7rem]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="md:col-span-9">
            <h3 className="font-display text-h2 text-ink">{item.name}</h3>
            <p className="mt-4 max-w-[52ch] font-sans text-lede text-ink-2">{item.copy}</p>
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
