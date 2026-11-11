import { useState } from 'react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* The hero's picture of what Akronix builds (Step 7.6), in place of the clock.
 *
 * An application window with three views -- an overview with a chart, a records
 * table, and an automation flow -- switched from its sidebar. It is a STUDY OF AN
 * INTERFACE, not a screenshot, and it says so in a caption under it: no product
 * has shipped, and CLAUDE.md rules out dashboards of made-up data, so everything
 * in it is structure. There are no figures, no axis values, no names, no counts,
 * nothing that moves as if live: the tiles are labels over a grey placeholder bar,
 * the rows are placeholder bars, the chart is a drawn shape with no scale, and the
 * only words are the labels a business application has anywhere ("Overview",
 * "Records", "Draft", "In review"). The real work the studio can show is in "Selected
 * Work", with real screenshots.
 *
 * The motion is small and only happens when something is touched or arrives: the
 * chart draws once when its view shows, rows and flow steps settle in one after
 * another, a view change is a short fade. All CSS transitions (STATUS decision 20),
 * none when motion is reduced. Palette: the `ui-*` tokens in index.css.
 *
 * `on` is whether the hero's slide is showing, so the drawing replays each time the
 * slide comes round. */
const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const STEP = ['delay-[0ms]', 'delay-[70ms]', 'delay-[140ms]', 'delay-[210ms]', 'delay-[280ms]']

const VIEWS = [
  { key: 'overview', label: 'Overview' },
  { key: 'records', label: 'Records' },
  { key: 'automations', label: 'Automations' },
]

function Glyph({ name }) {
  const common = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round', strokeLinecap: 'round', 'aria-hidden': true, className: 'size-4 shrink-0' }
  if (name === 'overview')
    return (
      <svg {...common}>
        <rect x="1.8" y="1.8" width="5" height="5" />
        <rect x="9.2" y="1.8" width="5" height="5" />
        <rect x="1.8" y="9.2" width="5" height="5" />
        <rect x="9.2" y="9.2" width="5" height="5" />
      </svg>
    )
  if (name === 'records')
    return (
      <svg {...common}>
        <path d="M5.5 4h8.5M5.5 8h8.5M5.5 12h8.5" />
        <path d="M2 4h.01M2 8h.01M2 12h.01" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M9 1.8 3.5 9H8l-1 5.2L12.5 7H8z" />
    </svg>
  )
}

const Bar = ({ className }) => <span aria-hidden="true" className={cx('block h-2 rounded-full bg-ui-grey/35', className)} />

/* A status chip: the words every record has. */
const CHIP = {
  Draft: 'bg-ui-grey/25 text-ui-charcoal/70',
  'In review': 'bg-ui-violet/12 text-ui-violet',
  Done: 'bg-ui-charcoal text-ui-cream',
}
const Chip = ({ children }) => (
  <span className={cx('inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-sans text-[0.625rem] font-medium', CHIP[children])}>{children}</span>
)

/* The overview: three tiles, a chart, two recent rows. */
function Overview({ show, reduced }) {
  const draw = (delay) => cx('[stroke-dasharray:1]', reduced ? '' : cx('transition-[stroke-dashoffset] duration-[1600ms]', EASE, delay), show ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:1]')
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-display text-[1.0625rem] leading-none tracking-[-0.015em] text-ui-charcoal">Overview</p>
        <span className="inline-flex items-center gap-1.5 border border-ui-charcoal/15 px-2 py-1 font-sans text-[0.625rem] text-ui-charcoal/70">All teams</span>
      </div>

      <ul className="grid grid-cols-3 gap-2">
        {['Activity', 'Workload', 'Reviews'].map((t, i) => (
          <li
            key={t}
            className={cx(
              'border border-ui-charcoal/10 bg-white p-2.5 transition-[opacity,translate,border-color] duration-500 hover:border-ui-violet/50',
              EASE,
              STEP[i],
              show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            )}
          >
            <p className="font-sans text-[0.625rem] text-ui-charcoal/60">{t}</p>
            <Bar className="mt-2 w-2/3" />
            <svg viewBox="0 0 60 16" fill="none" aria-hidden="true" className="mt-2 h-3 w-full">
              <path d="M0 12 C8 11 12 6 20 8 S34 13 42 7 S54 3 60 4" className="stroke-ui-violet" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </li>
        ))}
      </ul>

      <div className="flex-1 border border-ui-charcoal/10 bg-white p-3">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[0.625rem] font-medium text-ui-charcoal/70">Trend</p>
          <p className="flex items-center gap-3 font-sans text-[0.625rem] text-ui-charcoal/50">
            <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3 bg-ui-violet" />Current</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3 bg-ui-grey" />Previous</span>
          </p>
        </div>
        <svg viewBox="0 0 300 96" preserveAspectRatio="none" fill="none" aria-hidden="true" className="mt-2 h-[calc(100%-1.25rem)] min-h-16 w-full">
          {[16, 40, 64, 88].map((y) => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} className="stroke-ui-grey/30" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <path
            d="M0 80 C40 76 70 72 110 66 S190 60 230 52 S280 44 300 40"
            className={cx('stroke-ui-grey transition-opacity duration-[900ms]', show ? 'opacity-100' : 'opacity-0')}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M0 74 C30 68 50 70 80 54 S130 58 160 38 S220 44 250 22 S285 18 300 12 L300 96 L0 96 Z" className={cx('fill-ui-violet/8 transition-opacity duration-[1200ms]', show ? 'opacity-100 delay-[900ms]' : 'opacity-0')} />
          <path d="M0 74 C30 68 50 70 80 54 S130 58 160 38 S220 44 250 22 S285 18 300 12" pathLength="1" className={cx('stroke-ui-violet', draw('delay-[100ms]'))} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  )
}

/* The records: a toolbar and a table of placeholder rows. */
const ROWS = [
  ['Draft', 'w-2/5', 'w-1/4'],
  ['In review', 'w-1/2', 'w-1/5'],
  ['Done', 'w-1/3', 'w-1/4'],
  ['In review', 'w-2/5', 'w-1/5'],
  ['Done', 'w-1/2', 'w-1/4'],
]
function Records({ show }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display text-[1.0625rem] leading-none tracking-[-0.015em] text-ui-charcoal">Records</p>
        <span className="flex h-6 w-24 items-center gap-1.5 border border-ui-charcoal/15 bg-white px-2">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className="size-3 text-ui-charcoal/40"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
          <Bar className="h-1.5 w-8" />
        </span>
      </div>
      <div className="flex-1 border border-ui-charcoal/10 bg-white">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.7fr] gap-3 border-b border-ui-charcoal/10 px-3 py-2 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-ui-charcoal/50">
          <span>Name</span>
          <span>Status</span>
          <span>Updated</span>
        </div>
        <ul>
          {ROWS.map(([status, a, b], i) => (
            <li
              key={i}
              className={cx(
                'grid grid-cols-[1.2fr_0.9fr_0.7fr] items-center gap-3 border-b border-ui-charcoal/[0.07] px-3 py-2.5 transition-[opacity,translate,background-color] duration-500 last:border-b-0 hover:bg-ui-cream/70',
                EASE,
                STEP[i],
                show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                i === 1 ? 'bg-ui-violet/[0.05]' : '',
              )}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-ui-navy/15" />
                <Bar className={a} />
              </span>
              <span><Chip>{status}</Chip></span>
              <Bar className={b} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* The automations: a trigger, a rule and an action, joined by lines that draw. */
const FLOW = [
  { t: 'Trigger', label: 'When a record changes', glyph: <path d="M9 1.8 3.5 9H8l-1 5.2L12.5 7H8z" /> },
  { t: 'Rule', label: 'If it matches the conditions', glyph: <path d="M3 3v4a3 3 0 0 0 3 3h4M13 8l-3 2 3 2M3 3h.01" /> },
  { t: 'Action', label: 'Notify the team', glyph: <path d="M4 11V7a4 4 0 0 1 8 0v4l1.2 1.5H2.8zM6.5 14h3" /> },
]
function Automations({ show, reduced }) {
  const [active, setActive] = useState(true)
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-display text-[1.0625rem] leading-none tracking-[-0.015em] text-ui-charcoal">Automations</p>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label="Automation active"
          onClick={() => setActive((v) => !v)}
          className="group/sw inline-flex items-center gap-2 font-sans text-[0.625rem] text-ui-charcoal/70"
        >
          {active ? 'Active' : 'Paused'}
          <span className={cx('relative h-4 w-7 transition-colors duration-300', active ? 'bg-ui-violet' : 'bg-ui-grey/60')}>
            <span className={cx('absolute top-0.5 size-3 bg-white transition-[left] duration-300', active ? 'left-[0.875rem]' : 'left-0.5')} />
          </span>
        </button>
      </div>
      <ol className="flex flex-1 flex-col justify-center gap-0 border border-ui-charcoal/10 bg-white p-4">
        {FLOW.map((f, i) => (
          <li key={f.t} className="relative">
            <div
              className={cx(
                'flex items-center gap-3 border border-ui-charcoal/12 bg-ui-cream/60 p-2.5 transition-[opacity,translate,border-color] duration-500 hover:border-ui-violet/60',
                EASE,
                STEP[i * 2],
                show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
              )}
            >
              <span className={cx('flex size-7 shrink-0 items-center justify-center transition-colors duration-500', active ? 'bg-ui-violet text-white' : 'bg-ui-grey/40 text-ui-charcoal/60')}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5">{f.glyph}</svg>
              </span>
              <span className="block">
                <span className="block font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-ui-charcoal/50">{f.t}</span>
                <span className="block font-sans text-[0.75rem] text-ui-charcoal">{f.label}</span>
              </span>
            </div>
            {i < FLOW.length - 1 ? (
              <span aria-hidden="true" className="relative ml-[1.1875rem] block h-4 w-px bg-ui-grey/50">
                <span
                  className={cx(
                    'absolute inset-0 origin-top bg-ui-violet',
                    reduced ? '' : cx('transition-transform duration-500', EASE, i === 0 ? 'delay-[350ms]' : 'delay-[650ms]'),
                    show && active ? 'scale-y-100' : 'scale-y-0',
                  )}
                />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function HeroShowcase({ on }) {
  const reduced = usePrefersReducedMotion()
  const [view, setView] = useState('overview')

  return (
    <figure className="flex h-full flex-col justify-center">
      <div
        role="group"
        aria-label="Interface preview. Illustrative: not a screenshot of a shipped product."
        className="overflow-hidden border border-ui-charcoal bg-ui-charcoal shadow-[0_34px_60px_-36px_rgba(16,18,23,0.6)]"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="mx-auto font-sans text-[0.6875rem] text-ui-grey">Workspace</span>
          <span className="w-10" />
        </div>

        <div className="grid h-[21.5rem] grid-cols-[3.25rem_minmax(0,1fr)] sm:grid-cols-[8.5rem_minmax(0,1fr)]">
          <nav aria-label="Preview views" className="flex flex-col gap-1 bg-ui-navy p-2 sm:p-3">
            {VIEWS.map((v) => {
              const current = view === v.key
              return (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={current}
                  aria-label={v.label}
                  onClick={() => setView(v.key)}
                  className={cx(
                    'group/roll relative flex items-center gap-2.5 px-2 py-2 text-left font-sans text-[0.75rem] transition-colors duration-300 max-sm:justify-center',
                    current ? 'bg-white/10 text-white' : 'text-ui-grey hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span aria-hidden="true" className={cx('absolute inset-y-1.5 left-0 w-0.5 bg-ui-violet transition-transform duration-300', current ? 'scale-y-100' : 'scale-y-0')} />
                  <Glyph name={v.key} />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              )
            })}
            <span aria-hidden="true" className="mt-auto hidden items-center gap-2 px-2 py-2 font-sans text-[0.6875rem] text-ui-grey/60 sm:flex">
              <span className="size-4 rounded-full bg-white/10" />
              <Bar className="h-1.5 w-12 bg-white/10" />
            </span>
          </nav>

          <div className="relative grid bg-ui-cream p-3.5 sm:p-4" aria-hidden="true">
            {[
              ['overview', (show) => <Overview show={show} reduced={reduced} />],
              ['records', (show) => <Records show={show} />],
              ['automations', (show) => <Automations show={show} reduced={reduced} />],
            ].map(([key, render]) => {
              const show = on && view === key
              return (
                <div
                  key={key}
                  inert={view !== key}
                  className={cx(
                    'col-start-1 row-start-1 min-h-0 transition-[opacity,visibility] duration-300',
                    view === key ? 'visible opacity-100' : 'invisible opacity-0',
                  )}
                >
                  {render(show)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <p className="sr-only">An illustrative software interface with three views: an overview, a records table and an automation flow. It is not a screenshot of a shipped product.</p>
      <figcaption aria-hidden="true" className="mt-4 flex items-center gap-2 font-sans text-[0.75rem] text-ink-3">
        <span className="size-1.5 rounded-full bg-ui-violet" />
        Illustrative interface. Not a screenshot of a shipped product.
      </figcaption>
    </figure>
  )
}
