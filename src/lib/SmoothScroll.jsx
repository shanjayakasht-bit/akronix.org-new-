import { ReactLenis } from 'lenis/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Smooth scroll is a preference, not a feature. Anyone who has asked their OS
   to stop moving things gets the native scroller untouched. */
export default function SmoothScroll({ children }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return children

  return (
    <ReactLenis root options={{ lerp: 0.09 }}>
      {children}
    </ReactLenis>
  )
}
