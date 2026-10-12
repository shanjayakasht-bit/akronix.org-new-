import { Link } from 'react-router-dom'
import { RollText } from '../ui/RollText'
import { Arrow } from '../ui/Arrow'
import { cx } from '../../lib/cx'

/* A glazed pill button, for the pricing page (Step 7).
 *
 * A vertical gradient, a hairline lit along the top edge, a pale highlight over
 * the upper half and a soft coloured shadow underneath: the "glossy" the client
 * asked for on this page. The label rolls up on hover like every other control,
 * and the arrow steps forward. `variant` is the surface it sits on --
 * `white` for dark glass, `dark` for a white card, `red` for the one that should
 * pull the eye, `glass` for a quiet one on a dark ground. */
const VARIANTS = {
  white:
    'bg-gradient-to-b from-white to-[#dfe3ea] text-ink shadow-[inset_0_1px_0_#fff,0_14px_28px_-14px_rgba(0,0,0,0.55)]',
  dark:
    'bg-gradient-to-b from-[#30333b] to-[#0b0c0f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_16px_30px_-14px_rgba(11,12,15,0.6)]',
  red:
    'bg-gradient-to-b from-[#f2433f] to-[#c4120f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_34px_-14px_rgba(221,25,22,0.65)]',
  glass:
    'gloss-dark text-white',
}

export function GlossButton({ to, href, variant = 'white', className, children, ...rest }) {
  const cls = cx(
    'group/roll group relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-full px-6 py-3.5 font-sans text-ui font-medium transition-transform duration-300 hover:-translate-y-0.5',
    VARIANTS[variant],
    className,
  )
  const inner = (
    <>
      {variant !== 'glass' ? (
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent" />
      ) : null}
      <span className="relative">
        <RollText>{children}</RollText>
      </span>
      <Arrow className="relative transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>
  return <Link to={to} className={cls} {...rest}>{inner}</Link>
}
