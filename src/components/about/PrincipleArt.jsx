import { motion, useTransform } from 'motion/react'
import { cx } from '../../lib/cx'

/* One small diagram per working principle, for the sheets on /about (Step 7.2).
 *
 * Each draws what its sentence says, using only the sentence's own words -- no
 * numbers, no examples, nothing that did not already say it. They sit in the
 * empty end of the sheet beside the copy, and are decorative: the copy carries
 * the meaning, so every one is hidden from assistive tech.
 *
 * `fill` is a motion value from 0 to 1: how far the sheet's turn has come, the
 * same value that fills the red bar down its edge. The diagram is already
 * legible at 0 (the labels, the grey structure) and the red is what scroll
 * adds, so a sheet that has just slid into view is never a blank. With reduced
 * motion `fill` is held at 1 and the diagram is simply complete.
 *
 * Size is part of the design: every one is 8.5rem tall, which is the height of
 * the copy beside it, so the sheets stay the size they were. */
const useRamp = (fill, a, b) => useTransform(fill, [a, b], [0, 1])

/* A drawn stroke. A round cap on a path of length 0 still paints a dot, so the
   stroke is also kept invisible until it has begun. */
function useStroke(fill, a, b) {
  const pathLength = useRamp(fill, a, b)
  const opacity = useTransform(pathLength, [0, 0.02], [0, 1])
  return { pathLength, opacity }
}

const CAP = 'font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em]'

/* 01 -- strategy, build and marketing, handed between agencies or kept in one
   team. The top line is broken between hands; the lower one is a single line
   that runs from the brief to the answer, lighting each stage as it goes. */
const STAGES = ['Brief', 'Strategy', 'Build', 'Marketing', 'Answer']

function OneTeam({ fill }) {
  const line = useRamp(fill, 0.04, 0.8)
  const n0 = useRamp(fill, 0.04, 0.12)
  const n1 = useRamp(fill, 0.22, 0.3)
  const n2 = useRamp(fill, 0.4, 0.48)
  const n3 = useRamp(fill, 0.58, 0.66)
  const n4 = useRamp(fill, 0.74, 0.82)
  const nodes = [n0, n1, n2, n3, n4]

  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <div>
        <p className={cx(CAP, 'text-ink-3')}>Handed between agencies</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="h-[2px] flex-1 bg-ink/15" />
          <span className="h-[2px] flex-1 bg-ink/15" />
          <span className="h-[2px] flex-1 bg-ink/15" />
        </div>
      </div>
      <div>
        <p className={cx(CAP, 'text-ink')}>One team</p>
        <div className="relative mt-3 grid grid-cols-5">
          <span className="absolute inset-x-[10%] top-[6px] h-[2px] bg-ink/12" />
          <motion.span style={{ scaleX: line }} className="absolute inset-x-[10%] top-[6px] h-[2px] origin-left bg-brand" />
          {STAGES.map((s, k) => (
            <span key={s} className="relative flex flex-col items-center gap-1.5">
              <span className="relative size-3.5">
                <span className="absolute inset-0 rounded-full border-2 border-ink/25 bg-mist" />
                <motion.span style={{ opacity: nodes[k] }} className="absolute inset-0 rounded-full bg-brand" />
              </span>
              <span className="font-sans text-[0.75rem] text-ink-2">{s}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 02 -- scope, milestones and price, written down before work begins. A sheet
   of three ruled lines; each gets written, then ticked. */
const TERMS = ['Scope', 'Milestones', 'Price']

function Written({ fill }) {
  const w0 = useRamp(fill, 0.04, 0.26)
  const w1 = useRamp(fill, 0.3, 0.52)
  const w2 = useRamp(fill, 0.56, 0.78)
  const t0 = useStroke(fill, 0.24, 0.32)
  const t1 = useStroke(fill, 0.5, 0.58)
  const t2 = useStroke(fill, 0.76, 0.84)
  const written = [w0, w1, w2]
  const ticked = [t0, t1, t2]

  return (
    <div className="border border-ink/12 bg-mist px-4 pb-0.5 pt-2.5">
      <p className={cx(CAP, 'flex items-center justify-between text-ink-3')}>
        <span>Written before work begins</span>
        <span className="size-1.5 rounded-full bg-brand" />
      </p>
      <ul className="mt-2">
        {TERMS.map((t, k) => (
          <li key={t} className="flex items-center gap-3 border-t border-ink/10 py-1">
            <span className="flex size-4 shrink-0 items-center justify-center border border-ink/30 bg-white">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-brand">
                <motion.path d="m3.5 8.5 3 3 6-7" style={ticked[k]} />
              </svg>
            </span>
            <span className="w-[5.25rem] shrink-0 font-sans text-[0.8125rem] text-ink">{t}</span>
            <span className="relative h-[2px] flex-1 bg-ink/10">
              <motion.span style={{ scaleX: written[k] }} className="absolute inset-0 origin-left bg-ink/45" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* 03 -- across a table in Chennai, or entirely over video. Two panes of equal
   weight, each drawn in turn; neither ends up louder than the other. On the
   black sheet. */
function Pane({ progress, label, children }) {
  return (
    <div className="border border-white/15 px-3 pb-2 pt-3">
      <svg viewBox="0 0 120 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-14 w-full text-white">
        {children(progress)}
      </svg>
      <p className="mt-1.5 font-sans text-[0.75rem] text-white/70">{label}</p>
    </div>
  )
}

function Presence({ fill }) {
  const a = useStroke(fill, 0.04, 0.42)
  const b = useStroke(fill, 0.4, 0.8)
  const both = useRamp(fill, 0.76, 0.96)

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Pane progress={a} label="Across a table">
          {(p) => (
            <>
              <motion.path d="M8 40H112M20 40V54M100 40V54" style={p} />
              <motion.circle cx="38" cy="14" r="6" style={p} />
              <motion.path d="M27 33Q38 20 49 33" style={p} />
              <motion.circle cx="82" cy="14" r="6" style={p} />
              <motion.path d="M71 33Q82 20 93 33" style={p} />
            </>
          )}
        </Pane>
        <span className="font-sans text-[0.75rem] text-white/50">or</span>
        <Pane progress={b} label="Over video">
          {(p) => (
            <>
              <motion.rect x="12" y="4" width="96" height="48" rx="3" style={p} />
              <motion.circle cx="44" cy="22" r="5" style={p} />
              <motion.path d="M35 42Q44 30 53 42" style={p} />
              <motion.circle cx="76" cy="22" r="5" style={p} />
              <motion.path d="M67 42Q76 30 85 42" style={p} />
            </>
          )}
        </Pane>
      </div>
      <p className={cx(CAP, 'mt-3 flex items-center gap-3 text-white/55')}>
        <span className="relative h-px flex-1 bg-white/15">
          <motion.span style={{ scaleX: both }} className="absolute inset-0 origin-right bg-brand-soft" />
        </span>
        Neither is second-best
        <span className="relative h-px flex-1 bg-white/15">
          <motion.span style={{ scaleX: both }} className="absolute inset-0 origin-left bg-brand-soft" />
        </span>
      </p>
    </div>
  )
}

/* 04 -- if we are not the right fit, or a smaller piece of work would do, we
   say so before you spend anything. One trunk, three branches: only the first
   ends in "we start". */
function Fork({ fill }) {
  const trunk = useStroke(fill, 0.02, 0.18)
  const p0 = useStroke(fill, 0.16, 0.4)
  const p1 = useStroke(fill, 0.36, 0.6)
  const p2 = useStroke(fill, 0.56, 0.8)
  const c0 = useRamp(fill, 0.38, 0.46)
  const c1 = useRamp(fill, 0.58, 0.66)
  const c2 = useRamp(fill, 0.78, 0.86)
  const branch = [p0, p1, p2]
  const chips = [
    { text: 'Right fit: we start', lit: c0, edge: 'border-ink' },
    { text: 'Smaller piece: we say so', lit: c1, edge: 'border-brand' },
    { text: 'Not a fit: we say so', lit: c2, edge: 'border-brand' },
  ]
  const PATHS = ['M64 60C92 60 92 14 120 14H172', 'M64 60H172', 'M64 60C92 60 92 106 120 106H172']

  return (
    <div className="relative h-[7.5rem]">
      <svg viewBox="0 0 336 120" preserveAspectRatio="none" fill="none" strokeWidth="1.5" strokeLinecap="round" className="absolute inset-0 h-full w-full">
        <path d="M6 60H64" vectorEffect="non-scaling-stroke" className="stroke-ink/15" />
        <motion.path d="M6 60H64" vectorEffect="non-scaling-stroke" className="stroke-ink" style={trunk} />
        {PATHS.map((d, k) => (
          <g key={d}>
            <path d={d} vectorEffect="non-scaling-stroke" className="stroke-ink/15" />
            <motion.path d={d} vectorEffect="non-scaling-stroke" className={k === 0 ? 'stroke-ink' : 'stroke-brand'} style={branch[k]} />
          </g>
        ))}
      </svg>
      <span className="absolute left-0 top-1/2 size-3 -translate-y-1/2 rounded-full bg-ink" />
      <p className="absolute left-0 top-[calc(50%-2rem)] font-sans text-[0.75rem] text-ink">You ask</p>
      <p className={cx(CAP, 'absolute left-0 top-[calc(50%+1.125rem)] max-w-[6.5rem] text-[0.625rem] leading-snug text-ink-3')}>Before you spend anything</p>
      <ul className="absolute inset-y-0 right-0 flex w-[52%] flex-col justify-between">
        {chips.map((c) => (
          <li key={c.text} className="relative flex h-7 items-center border border-ink/15 bg-white px-3 font-sans text-[0.75rem] text-ink">
            <motion.span aria-hidden="true" style={{ opacity: c.lit }} className={cx('absolute -inset-px border', c.edge)} />
            <span className="relative">{c.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* 05 -- AI and automation where it removes real work; left out where a simple
   tool is enough. The same switch, set two ways. */
function Switch({ on, label, verdict, p }) {
  const x = useTransform(p, [0, 1], [0, on ? 20 : 0])
  return (
    <li className="flex items-center gap-4 border-t border-ink/10 py-[0.6875rem]">
      <span className="flex-1 font-sans text-[0.8125rem] text-ink">{label}</span>
      <span className={cx('relative h-5 w-10 shrink-0 border bg-white', on ? 'border-ink/30' : 'border-ink/25')}>
        {on ? <motion.span aria-hidden="true" style={{ opacity: p }} className="absolute inset-0 bg-brand" /> : null}
        <motion.span aria-hidden="true" style={{ x }} className={cx('absolute left-[2px] top-[2px] size-4', on ? 'bg-ink' : 'bg-ink/35')} />
      </span>
      <span className={cx('w-[3.75rem] shrink-0 font-sans text-[0.75rem]', on ? 'text-ink' : 'text-ink-3')}>{verdict}</span>
    </li>
  )
}

function Earns({ fill }) {
  const p0 = useRamp(fill, 0.1, 0.4)
  const p1 = useRamp(fill, 0.5, 0.8)
  return (
    <div>
      <p className={cx(CAP, 'pb-2.5 text-ink-3')}>AI and automation</p>
      <ul>
        <Switch on label="Removes real work" verdict="In" p={p0} />
        <Switch on={false} label="A simple tool is enough" verdict="Left out" p={p1} />
      </ul>
    </div>
  )
}

export const ART = [OneTeam, Written, Presence, Fork, Earns]
