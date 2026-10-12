import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { Label } from '../ui/Pill'
import { Button } from '../ui/Button'
import { HeroFigure } from '../brand/HeroFigure'
import ColourBar from './ColourBar'
import { NAV_PULL } from '../../lib/navPull'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { hero } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* The first screen (Step 7: LIGHT).
 *
 * Step 6 started the site black. The client's verdict was that a company
 * profile should not open black, so the hero is white now: ink type, the red
 * full stops, the Akronix figure drawn in ink with its head in red, and along
 * the foot of the screen a bar of the twelve product colours.
 *
 * The hero reaches up under the floating nav (`NAV_PULL`), so its grid lines and
 * its figure run behind the glass pill instead of the pill sitting on a
 * separate strip -- the nav is part of the screen, not above it.
 *
 * Behind everything, the page's column grid is drawn in hairlines: five lines,
 * each growing down from the top in turn. Corporate layouts are built on a
 * visible grid and this is it showing.
 *
 * Headline size: three lines must fit the screen with the lede, the buttons and
 * the foot strip under them, so it is the smaller of a width term and a height
 * term. "Connect." is the widest line, ~3.9x its font size in IBM Plex Sans
 * Light, so on a phone 19vw leaves it comfortably inside the column. The height
 * term budgets ~30rem for the nav, the foot strip and everything around the
 * lines, over 3.2 (three lines at 0.94 plus the mask padding); 9.5rem caps it. (33rem left a 66px headline on a
 * 1280x720 laptop; trimming the paddings and the strip bought it back.)
 *
 * Scroll: as the hero leaves, the headline lifts away faster than the figure
 * falls behind it, and the figure turns a few degrees -- two speeds, which is
 * what reads as depth. If a real film is supplied (`hero.videoUrl`) it is its
 * own band under this one -- see `Film`. */
export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const figY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const figRotate = useTransform(scrollYProgress, [0, 1], [0, 7])
  const figScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const fade = (d) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay: d },
        }

  return (
    <section ref={ref} className={cx('relative isolate overflow-hidden bg-white text-ink', NAV_PULL)}>
      {/* the grid, drawn */}
      <Container wide className="pointer-events-none absolute inset-0 -z-10">
        <div className="relative h-full">
          {['left-0', 'left-1/4', 'left-1/2', 'left-3/4', 'right-0'].map((pos, i) => (
            <motion.span
              key={pos}
              aria-hidden="true"
              className={`absolute inset-y-0 w-px origin-top bg-ink/[0.07] ${pos}`}
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.1 + i * 0.12 }}
            />
          ))}
        </div>
      </Container>

      <Container wide className="relative">
        <div className="grid items-center gap-10 py-8 lg:min-h-[calc(100svh-5.125rem-3.25rem)] lg:grid-cols-12 lg:py-10">
          <motion.div style={reduced ? undefined : { y: textY, opacity: fadeOut }} className="relative z-10 lg:col-span-7">
            <motion.div {...fade(0.1)}>
              <Label>Akronix &middot; Chennai, India</Label>
            </motion.div>

            <h1 className="mt-8 font-light text-[clamp(3.25rem,min(19vw,calc((100svh-30rem)/3.2)),9.5rem)] leading-[0.94] tracking-[-0.045em]">
              <span className="sr-only">{hero.headline.join(' ')}</span>
              {hero.headline.map((line, i) => {
                const stop = line.endsWith('.')
                return (
                  <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                    <motion.span
                      className="block whitespace-nowrap"
                      initial={reduced ? false : { y: '110%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 1.2, ease: EASE, delay: 0.25 + i * 0.12 }}
                    >
                      {stop ? line.slice(0, -1) : line}
                      {stop ? <span className="text-brand">.</span> : null}
                    </motion.span>
                  </span>
                )
              })}
            </h1>

            <motion.p className="mt-8 max-w-[54ch] font-sans text-lede text-ink-2" {...fade(0.75)}>
              {hero.lede}
            </motion.p>

            <motion.div className="mt-10 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3" {...fade(0.9)}>
              <Button to="/contact" size="snug" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                Get Started
              </Button>
              <Button to="/building" variant="outline" size="snug" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                Explore Products
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            style={reduced ? undefined : { y: figY, rotate: figRotate, scale: figScale }}
            className="relative flex items-center justify-center lg:col-span-5 lg:justify-end"
          >
            <HeroFigure tone="light" className="h-[clamp(16rem,52svh,40rem)] w-auto max-w-full lg:h-[clamp(17rem,56svh,40rem)]" />
          </motion.div>
        </div>

        {/* the foot of the hero: where, and a cue to scroll */}
        <motion.div
          className="flex items-center justify-between border-t border-rule py-3 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-ink-3"
          {...fade(1.2)}
        >
          <span>Chennai &middot; 13.08&deg;N 80.27&deg;E</span>
          <span className="inline-flex items-center gap-3">
            Scroll
            <span aria-hidden="true" className="relative block h-px w-12 overflow-hidden bg-ink/15">
              <motion.span
                className="absolute inset-y-0 left-0 w-1/2 bg-ink"
                animate={reduced ? undefined : { x: ['-100%', '200%'] }}
                transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
              />
            </span>
          </span>
        </motion.div>
      </Container>

      <ColourBar />
    </section>
  )
}
