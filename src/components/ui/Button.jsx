import { Link } from 'react-router-dom'
import { RollText } from './RollText'
import { Arrow } from './Arrow'
import { cx } from '../../lib/cx'

/* Square, 1px-bordered controls. On hover a second colour wipes in from the
 * left behind the label while the label rolls and the arrow steps forward --
 * three small movements on one gesture, which is what makes it feel built
 * rather than toggled.
 *
 * The wipe is a `before` pseudo-element scaled on X, so it costs no layout.
 * `isolate` keeps it behind the label without a z-index war with the page. */
const WIPE =
  'relative isolate overflow-hidden before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-[550ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-x-100'

const styles = {
  primary: `${WIPE} border border-ink bg-ink text-white before:bg-brand hover:border-brand`,
  outline: `${WIPE} border border-ink text-ink before:bg-ink hover:text-white`,
  onDark: `${WIPE} border border-white bg-white text-ink before:bg-brand hover:border-brand hover:text-white`,
  onDarkGhost: `${WIPE} border border-white/40 text-white before:bg-white hover:border-white hover:text-ink`,
  quiet: 'border-b border-ink pb-1 text-ink hover:border-brand hover:text-brand',
}

/* Three sizes. `compact` and `snug` exist for the one row that has to hold two
   buttons side by side on a phone: padding, gap and type come down together,
   and everything is back to the default measurements by `sm`. They are
   separate strings because `cx` is a plain join: two competing paddings in one
   class list are settled by stylesheet order, not by which was written last,
   so a size can only override another by replacing it. */
const SIZES = {
  default: { pad: 'px-6 py-3.5', gap: 'gap-3', text: 'text-ui', arrow: '' },
  snug: {
    pad: 'px-4 py-3 sm:px-6 sm:py-3.5',
    gap: 'gap-2 sm:gap-3',
    text: 'text-[min(3.6vw,0.9375rem)] sm:text-ui',
    arrow: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
  },
  compact: {
    pad: 'px-2.5 py-3 sm:px-6 sm:py-3.5',
    gap: 'gap-1.5 sm:gap-3',
    text: 'text-[min(3vw,0.9375rem)] sm:text-ui',
    arrow: 'h-3 w-3 sm:h-4 sm:w-4',
  },
}

export function Button({ as = 'link', to, href, variant = 'primary', size = 'default', className, children, ...rest }) {
  const s = SIZES[size]
  const cls = cx(
    'group/roll group inline-flex items-center font-sans font-medium transition-colors duration-300',
    s.gap,
    s.text,
    variant === 'quiet' ? '' : s.pad,
    styles[variant],
    className,
  )
  const inner = (
    <>
      <RollText>{children}</RollText>
      <Arrow className={cx(s.arrow, 'transition-transform duration-300 group-hover:translate-x-1')} />
    </>
  )
  if (as === 'a') return <a href={href} className={cls} {...rest}>{inner}</a>
  if (as === 'button') return <button type="button" className={cls} {...rest}>{inner}</button>
  return <Link to={to} className={cls} {...rest}>{inner}</Link>
}
