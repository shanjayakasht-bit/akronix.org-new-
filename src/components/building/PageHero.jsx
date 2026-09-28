import { useEffect } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'
import { Rising, letterRange } from '../motion/RisingLetters'
import { Container } from '../primitives'
import { Button } from '../ui/Button'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { useScrollToId } from '../../lib/useScrollToId'
import { buildingHero } from '../../content/building'

const EASE = [0.16, 1, 0.3, 1]
/* Same run as the homepage headline, so the two pages arrive alike. */
const INTRO = 1.5

/* The /building hero. It is the homepage hero's type half on its own: the
 * headline that stands up letter by letter once on load, three lines with the
 * middle one in clay italic -- the same shape as "Build. / Connect. / Scale."
 * -- then the lede and the button pair.
 *
 * The words are the live products page's headline, "Our Products, Built to
 * Power Your Business", at the client's direction. The lede under it is what
 * states the real stage, so it must keep saying that nothing has shipped.
 *
 * No row of names above the headline. There was one, split by stage; the
 * client removed it (Step 4.4). The sticky index in the product section is
 * the page's index.
 *
 * Centred, and it has to be. The homepage hero can sit left because its video
 * holds the right half; without one, a left-set block left the right half of a
 * 1512px MacBook screen empty and the page read as off-centre -- the client's
 * report.
 *
 * It is NOT held to a full screen. Step 4.2 gave it the homepage hero's
 * `min-h-[calc(100svh-5rem)]` and centred the group in it; with no video to
 * fill that height, it padded the text with a band of empty cream above and
 * below, and the client flagged it on sight. Its height is its content now. */
export default function PageHero() {
  const reduced = usePrefersReducedMotion()
  const scrollTo = useScrollToId()

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

  /* One letter count across all three lines, so the stand-up runs through
     the whole headline rather than restarting on each line. */
  let seen = 0
  const lines = buildingHero.headline.map((line) => {
    const from = seen
    seen += line.replace(/\s/g, '').length
    return { line, from }
  })

  /* Measured in headless Chromium, not estimated: see STATUS.md Step 4.4 for
     the widest-line ratio of the current copy. The rule: widest-line ratio x
     the vw term must stay under the column (vw - 40px below `md`, vw - 80px
     above). Retune the vw term whenever the headline copy changes.

     Each word is its own nowrap span: the letters are inline-blocks, and
     without it a word breaks mid-word. */
  const heading = (
    <h1 className="text-[clamp(2.25rem,min(12vw,26svh),7rem)] leading-[0.94] tracking-[-0.035em] text-ink">
      <span className="sr-only">{buildingHero.headline.join(' ')}</span>

      {lines.map(({ line, from }, i) => {
        let n = from
        return (
          <span
            key={line}
            aria-hidden="true"
            className={cx(
              'block whitespace-nowrap pb-[0.06em] font-serif',
              i === 1 && 'italic text-clay',
            )}
          >
            {line.split(' ').map((word, w) => (
              <span key={`${word}-${w}`} className="mr-[0.24em] inline-block whitespace-nowrap last:mr-0">
                {[...word].map((ch, j) => {
                  const [a, b] = letterRange(n++, seen)
                  return (
                    <Rising key={`${ch}-${j}`} progress={intro} start={a} end={b}>
                      {ch}
                    </Rising>
                  )
                })}
              </span>
            ))}
          </span>
        )
      })}
    </h1>
  )

  return (
    <header className="pb-16 pt-12 md:pb-20 md:pt-16">
      <Container className="text-center">
        {heading}

        <motion.p
          className="mx-auto mt-8 max-w-[52ch] font-sans text-lede leading-relaxed text-ink-2 md:mt-10"
          {...fade(0.45)}
        >
          {buildingHero.lede}
        </motion.p>

        {/* The hero pair's arrangement: side by side on a phone at the compact
            size, each filling in proportion to its own label, and
            content-width again from `sm`. */}
        <motion.div
          className="mt-10 flex flex-nowrap items-center justify-center gap-2 sm:flex-wrap sm:gap-3"
          {...fade(0.6)}
        >
          <Button
            to={buildingHero.primary.to}
            size="compact"
            className="flex-auto justify-center whitespace-nowrap sm:flex-none"
          >
            {buildingHero.primary.label}
          </Button>
          <Button
            as="a"
            href={buildingHero.secondary.href}
            onClick={(e) => scrollTo(e, buildingHero.secondary.href.slice(1))}
            variant="outline"
            size="compact"
            className="flex-auto justify-center whitespace-nowrap sm:flex-none"
          >
            {buildingHero.secondary.label}
          </Button>
        </motion.div>
      </Container>
    </header>
  )
}
