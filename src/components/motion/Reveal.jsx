import { useRef } from 'react'
import { useInView } from 'motion/react'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* A block that rises into place the first time it is seen.
 *
 * It is a class swap on a CSS transition, not a `motion` `initial` state, on
 * purpose: the route sits inside `AnimatePresence initial={false}`, which makes
 * every `initial` under it a no-op on a hard load (STATUS, Step 7.1), and a
 * re-render cannot replay a transition. `delay` is a literal Tailwind class
 * (`delay-[120ms]`) so the stylesheet can see it; there is no inline CSS. With
 * reduced motion it is simply there. A caller that needs the element too passes
 * a callback as `innerRef` (a plain `ref` would replace the one it watches with). */
export function Reveal({ as: Tag = 'div', delay = '', className, innerRef, children, ...rest }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const seen = useInView(ref, { once: true, margin: '-6% 0px' })
  const shown = seen || reduced

  return (
    <Tag
      ref={(el) => {
        ref.current = el
        if (typeof innerRef === 'function') innerRef(el)
      }}
      className={cx(
        reduced ? '' : cx('transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]', delay),
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
