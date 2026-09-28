import { useCallback, useEffect, useRef, useState } from 'react'

/* Whether the page behind a given element is light or dark, re-read as the
 * page scrolls.
 *
 * The nav's logo and button are solid now -- no longer inverted by a blend --
 * so they have to be told which ground they are over. This asks the browser
 * what is actually painted at the element's centre: `elementsFromPoint`, skip
 * anything inside the nav itself, then walk up from the first hit to the first
 * element with a mostly opaque background. That is whatever the reader sees
 * behind the bar -- a slab, the footer, the hero's video frame, the open menu
 * sheet -- with no list of sections to keep in step.
 *
 * Returns 'light' | 'dark'. `watch` is any value whose change should force a
 * re-read (route, menu open, pill width). */
const DARK_BELOW = 0.4

function parse(color) {
  const n = color.match(/[\d.]+/g)?.map(Number)
  if (!n || n.length < 3) return null
  if (color.startsWith('rgb')) {
    return { rgb: n.slice(0, 3).map((v) => v / 255), a: n[3] ?? 1 }
  }
  if (color.startsWith('color(srgb')) {
    return { rgb: n.slice(0, 3), a: n[3] ?? 1 }
  }
  if (color.startsWith('oklab') || color.startsWith('oklch')) {
    /* Lightness is the first channel, already perceptual. */
    return { l: n[0] > 1 ? n[0] / 100 : n[0], a: n.length > 3 ? n.at(-1) : 1 }
  }
  return null
}

function lightness({ rgb, l }) {
  if (l !== undefined) return l
  const lin = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  const y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
  return Math.cbrt(y) /* back to a perceptual scale, comparable to oklab L */
}

export function useBackdropTone(target, root, watch) {
  const [tone, setTone] = useState('light')
  const frame = useRef(0)

  const read = useCallback(() => {
    const el = target.current
    const nav = root.current
    if (!el || !nav) return
    const r = el.getBoundingClientRect()
    if (!r.width) return
    const hits = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    const under = hits.find((h) => !nav.contains(h))
    let next = 'light'
    for (let n = under; n && n !== document.documentElement; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a >= 0.5) {
        next = lightness(c) < DARK_BELOW ? 'dark' : 'light'
        break
      }
    }
    setTone((t) => (t === next ? t : next))
  }, [target, root])

  const schedule = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(read)
  }, [read])

  useEffect(() => {
    schedule()
    /* The page swap and the pill's contraction both move things under the bar
       without a scroll event, so read again once each has had time to land. */
    const late = setTimeout(schedule, 750)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      clearTimeout(late)
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [schedule, watch])

  return tone
}
