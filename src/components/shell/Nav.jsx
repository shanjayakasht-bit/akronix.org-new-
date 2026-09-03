import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Logo } from '../brand/Logo'
import { RollText } from '../ui/RollText'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { nav, site } from '../../content/site'

const EASE = [0.16, 1, 0.3, 1]

/* Three bars that fold into an X.
 *
 * The design rules ban decorative icons, and this is not one: it is the
 * control's own state drawn rather than described, and the word stays beside
 * it so the mark never has to carry the meaning alone. Client's request.
 *
 * One element per bar rather than two swapped SVGs, so the two states are ends
 * of a single movement -- the outer bars converge on the middle line and turn
 * through 45 degrees while the middle one goes. Positions are literal pixels
 * because they have to agree: in a 10px box the outer bars sit at 0 and 9, and
 * both centres reach 4.5.
 */
function MenuGlyph({ open, reduced }) {
  const bar = 'absolute left-0 h-px w-full bg-white'
  const move = { duration: reduced ? 0 : 0.42, ease: EASE }
  return (
    <span aria-hidden="true" className="relative block h-2.5 w-4 shrink-0">
      <motion.span
        className={cx(bar, 'top-0')}
        initial={false}
        animate={{ y: open ? 4.5 : 0, rotate: open ? 45 : 0 }}
        transition={move}
      />
      <motion.span
        className={cx(bar, 'top-[4.5px]')}
        initial={false}
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.3 : 1 }}
        transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
      />
      <motion.span
        className={cx(bar, 'bottom-0')}
        initial={false}
        animate={{ y: open ? -4.5 : 0, rotate: open ? -45 : 0 }}
        transition={move}
      />
    </span>
  )
}

/* Glass pill.
 *
 * Full width across the hero, contracting to its own contents once the reader
 * leaves it and expanding again on the way back up. Scroll position is the only
 * thing that drives it -- hover used to expand it too and that was wrong: the
 * bar moved whenever the pointer crossed it.
 *
 * Wide, the name is set beside the mark. Contracted, the mark stands alone.
 * That is only possible because the nav uses the cropped `mark` variant of the
 * logo, which has no wordmark of its own to clash with.
 *
 * The pill has no fill, so the page runs straight under the type. The whole
 * bar is drawn white and composited with `mix-blend-difference`, which makes
 * each pixel the inverse of whatever is behind it: dark type over the cream
 * page, light type over the forest and cocoa slabs, and -- because it is a
 * per-pixel operation rather than a state flip -- a section edge crossing the
 * bar inverts the letters it is halfway through rather than switching the
 * whole bar at once.
 *
 * The blend sits on the OUTER sticky wrapper, and it has to. An element blends
 * with its backdrop only as far as the nearest ancestor that forms a stacking
 * context, and this wrapper forms one the moment it is `sticky z-50`. Put the
 * blend on anything inside it and the group being blended is the bar itself --
 * transparent -- so the type just renders white. It was built that way first
 * and the links came out pale on the cream page.
 *
 * Everything inside is therefore authored as its own inverse: the CTA is a
 * white pill with black type, which difference turns into the near-black pill
 * with cream type it is meant to be, and flips on the dark slabs.
 *
 * Two consequences worth knowing. Difference against a saturated ground gives
 * a tinted result, not a neutral one: over the forest slab the type lands
 * slightly pink.
 *
 * And every piece of type in here is FULL white, never a dimmed white. Under
 * difference, dimming the source dims the inversion with it -- a `text-white/65`
 * link half-inverts and comes out muddy grey on both light and dark grounds,
 * which reads as type that is not responding to the page at all. The current
 * page is marked with a rule under it instead of with weight.
 *
 * The CTA is deliberately left out of the blend. It is a filled control, not
 * type on the page, and it stays legible on any ground on its own.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [past, setPast] = useState(false)
  const location = useLocation()
  const lenis = useLenis()
  const reduced = usePrefersReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setPast(v > 260))

  /* The contraction is desktop-only, by request. On a phone the pill is
     already near its contents and the mark alone is most of what is left, so
     shrinking it read as the bar twitching rather than as it getting out of
     the way. Gated at `lg`, the same line the inline links appear on. */
  const roomy = useMediaQuery('(min-width: 1024px)', true)
  const wide = !past || !roomy

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.documentElement.classList.add('overflow-hidden')
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.documentElement.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  return (
    <>
      <div className="pointer-events-none sticky top-0 z-50 px-3 pt-3 mix-blend-difference md:px-5 md:pt-4">
        <motion.header
          layout
          transition={{ duration: 0.7, ease: EASE }}
          className={cx(
            'pointer-events-auto mx-auto flex items-center gap-4 rounded-full py-2.5 pl-2.5 pr-2.5',
            /* Contracted, the pill is sized to its own contents rather than to a
               fixed width. A fixed 660px was narrower than the links plus the
               CTA, so the button hung outside the pill. `layout` animates
               between the two intrinsic widths. */
            wide ? 'w-full max-w-304' : 'w-fit max-w-full',
            /* glass: translucent ground, heavy blur, saturation lift, a bright
               top edge and a soft drop so it floats over dark slabs too */
            'border border-white/25 bg-transparent',
          )}
        >
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-full pb-1.5 pl-1.5 pr-2"
            aria-label={`${site.name} — home`}
          >
            <Logo mono mark alt="" className="h-10 shrink-0 transition-transform duration-500 group-hover:-rotate-6" />
            {/* Only while the pill is wide. The mark carries it on its own once
                the bar has contracted. */}
            {/* It stays mounted and rides the SAME `layout` animation as the
                pill rather than mounting and unmounting inside an
                `AnimatePresence` that animates its own width to `auto`. That is
                what made it arrive in a jerk on the way back up: the pill's
                layout animation applies a scale to everything inside it, and a
                child animating its own width on a different duration fights
                that correction the whole way. One layout pass, one easing. */}
            <motion.span
              layout
              transition={{ duration: 0.7, ease: EASE }}
              className={cx(
                'overflow-hidden whitespace-nowrap pt-1.5 font-sans text-lg font-bold tracking-tight text-white',
                'transition-opacity duration-500',
                wide ? 'w-auto opacity-100' : 'w-0 opacity-0',
              )}
            >
              {site.name}
            </motion.span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'group/roll relative whitespace-nowrap px-3.5 py-2 font-sans text-ui text-white',
                    isActive &&
                      'after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:bg-white',
                  )
                }
              >
                <RollText>{item.label}</RollText>
              </NavLink>
            ))}
          </nav>

          <Link
            to="/contact"
            className="group/roll ml-auto hidden shrink-0 whitespace-nowrap rounded-full bg-white px-5 py-2.5 font-sans text-ui text-black transition-colors duration-300 hover:bg-clay-soft lg:ml-0 lg:inline-flex"
          >
            <RollText>Book a Consultation</RollText>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="group/roll ml-auto inline-flex items-center gap-2.5 rounded-full border border-white/35 px-4 py-2 font-sans text-ui text-white lg:hidden"
          >
            <MenuGlyph open={open} reduced={reduced} />
            <RollText>{open ? 'Close' : 'Menu'}</RollText>
          </button>
        </motion.header>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-paper px-6 pb-10 pt-28 lg:hidden"
          >
            {/* The sheet only ever renders below `lg`, so these sizes are the
                mobile ones and there is no desktop case to guard against.

                `text-[1.75rem]` is the item size, raised from `text-h3` -- 22px
                on a phone -- at the client's request. It is spelled out rather
                than taken from the type scale because `text-h3` is shared with
                headings on the page and this had to move on its own.

                The row padding came down to `py-4` as the type went up, which
                is what keeps the five items and the CTA on one screen: at
                `py-5` the 28px type puts the button below the fold on a 568px
                phone. Raise the type further and `py` is the second knob -- the
                sheet scrolls now, so nothing is lost either way. */}
            <nav className="flex flex-col">
              {nav.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="group/roll border-b border-rule py-4 font-serif text-[1.75rem] leading-tight text-ink"
                >
                  <RollText>{item.label}</RollText>
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="group/roll mt-8 inline-flex justify-center rounded-full bg-ink px-6 py-3.5 font-sans text-ui text-paper"
              >
                <RollText>Book a Consultation</RollText>
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
