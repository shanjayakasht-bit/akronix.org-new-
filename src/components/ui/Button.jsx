import { Link } from 'react-router-dom'
import { RollText } from './RollText'
import { cx } from '../../lib/cx'

/* Radius 2px only, so a control reads as pressable without becoming a lozenge.
   No gradients, no glow. */
const styles = {
  primary: 'rounded-control bg-ink text-paper hover:bg-clay hover:-translate-y-0.5',
  outline: 'rounded-control border border-ink text-ink hover:border-clay hover:text-clay hover:-translate-y-0.5',
  quiet: 'border-b border-ink pb-1 text-ink hover:border-clay hover:text-clay',
  onDark: 'rounded-control bg-paper text-ink hover:bg-clay hover:text-paper hover:-translate-y-0.5',
  onDarkGhost: 'rounded-control border border-paper/35 text-paper hover:border-paper hover:bg-paper/10',
}

/* Two sizes. `compact` is for the one row that has to hold two buttons side by
   side on a phone: padding, gap and type all have to come down together, since
   a pair of these costs 21.75x the font size plus 68px of chrome and there are
   only 335px on a 375px screen. It is a mobile size only -- everything is back
   to the default measurements by `sm`, where the pair fits at full size. The
   three are separate strings because `cx` is a plain join: two competing
   paddings in one class list are settled by stylesheet order, not by which was
   written last, so a size can only override another by replacing it. */
const SIZES = {
  default: { pad: 'px-6 py-3.5', gap: 'gap-2.5', text: 'text-ui' },
  /* `snug` is the hero's pair, which overflows by less than 5px at the default
     size -- so it gives back the least it can: 8px of padding a side and the
     last half-pixel of type below 389px. `compact` would have taken the labels
     down to 11.25px, and these are the first controls on the page. */
  snug: {
    pad: 'px-4 py-3 sm:px-6 sm:py-3.5',
    gap: 'gap-2 sm:gap-2.5',
    text: 'text-[min(3.6vw,0.875rem)] sm:text-ui',
  },
  compact: {
    pad: 'px-3 py-3 sm:px-6 sm:py-3.5',
    gap: 'gap-1.5 sm:gap-2.5',
    text: 'text-[min(3vw,0.875rem)] sm:text-ui',
  },
}

export function Button({ as = 'link', to, href, variant = 'primary', size = 'default', className, children, ...rest }) {
  const s = SIZES[size]
  const cls = cx(
    'group/roll group inline-flex items-center font-sans transition-all duration-300',
    s.gap,
    s.text,
    variant === 'quiet' ? '' : s.pad,
    styles[variant],
    className,
  )
  const inner = (
    <>
      <RollText>{children}</RollText>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
    </>
  )
  if (as === 'a') return <a href={href} className={cls} {...rest}>{inner}</a>
  if (as === 'button') return <button type="button" className={cls} {...rest}>{inner}</button>
  return <Link to={to} className={cls} {...rest}>{inner}</Link>
}
