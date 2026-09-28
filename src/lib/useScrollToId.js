import { useCallback } from 'react'
import { useLenis } from 'lenis/react'

/* Clearance for the sticky nav pill (~5rem in flow) plus a little air. */
export const OFFSET = 112

/* The element's top in the document, from layout rather than from the screen.
 * `getBoundingClientRect` reads the element AFTER transforms, and everything
 * inside a slab is scaled while the slab is still growing -- a product six
 * cards down a 0.97-scale slab reads ~45px out. `offsetTop` ignores
 * transforms, so summing it up the offset chain lands where the element will
 * be once the slab has finished growing, which is when the reader gets there. */
export function docTop(el) {
  let y = 0
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop
  return y
}

/* Jump to an element on the same page. Lenis owns the scroll when it is
 * running, so the jump goes through it and is eased like every other scroll;
 * the reduced-motion path has no Lenis and goes straight there. The anchor's
 * own `href` still points at the id, so without script it is a plain link. */
export function useScrollToId() {
  const lenis = useLenis()

  return useCallback(
    (e, id) => {
      const el = document.getElementById(id)
      if (!el) return
      e?.preventDefault()
      const y = Math.max(0, docTop(el) - OFFSET)
      if (lenis) lenis.scrollTo(y, { duration: 1.2 })
      else window.scrollTo(0, y)
    },
    [lenis],
  )
}
