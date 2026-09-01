import { Link } from 'react-router-dom'
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

export function Button({ as = 'link', to, href, variant = 'primary', className, children, ...rest }) {
  const pad = variant === 'quiet' ? '' : 'px-6 py-3.5'
  const cls = cx(
    'group inline-flex items-center gap-2.5 font-sans text-ui transition-all duration-300',
    pad,
    styles[variant],
    className,
  )
  const inner = (
    <>
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
    </>
  )
  if (as === 'a') return <a href={href} className={cls} {...rest}>{inner}</a>
  if (as === 'button') return <button type="button" className={cls} {...rest}>{inner}</button>
  return <Link to={to} className={cls} {...rest}>{inner}</Link>
}
