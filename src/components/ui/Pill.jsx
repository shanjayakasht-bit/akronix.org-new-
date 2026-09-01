import { cx } from '../../lib/cx'

/* Section marker. Sharp edges per CLAUDE.md -- the shape is a rule-bounded
   tag, not a lozenge. Colour is a tint, never a fill. */
export function Pill({ tone = 'clay', className, children, ...rest }) {
  const tones = {
    clay: 'text-clay before:bg-clay',
    moss: 'text-moss before:bg-moss',
    slate: 'text-slate before:bg-slate',
    ochre: 'text-ochre before:bg-ochre',
    onDark: 'text-paper/70 before:bg-paper/50',
  }
  return (
    <span
      className={cx(
        'relative inline-flex items-center gap-3 pl-7 font-sans text-mark uppercase',
        'before:absolute before:left-0 before:top-1/2 before:h-px before:w-5 before:-translate-y-1/2',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
