import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { Container } from '../primitives'
import { Button } from '../ui/Button'
import { RollText } from '../ui/RollText'
import { PriceLadder } from '../pricing/PriceLadder'
import { WorkIndex, StepsRail } from './HeroVisuals'
import HeroShowcase from './HeroShowcase'
import { NAV_PULL } from '../../lib/navPull'
import { cx } from '../../lib/cx'
import { useReady } from '../../lib/useReady'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { two } from '../../lib/studioTime'
import { heroSlides } from '../../content/home'

/* How long each slide stays, in ms. The tab's fill (`.akx-slide` in index.css) is
   the same length: keep the two together. */
const DWELL = 7000

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const STAGGER = ['delay-[0ms]', 'delay-[120ms]', 'delay-[240ms]']

/* The first screen (Step 7.4: slides).
 *
 * Step 7.3 gave it the look of a large company's -- a plain statement, a split
 * layout, a launcher of the twelve products on the right. The client's reply was
 * that it was still not interesting, and that the products "are displayed again
 * and again": the hero showed them, then the products section, then the menu.
 *
 * So the products are gone from it, and it is four slides, the way the big
 * companies' first screens are (IBM, Infosys, Cognizant, Zoho all rotate a few
 * messages). Each is a different true thing about the studio with its own
 * picture -- who and where it is (an interface preview), what it does (the eight lines of
 * work), how a job runs (five steps), what it costs (the price columns). See
 * `heroSlides` in `content/home.js` and `HeroVisuals`.
 *
 * The slides change by themselves every seven seconds while the hero is on
 * screen, which is the reason for the rest: a pointer or focus on it holds it, a
 * Pause control stops it, the four tabs under it go to any slide and fill as the
 * time runs, and with reduced motion it never moves unprompted. Slides are
 * stacked in one grid cell so the hero never changes height, and a slide that is
 * not showing is `inert`. Everything is CSS transitions (decision 20), so it
 * also works on a refresh.
 *
 * Layout and ground are unchanged from 7.3: white left, a grey panel behind the
 * picture from `lg`, reaching up under the nav pill (`NAV_PULL`). */
export default function Hero() {
  const ready = useReady()
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const onScreen = useInView(ref)
  const [at, setAt] = useState(0)
  /* held: a pointer or focus is on the hero. paused: the visitor pressed Pause. */
  const [held, setHeld] = useState(false)
  const [paused, setPaused] = useState(false)
  const playing = !reduced && onScreen && !held && !paused
  const n = heroSlides.length

  useEffect(() => {
    if (!playing) return undefined
    const t = setTimeout(() => setAt((a) => (a + 1) % n), DWELL)
    return () => clearTimeout(t)
  }, [playing, at, n])

  /* A slide's parts arrive one after another when it comes up and leave at once. */
  const part = (on, k) =>
    cx(
      'transition-[opacity,translate,visibility] ease-[cubic-bezier(0.16,1,0.3,1)]',
      on ? cx('visible translate-y-0 opacity-100 duration-[800ms]', STAGGER[k]) : 'invisible translate-y-4 opacity-0 duration-300 delay-[0ms]',
    )

  const visuals = [
    (on) => <HeroShowcase on={on} />,
    (on) => <WorkIndex on={on} />,
    (on) => <StepsRail on={on} />,
    (on) => <PriceLadder play={on} caption={false} className="mx-auto h-full w-full max-w-[24rem] justify-center" />,
  ]

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Akronix"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      className="relative"
    >
      <div className={cx('relative isolate bg-white text-ink lg:bg-gradient-to-r lg:from-white lg:from-[58.3%] lg:to-mist lg:to-[58.3%]', NAV_PULL)}>
        <Container wide>
          <div className="grid items-center gap-12 py-14 md:py-20 lg:min-h-[calc(100svh-5.125rem-6.5rem)] lg:grid-cols-12 lg:gap-12 lg:py-10">
            {/* the words */}
            <div className="grid lg:col-span-7">
              {heroSlides.map((s, i) => {
                const on = ready && at === i
                const Heading = i === 0 ? 'h1' : 'h2'
                return (
                  <div
                    key={s.key}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${n}`}
                    aria-hidden={!on}
                    inert={!on}
                    className="col-start-1 row-start-1"
                  >
                    <Heading className={cx('max-w-[14ch] text-balance font-light text-[clamp(2.75rem,1.3rem+4.4vw,5.25rem)] leading-[1.04] tracking-[-0.035em] sm:max-w-[16ch] lg:max-w-[15ch]', part(on, 0))}>
                      <span className="sr-only">
                        {s.headline.lead} {s.headline.rest}.
                      </span>
                      <span aria-hidden="true">
                        {s.headline.lead} <span className="text-ink-3">{s.headline.rest}</span>
                        <span className="text-brand">.</span>
                      </span>
                    </Heading>
                    <p className={cx('mt-8 max-w-[52ch] font-sans text-lede text-ink-2', part(on, 1))}>{s.lede}</p>
                    <div className={cx('mt-10 flex flex-wrap items-center gap-x-8 gap-y-5', part(on, 2))}>
                      <Button to={s.primary.to}>{s.primary.label}</Button>
                      <Button to={s.secondary.to} variant="quiet">
                        {s.secondary.label}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* the picture */}
            <div className="-mx-5 bg-mist px-5 py-8 md:-mx-8 md:px-8 lg:mx-0 lg:bg-transparent lg:p-0 lg:col-span-5">
              <div className="grid min-h-[28rem] lg:min-h-[31rem]">
                {heroSlides.map((s, i) => {
                  const on = ready && at === i
                  return (
                    <div key={s.key} aria-hidden={!on} inert={!on} className={cx('col-start-1 row-start-1 flex flex-col', part(on, 1))}>
                      <p className="flex items-baseline justify-between gap-4 font-sans text-mark font-medium uppercase text-ink-3">
                        <span>{s.caption}</span>
                        <span className="tnum">
                          {two(i + 1)} / {two(n)}
                        </span>
                      </p>
                      <div className="mt-6 flex-1">{visuals[i](on)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* the tabs: any slide, and the time left on the one showing */}
      <div className="border-y border-rule bg-white">
        <Container wide>
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
            {heroSlides.map((s, i) => {
              const on = at === i
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-current={on ? 'true' : undefined}
                  aria-label={`Show slide ${i + 1}: ${s.tab}`}
                  onClick={() => setAt(i)}
                  className="group/roll relative border-rule py-5 pr-6 text-left even:border-l even:pl-6 sm:border-l sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
                >
                  <span aria-hidden="true" className="absolute inset-x-0 -top-px h-[2px] bg-ink/10" />
                  {on ? (
                    playing ? (
                      <span key={`fill-${at}`} aria-hidden="true" className="akx-slide absolute inset-x-0 -top-px h-[2px] origin-left bg-brand" />
                    ) : (
                      <span aria-hidden="true" className="absolute inset-x-0 -top-px h-[2px] bg-ink" />
                    )
                  ) : null}
                  <span className={cx('tnum block font-sans text-mark transition-colors duration-300', on ? 'text-brand' : 'text-ink-3')}>{two(i + 1)}</span>
                  <span className={cx('mt-1.5 block font-display text-[1.125rem] leading-snug tracking-[-0.015em] transition-colors duration-300', on ? 'text-ink' : 'text-ink-3 group-hover/roll:text-ink')}>
                    <RollText>{s.tab}</RollText>
                  </span>
                </button>
              )
            })}
            {reduced ? null : (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className="group/roll hidden items-center gap-3 border-l border-rule pl-6 font-sans text-ui font-medium text-ink sm:inline-flex"
              >
                <RollText>{paused ? 'Play' : 'Pause'}</RollText>
              </button>
            )}
          </div>
        </Container>
      </div>
    </section>
  )
}
