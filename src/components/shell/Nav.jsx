import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Logo } from '../brand/Logo'
import { RollText } from '../ui/RollText'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { useBackdropTone } from '../../lib/useBackdropTone'
import { lensMap } from '../../lib/lensMap'
import { nav, site } from '../../content/site'

const EASE = [0.16, 1, 0.3, 1]

/* The glass's rim: how deep the bending band runs in from the edge, and the
   most it shifts a pixel, both in CSS pixels. The pill is ~66px tall, so a
   14px band leaves the middle ~38px flat and readable, as in the client's iOS
   reference. 22px (tried in Step 4.6) bent two thirds of the height and
   scrambled any text lying across the middle; 20/36 (Step 4.5) likewise. */
const LENS_BAND = 14
const LENS_SHIFT = 30

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
  const bar = 'absolute left-0 h-px w-full bg-current'
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

/* Liquid-glass pill.
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
 * ---- Glass and solid pieces --------------------------------------------
 *
 *  1. GLASS -- an absolute span, first in the pill. The pieces after it are
 *     `relative`, so they paint over it in source order. Not `-z-10` inside
 *     an `isolate` pill (Step 4.4 moved away from that as a suspect for
 *     WebKit).
 *
 *     History, so the balance is not lost again: Step 4.4 was a 6px frost
 *     with a white tint -- "looks like blurred or tinted glass". Step 4.5 went
 *     fully clear -- "there is no glassmorphism effect". Step 4.6 sits between:
 *     a 2px frost, saturation and brightness lifted, a 6% white body, and a
 *     specular rim strong enough to read as a glass edge. The reference is
 *     the iOS camera-mode pill: readable through the middle, bending at the
 *     rim.
 *
 *     The bend is an SVG filter, `#akx-glass`: `feDisplacementMap` driven by a
 *     map from `lensMap`, drawn at the pill's own pixel size and redrawn when
 *     the pill changes size (wide <-> contracted, window resize). Flat in the
 *     middle, strongest at the edge.
 *
 *     The true bend is Chromium only. Safari and Firefox cannot run an SVG
 *     filter inside `backdrop-filter`. They get a stand-in instead: a ring
 *     along the rim frosted harder than the middle (the second span), so text
 *     crossing the edge smears as through the thick edge of a lens. The
 *     client is on Safari and asked for the edge effect there (Step 4.6).
 *
 *  2. EVERYTHING ELSE IS SOLID and toned -- the mark, the wordmark, the
 *     links, the CTA and the Menu button. Nothing in the bar is blended any
 *     more. `useBackdropTone` reads what is actually painted under each group
 *     and it takes the light set (ink) or the dark set (white/paper).
 *
 *     The links used to be white type in a second, `mix-blend-difference`
 *     copy of the pill (Steps 4.4-4.6). Difference inverts the ground, so over
 *     the forest and cocoa slabs they came out pink and pale blue while the
 *     logo and button went cleanly white. The client asked for black and white
 *     only (Step 4.7), which difference cannot give on a coloured ground -- so
 *     the links are toned like the logo now, and the second layer is gone.
 *     Each group flips as a whole rather than per pixel at a section edge.
 *
 *     The mark is bare -- no plate behind it. Step 4.5 added one unasked and
 *     the client rejected it (Step 4.6): do not reintroduce it. No hover tilt.
 *
 *     The name beside the mark is the logo's own AKRONIX wordmark, cropped
 *     from the artwork, red I included (Step 4.7) -- not type. On a dark
 *     ground it switches to the light artwork, whose I stays red.
 *
 *     The current page is NOT marked -- the underline that used to sit under
 *     it was removed at the client's request.
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

  /* What is behind each solid group. Read separately for the mark, the links
     and the button, because at a slab's rounded edge they can sit over
     different grounds. */
  const bar = useRef(null)
  const markRef = useRef(null)
  const linksRef = useRef(null)
  const actionRef = useRef(null)
  const markTone = useBackdropTone(markRef, bar, `${location.pathname}-${open}-${wide}`)
  const linksTone = useBackdropTone(linksRef, bar, `${location.pathname}-${open}-${wide}-${roomy}`)
  const actionTone = useBackdropTone(actionRef, bar, `${location.pathname}-${open}-${wide}-${roomy}`)
  const markDark = markTone === 'dark'
  const linksDark = linksTone === 'dark'
  const actionDark = actionTone === 'dark'

  /* Chromium runs an SVG filter inside `backdrop-filter`; nothing else does,
     and elsewhere the `url()` would void the declaration. Read once. */
  const [bends] = useState(
    () =>
      typeof navigator !== 'undefined' &&
      !!navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand)),
  )

  /* The lens map, redrawn at the glass's size whenever that changes. The
     pill's `layout` animation runs on transforms, so the element's own box
     jumps straight to its final size and this fires once per change, not
     every frame. */
  const glass = useRef(null)
  const [lens, setLens] = useState(null)
  useLayoutEffect(() => {
    const el = glass.current
    if (!bends || !el) return undefined
    let last = ''
    const draw = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const key = `${w}x${h}`
      if (!w || !h || key === last) return
      last = key
      setLens(lensMap(w, h, LENS_BAND))
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(el)
    return () => ro.disconnect()
  }, [bends])

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
      {/* The glass's refraction map. Zero-size and out of flow; only the
          filter is used, and only where `bends` is true -- see GLASS above. */}
      {lens ? (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <filter
            id="akx-glass"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={lens.w}
            height={lens.h}
            colorInterpolationFilters="sRGB"
          >
            <feImage href={lens.url} x="0" y="0" width={lens.w} height={lens.h} preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={LENS_SHIFT} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      ) : null}

      <div ref={bar} className="pointer-events-none sticky top-0 z-50 px-3 pt-3 md:px-8 md:pt-4">
        <motion.header
          layout
          transition={{ duration: 0.7, ease: EASE }}
          className={cx(
            'pointer-events-auto relative mx-auto flex items-center gap-4 rounded-full py-2.5 pl-2.5 pr-2.5',
            /* Contracted, the pill is sized to its own contents rather than to a
               fixed width. A fixed 660px was narrower than the links plus the
               CTA, so the button hung outside the pill. `layout` animates
               between the two intrinsic widths.

               Wide, it lines up with `Container wide` (Step 4.6): the
               wrapper's 32px from `md` and 12px below it leave the pill 8px
               proud of the content edge on both sides at every width, and 96rem
               is the 1600 measure's content box plus those 8px each side. */
            wide ? 'w-full max-w-[96rem]' : 'w-fit max-w-full',
          )}
        >
          {/* The glass body: a light frost, a lift in saturation and
              brightness, the faintest white body, and a specular rim -- bright
              top-left, softer bottom-right, a glow just inside the edge. In
              Chromium the lens displacement runs first in the same stack, so
              the page bends at the rim before it is frosted. */}
          <span
            ref={glass}
            aria-hidden="true"
            className={cx(
              'absolute inset-0 rounded-full bg-white/[0.06] ring-1 ring-ink/[0.08]',
              'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45),inset_1.5px_2px_1px_-1px_rgba(255,255,255,0.95),inset_-1.5px_-2px_1px_-1px_rgba(255,255,255,0.4),inset_0_0_14px_rgba(255,255,255,0.28),0_10px_30px_-12px_rgba(25,23,19,0.35)]',
              bends && lens
                ? '[backdrop-filter:url(#akx-glass)_blur(2px)_saturate(1.2)_brightness(1.03)]'
                : 'backdrop-blur-[2px] backdrop-saturate-[1.2] backdrop-brightness-[1.03]',
            )}
          />
          {/* Where the lens cannot run -- Safari, Firefox -- a band along the
              rim is frosted harder than the middle, so whatever crosses the
              edge smears the way it would through the thick edge of a glass
              lens. It is a stand-in for the bend, not the bend: the band is the
              pill's padding box, masked down to just the ring with
              `mask-composite: exclude`. */}
          {!bends ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full p-[9px] backdrop-blur-[7px] backdrop-saturate-[1.4] backdrop-brightness-[1.06] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
            />
          ) : null}

          <Link
            to="/"
            className="group relative flex shrink-0 items-center gap-3 rounded-full pl-1.5 pr-2"
            aria-label={`${site.name} — home`}
          >
            {/* The bare mark, as in Step 4.4 -- NO plate behind it. Its
                `pb-1.5` lifts the figure 3px for its foot; it sits on the mark
                alone, not on the link, so it cannot lift the wordmark too. */}
            <span ref={markRef} className="block shrink-0 pb-1.5">
              <Logo
                mark
                alt=""
                className={cx(
                  'h-10 shrink-0 transition-[filter] duration-500',
                  markDark ? '[&>img]:brightness-0 [&>img]:invert' : '[&>img]:brightness-0',
                )}
              />
            </span>
            {/* The logo's own wordmark, only while the pill is wide; the mark
                carries it alone once the bar has contracted. It stays mounted
                and rides the SAME `layout` animation as the pill rather than
                mounting inside an `AnimatePresence` that animates its own
                width -- that arrived in a jerk, because the pill's layout
                animation scales everything inside it and a child animating its
                own width on a different duration fights that correction.

                Both artworks are rendered and cross-faded rather than swapping
                `src`, so the change of ground never flashes an unloaded image.
                Vertically centred on the pill, measured (Step 4.8): the crop
                box is symmetric about the letters, so centring the box centres
                the caps. It carries no padding of its own -- the 3px lift for
                the figure's foot lives on the mark's span, not on the link,
                which is what had held the wordmark 4px high through Step 4.7's
                `pt` nudges. */}
            <motion.span
              layout
              transition={{ duration: 0.7, ease: EASE }}
              className={cx(
                'relative block overflow-hidden transition-opacity duration-500',
                wide ? 'w-[8.5rem] opacity-100' : 'w-0 opacity-0',
              )}
            >
              <Logo word alt="" className={cx('w-[8.5rem] transition-opacity duration-500', markDark && 'opacity-0')} />
              {/* The overlay is positioned by its own wrapper, never by a
                  class on `Logo`: the crop box sets `relative` itself, and
                  `absolute` passed alongside it LOSES -- Step 4.7 did exactly
                  that, so the light copy stacked under the dark one, doubled
                  the wordmark's height and held it 7px off centre. */}
              <span
                className={cx(
                  'absolute inset-x-0 top-0 transition-opacity duration-500',
                  markDark ? 'opacity-100' : 'opacity-0',
                )}
              >
                <Logo word light alt="" className="w-[8.5rem]" />
              </span>
            </motion.span>
          </Link>

          <nav ref={linksRef} aria-label="Main" className="relative ml-auto hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={cx(
                  'group/roll relative whitespace-nowrap px-3.5 py-2 font-sans text-ui transition-colors duration-500',
                  linksDark ? 'text-white' : 'text-ink',
                )}
              >
                <RollText>{item.label}</RollText>
              </NavLink>
            ))}
          </nav>

          <div ref={actionRef} className="relative ml-auto flex shrink-0 lg:ml-0">
            <Link
              to="/contact"
              className={cx(
                'group/roll hidden shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 font-sans text-ui transition-colors duration-300 lg:inline-flex',
                actionDark ? 'bg-paper text-ink hover:bg-clay-soft' : 'bg-ink text-paper hover:bg-clay',
              )}
            >
              <RollText>Book a Consultation</RollText>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={cx(
                'group/roll inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-sans text-ui transition-colors duration-300 lg:hidden',
                actionDark ? 'bg-paper text-ink' : 'bg-ink text-paper',
              )}
            >
              <MenuGlyph open={open} reduced={reduced} />
              <RollText>{open ? 'Close' : 'Menu'}</RollText>
            </button>
          </div>
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
