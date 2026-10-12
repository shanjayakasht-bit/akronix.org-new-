import { useRef } from 'react'
import { useSound } from '../../lib/sound'

/* Gives a stretch of the page its interface sounds without touching a single
 * control inside it.
 *
 * Hovering any link or button (or anything marked `data-sound="soft"` / `"pulse"`
 * / `"tick"`) plays that sound once as the pointer arrives -- not again while it
 * stays on the same element, and not at all for touch, which cannot hover.
 * Pressing a link or button plays a click. Event delegation on one wrapper means
 * the About page's existing components are unchanged and any control added to it
 * later is covered. `data-sound="none"` opts a control out (the sound switch has
 * sounds of its own). Silent unless the visitor has turned sound on. */
export default function SoundScope({ children, className }) {
  const { play } = useSound()
  const last = useRef(null)

  const over = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = e.target.closest('a, button, [data-sound]')
    if (!el) {
      last.current = null
      return
    }
    if (el === last.current) return
    last.current = el
    if (el.dataset.sound !== 'none') play(el.dataset.sound || 'tick')
  }

  return (
    <div
      className={className}
      onPointerOver={over}
      onPointerLeave={() => {
        last.current = null
      }}
      onClickCapture={(e) => {
        const el = e.target.closest('a, button')
        if (el && el.dataset.sound !== 'none') play('click')
      }}
    >
      {children}
    </div>
  )
}
