import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react'
import { Rising, letterRange } from '../motion/RisingLetters'
import { Container } from '../primitives'
import { Button } from '../ui/Button'
import { cx } from '../../lib/cx'
import { Logo } from '../brand/Logo'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { hero } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect
/* Seconds the headline takes to stand up, start of the first letter to end of
   the last. Played once on load and never again. */
const INTRO = 1.5

/* Hero, split in two: type on the left, the demo video on the right.
 *
 * ---- The video's path ----------------------------------------------------
 *
 * The frame travels to the middle of the screen and grows the whole time. Both
 * start on the first scroll -- there is no frozen stretch and no pause.
 *
 *   0 -> 0.45   TRAVEL. The frame's centre moves from its place beside the
 *               headline to the centre of the screen.
 *   0 -> 0.72   GROWTH, running underneath the travel. Eased, so it is slow
 *               early: by the time the frame is wide enough to reach the type,
 *               the hero has already scrolled off.
 *   0.72 - 0.86 Full bleed.
 *   0.86 -> 1   Shrinks back to a rounded frame and releases.
 *
 * The corners are not on a schedule at all. The radius is derived from how
 * close the frame is to the screen edges, so it stays round the whole way out
 * and squares off only once the frame is actually touching them -- which makes
 * the entry and the exit symmetrical for free.
 *
 * ---- Why the geometry is measured rather than written in vw --------------
 *
 * The headline, the capability row and the nav are all positioned against the
 * page's content column; the video used to be positioned against the screen
 * edge. Three different rulers, so nothing lined up. The rest frame is now
 * measured off the type column itself: its right edge lands on the content
 * column's right edge, and its bottom edge lands on the bottom of the buttons.
 */
const TRAVEL_END = 0.45
const GROW_END = 0.72
const HOLD_END = 0.86

const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t)
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/* The frame is placed with left/top, so it can never sit outside the screen. */
function clampInto(v, outer, size) {
  const lo = Math.min(0, outer - size)
  const hi = Math.max(0, outer - size)
  return Math.min(Math.max(v, lo), hi)
}

function useIsDesktop() {
  const [is, setIs] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setIs(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return is
}

function VideoFrame() {
  if (hero.videoUrl) {
    return (
      <video
        className="h-full w-full object-cover"
        src={hero.videoUrl}
        poster={hero.videoPoster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
      />
    )
  }

  /* Placeholder, plainly labelled. Deliberately NOT a mocked-up product
     screen: nothing has shipped, and a fabricated demo is the exact thing
     this rebuild exists to remove. Set hero.videoUrl to replace it. */
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-coal">
      <Logo mono className="h-20 opacity-60" alt="" />
      <p className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-paper/40">Demo video</p>
    </div>
  )
}

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const desktop = useIsDesktop()
  const pinned = desktop && !reduced

  const track = useRef(null)
  const row = useRef(null)
  const caps = useRef(null)
  const stage = useRef(null)
  const [rest, setRest] = useState(null)

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ['start start', 'end end'],
  })

  const mLeft = useMotionValue(0)
  const mTop = useMotionValue(0)
  const mWidth = useMotionValue(0)
  const mHeight = useMotionValue(0)
  const mRadius = useMotionValue(28)

  /* Measure the rest frame off the type column, so the two share a ruler. */
  useIso(() => {
    const el = row.current
    const st = stage.current
    if (!el || !st || !pinned) return undefined

    const measure = () => {
      const r = el.getBoundingClientRect()
      /* Full-bleed size comes from the pinned layer itself, not from
         `clientWidth`. Read once at mount, `clientWidth` can still be 1280
         while the vertical scrollbar is settling -- the frame then overflows by
         the scrollbar's width and the page grows a horizontal scrollbar at full
         bleed. Measuring the layer makes it self-correcting. */
      const sr = st.getBoundingClientRect()
      const vw = sr.width
      const vh = sr.height
      const gutter = vw - (r.left + r.width)
      const w = r.width * 0.5
      const bottom = r.top + window.scrollY + r.height

      /* Bottom edge is the anchor -- it sits on the same line as the bottom of
         the buttons. 16:10 from there, unless that would take the top up into
         the capability row, in which case the frame is shortened rather than
         allowed to cover it. */
      let top = bottom - w / 1.6
      const ceiling = caps.current
        ? caps.current.getBoundingClientRect().bottom + window.scrollY + 32
        : 0
      if (top < ceiling) top = ceiling
      const h = bottom - top

      setRest({ vw, vh, w, h, cx: vw - gutter - w / 2, cy: bottom - h / 2 })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    ro.observe(st)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const applyFrame = useCallback(
    (p) => {
      if (!rest) return
      const { vw, vh, w: RW, h: RH, cx: RCX, cy: RCY } = rest

      let w
      let h
      let cx
      let cy

      if (p <= HOLD_END) {
        const g = easeInOut(clamp01(p / GROW_END))
        w = lerp(RW, vw, g)
        h = lerp(RH, vh, g)
        const t = easeInOut(clamp01(p / TRAVEL_END))
        cx = lerp(RCX, vw / 2, t)
        cy = lerp(RCY, vh / 2, t)
      } else {
        const e = easeInOut(clamp01((p - HOLD_END) / (1 - HOLD_END)))
        w = lerp(vw, vw * 0.76, e)
        h = lerp(vh, vh * 0.64, e)
        cx = vw / 2
        cy = vh / 2
      }

      /* Radius from proximity to the edges, not from the clock. */
      const edge = Math.min((w / vw - 0.94) / 0.06, (h / vh - 0.93) / 0.07)

      mWidth.set(w)
      mHeight.set(h)
      mLeft.set(clampInto(cx - w / 2, vw, w))
      mTop.set(clampInto(cy - h / 2, vh, h))
      mRadius.set(28 * (1 - clamp01(edge)))
    },
    [rest, mWidth, mHeight, mLeft, mTop, mRadius],
  )

  useMotionValueEvent(scrollYProgress, 'change', applyFrame)
  useEffect(() => {
    applyFrame(scrollYProgress.get())
  }, [applyFrame, scrollYProgress])

  /* The headline uses the same hinge as the two scrolled headings, but this one
     is *played*, not scrubbed: it runs once when the page loads and never
     again. The hero is the first thing on the page, so there is no scroll to
     drive it with, and re-running it on every pass up would be noise.

     The driver is one MotionValue walked 0 -> 1 over `INTRO`; each letter takes
     its own slice of that. Linear here because the easing is applied per
     letter inside `Rising`. */
  const intro = useMotionValue(0)
  useEffect(() => {
    if (reduced) {
      intro.set(1)
      return undefined
    }
    const run = animate(intro, 1, { duration: INTRO, ease: 'linear', delay: 0.2 })
    return () => run.stop()
  }, [reduced, intro])

  const fade = (d) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay: d },
        }

  /* The nav pill is sticky *in flow* and already occupies its own ~5rem at the
     top of the page, so the hero only accounts for the rest. Centring the
     content group is what closes the dead band that used to open above the
     headline -- spare height now splits evenly instead of piling on top. */
  const heroFrame =
    'flex min-h-[calc(100svh-5rem)] flex-col  gap-1 pb-1 pt-7 md:gap-7 md:pb-1 md:pt-7'

  /* One continuous letter count across the three lines, so the stand-up runs
     through the whole headline rather than restarting on each word. */
  let seen = 0
  const headlineLines = hero.headline.map((word) => {
    const from = seen
    seen += word.length
    return { word, from }
  })

  const heading = (
    <h1 className="text-[clamp(2.5rem,min(29vw,30svh),7rem)] leading-[0.94] tracking-[-0.035em] text-ink">
      {/* Split into letters, so the real line is carried once for a reader and
          the pieces are hidden from it. */}
      <span className="sr-only">{hero.headline.join(' ')}</span>

      {headlineLines.map(({ word, from }, i) => (
        <span
          key={word}
          aria-hidden="true"
          className={cx('block pb-[0.06em] font-serif', i === 1 && 'italic text-clay')}
        >
          {[...word].map((ch, j) => {
            const [a, b] = letterRange(from + j, seen)
            return (
              <Rising key={`${ch}-${j}`} progress={intro} start={a} end={b}>
                {ch}
              </Rising>
            )
          })}
        </span>
      ))}
    </h1>
  )

  const actions = (
    <motion.div className="mt-2 flex flex-wrap items-center gap-3" {...fade(0.6)}>
      <Button to="/contact">Get Started</Button>
      <Button to="/building" variant="outline">
        Explore Products
      </Button>
    </motion.div>
  )

  const capabilities = (
    <motion.ul className="flex flex-wrap items-center gap-x-8 gap-y-2" {...fade(0)}>
      {hero.capabilities.map((c) => (
        <li key={c} className="flex items-center gap-2.5 font-sans text-ui text-ink-2">
          <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-clay" />
          {c}
        </li>
      ))}
    </motion.ul>
  )

  const heroBody = (
    <header className={heroFrame}>
      <Container>
        <div ref={caps}>{capabilities}</div>
      </Container>
      <Container>
        {/* The video's ruler. Its width is the content column; its height is the
            type block, which is what puts the frame's bottom edge on the same
            line as the bottom of the buttons. */}
        <div ref={row} className="relative">
          <div className="lg:w-[46%]">
            {heading}
            {actions}
          </div>

          {!pinned ? (
            <div className="mt-12 aspect-[16/10] overflow-hidden rounded-[28px] bg-coal">
              <VideoFrame />
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  )

  if (!pinned) return heroBody

  return (
    <div ref={track} className="relative">
      <div className="relative z-10">{heroBody}</div>

      {/* The screen the video takes over. Empty on purpose -- it is scroll
          length, and the pinned frame is what fills it. */}
      <div aria-hidden="true" className="h-[260vh]" />

      {/* The layer reaches 4.875rem above the track -- the exact height the nav
          pill occupies in flow. Without it the frame spends the first 78px of
          scroll settling upward before it pins, and that settle eats the start
          of the movement. */}
      <div className="pointer-events-none absolute -top-[4.875rem] bottom-0 left-0 right-0 z-0">
        <div ref={stage} className="sticky top-0 h-screen">
          <motion.div
            style={{
              left: mLeft,
              top: mTop,
              width: mWidth,
              height: mHeight,
              borderRadius: mRadius,
            }}
            className="pointer-events-auto absolute overflow-hidden bg-coal"
          >
            <VideoFrame />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
