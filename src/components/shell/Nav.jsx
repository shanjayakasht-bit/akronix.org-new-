import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Mark } from '../brand/Mark'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { nav, site } from '../../content/site'

const EASE = [0.16, 1, 0.3, 1]

/* Glass pill.
 *
 * Full width across the hero. Once the reader leaves the hero it contracts and
 * drops the wordmark, leaving the mark seated in the pill's left curve. Hover
 * restores it to full width, so nothing is ever permanently hidden.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [past, setPast] = useState(false)
  const [hovered, setHovered] = useState(false)
  const location = useLocation()
  const lenis = useLenis()
  const reduced = usePrefersReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setPast(v > 260))

  const wide = !past || hovered

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
      <div className="pointer-events-none sticky top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <motion.header
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          layout
          transition={{ duration: 0.7, ease: EASE }}
          className={cx(
            'pointer-events-auto mx-auto flex items-center gap-4 rounded-full py-2.5 pl-2.5 pr-2.5',
            /* Contracted, the pill is sized to its own contents rather than to a
               fixed width. A fixed 660px was narrower than the links plus the
               CTA, so the button hung outside the pill. `layout` animates
               between the two intrinsic widths. */
            wide ? 'w-full max-w-[76rem]' : 'w-fit max-w-full',
            /* glass: translucent ground, heavy blur, saturation lift, a bright
               top edge and a soft drop so it floats over dark slabs too */
            'border border-white/45 bg-paper/55 shadow-[0_8px_40px_-16px_rgba(25,23,19,0.35)]',
            'backdrop-blur-2xl backdrop-saturate-[1.6]',
          )}
        >
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pl-1.5 pr-2 text-ink"
            aria-label={`${site.name} — home`}
          >
            <Mark className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-[-10deg]" />
            <AnimatePresence initial={false}>
              {wide ? (
                <motion.span
                  initial={reduced ? false : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, width: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden whitespace-nowrap font-sans text-lg font-bold tracking-tight"
                >
                  {site.name}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-ui transition-colors duration-300',
                    isActive ? 'bg-ink/[0.07] text-ink' : 'text-ink-2 hover:bg-ink/[0.05] hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/contact"
            className="ml-auto hidden shrink-0 whitespace-nowrap rounded-full bg-ink px-5 py-2.5 font-sans text-ui text-paper transition-colors duration-300 hover:bg-clay lg:ml-0 lg:inline-flex"
          >
            Book a Consultation
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="ml-auto rounded-full border border-ink/15 px-4 py-2 font-sans text-ui text-ink lg:hidden"
          >
            {open ? 'Close' : 'Menu'}
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
            className="fixed inset-0 z-40 bg-paper px-6 pb-10 pt-28 lg:hidden"
          >
            <nav className="flex flex-col">
              {nav.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="border-b border-rule py-5 font-serif text-h3 text-ink"
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="mt-8 inline-flex justify-center rounded-full bg-ink px-6 py-3.5 font-sans text-ui text-paper"
              >
                Book a Consultation
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
