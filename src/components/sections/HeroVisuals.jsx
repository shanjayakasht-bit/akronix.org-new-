import { Link } from 'react-router-dom'
import { cx } from '../../lib/cx'
import { two } from '../../lib/studioTime'
import { solutions, approach } from '../../content/solutions'

/* The pictures for the home hero's slides (Step 7.4). Each is made of something
 * true and checkable -- its eight lines of work, its five steps, its published
 * prices -- and none of them shows a product or any data. (Slide 1's picture, the
 * interface preview, is its own component: `HeroShowcase`.) They are drawn on the
 * hero's grey panel; `on` is whether their slide is the one showing, so the
 * things that arrive (the rows, the rail) arrive each time the slide comes round.
 * The staggers are ladders of literal delay classes, as in `RollText`: Tailwind
 * cannot see a computed one, and there is no inline CSS. */
const STEP = [
  'delay-[0ms]', 'delay-[60ms]', 'delay-[120ms]', 'delay-[180ms]',
  'delay-[240ms]', 'delay-[300ms]', 'delay-[360ms]', 'delay-[420ms]',
]
const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

/* The eight lines of work, as an index. Each row goes to its line on the
   Solutions page. Networking says it is still forming, as everywhere. */
export function WorkIndex({ on }) {
  return (
    <ol className="flex h-full flex-col justify-center">
      {solutions.map((s, i) => (
        <li
          key={s.slug}
          className={cx(
            'border-t border-ink/12 transition-[opacity,translate] duration-[700ms] last:border-b',
            EASE,
            STEP[i],
            on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
          )}
        >
          <Link to={`/solutions#${s.slug}`} tabIndex={on ? 0 : -1} className="group/roll relative flex items-baseline gap-5 py-[0.8125rem] transition-colors duration-300 hover:text-brand">
            <span className="tnum w-6 shrink-0 font-sans text-mark text-ink-3 group-hover/roll:text-brand">{two(i + 1)}</span>
            <span className="font-display text-[1.625rem] font-light leading-none tracking-[-0.025em] text-ink transition-[translate,color] duration-300 group-hover/roll:translate-x-1.5 group-hover/roll:text-brand">
              {s.name}
            </span>
            {s.stage ? <span className="ml-auto font-sans text-mark font-medium uppercase text-ink-3">{s.stage}</span> : null}
          </Link>
        </li>
      ))}
    </ol>
  )
}

/* 3 -- the five steps from the first call to launch, on one red line that draws
   down the rail, lighting each step as it passes. Verbs and the first clause of
   the step's own sentence on the Solutions page. */
const STEPS_SHORT = [
  'Before anything is estimated',
  'Milestones and a price, in writing',
  'In short stretches you can look at',
  'With real users, and we stay',
  'Support, and the next round of changes',
]
const LIT = ['delay-[250ms]', 'delay-[550ms]', 'delay-[850ms]', 'delay-[1150ms]', 'delay-[1450ms]']

export function StepsRail({ on }) {
  return (
    <ol className="relative flex h-full flex-col justify-center gap-0 py-2">
      <span aria-hidden="true" className="absolute bottom-[3.4rem] left-[1.1875rem] top-[3.4rem] w-px bg-ink/12" />
      <span
        aria-hidden="true"
        className={cx(
          'absolute bottom-[3.4rem] left-[1.1875rem] top-[3.4rem] w-px origin-top bg-brand transition-transform duration-[1700ms] delay-[200ms]',
          EASE,
          on ? 'scale-y-100' : 'scale-y-0',
        )}
      />
      {approach.steps.map((s, i) => (
        <li key={s.n} className="relative flex items-center gap-6 py-[1.0625rem]">
          <span className="relative flex size-10 shrink-0 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-ink/20 bg-white" />
            <span
              className={cx(
                'absolute inset-0 rounded-full bg-brand transition-opacity duration-500',
                LIT[i],
                on ? 'opacity-100' : 'opacity-0',
              )}
            />
            <span className={cx('tnum relative font-sans text-[0.75rem] font-medium transition-colors duration-500', LIT[i], on ? 'text-white' : 'text-ink')}>{s.n}</span>
          </span>
          <span className="block">
            <span className="block font-display text-[1.625rem] font-light leading-none tracking-[-0.025em] text-ink">{s.name}</span>
            <span className="mt-1.5 block font-sans text-ui text-ink-2">{STEPS_SHORT[i]}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
