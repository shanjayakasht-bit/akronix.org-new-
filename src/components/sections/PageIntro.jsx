import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { Button } from '../ui/Button'
import { Counter } from '../motion/Counter'
import { useScrollToId } from '../../lib/useScrollToId'
import { cx } from '../../lib/cx'
import { NAV_PULL } from '../../lib/navPull'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* The opening of every inner page (Step 6), built the way enterprise inner
 * pages are: a breadcrumb, a large light headline set left, the page's one
 * sentence and its buttons in a narrow column to the right, and under them a
 * row of facts.
 *
 * It was a centred, cream, per-letter headline with a clay italic middle line.
 * Centred type is how a template says "hero"; a headline on the left with its
 * explanation beside it is how an organisation does.
 *
 * `hero` is { crumb, headline: [3 lines], lede, primary, secondary, facts }.
 * `dark` sets it on black; `glossy` sets the facts as rounded glazed tiles (the
 * pricing page, Step 7); `children` render between the headline and the facts
 * row (the products page puts its spectrum there, the About page its sound
 * switch). `aside` is a decorative node set in the empty end of the headline's
 * eight columns from 1280 up, behind the type (the About page's figure); it is
 * hidden from assistive tech and takes no pointer events.
 * A button with `to` is a route; one with `href` is an in-page anchor.
 *
 * The facts are the page's own true numbers and terms -- twelve products, eight
 * lines of work, thirty minutes -- never a result or a count of anything that
 * has happened. A number counts up as it arrives; a string just sets.
 *
 * Headline size is a width term only. Each line is held to about 16 characters
 * and set `nowrap`, so the longest ("Built to Power", "Tell us what") stays
 * inside the 8 columns it has at 1512, and on a phone 12vw keeps it in the
 * column. */
function Fact({ value, label, i, reduced, dark, glossy }) {
  return (
    <motion.li
      className={cx(
        glossy
          ? 'gloss rounded-[1.75rem] p-7'
          : cx('border-t py-7 pr-6 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 lg:border-t-0 lg:pr-8', dark ? 'border-white/12' : 'border-rule'),
      )}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.7 + i * 0.08 }}
    >
      <p className={cx('font-display text-h2 font-light tracking-[-0.03em]', dark ? 'text-white' : 'text-ink')}>
        {typeof value === 'number' ? <Counter to={value} /> : value}
      </p>
      <p className={cx('mt-2 max-w-[22ch] font-sans text-ui', dark ? 'text-white/60' : 'text-ink-2')}>{label}</p>
    </motion.li>
  )
}

export default function PageIntro({ hero, dark = false, glossy = false, aside, children }) {
  const reduced = usePrefersReducedMotion()
  const scrollTo = useScrollToId()

  const fade = (d) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay: d },
        }

  const buttons = [
    { b: hero.primary, variant: dark ? 'onDark' : 'primary' },
    { b: hero.secondary, variant: dark ? 'onDarkGhost' : 'outline' },
  ].filter(({ b }) => b)

  return (
    <header className={cx('relative isolate overflow-hidden border-b', NAV_PULL, dark ? 'border-white/12 bg-coal text-white' : 'border-rule bg-white')}>
      <Container wide>
        <motion.nav aria-label="Breadcrumb" className="pt-8 md:pt-10" {...fade(0)}>
          <ol className={cx('flex items-center gap-3 font-sans text-[0.8125rem]', dark ? 'text-white/50' : 'text-ink-3')}>
            <li>
              <Link to="/" className={cx('group/roll inline-block transition-colors duration-300', dark ? 'hover:text-white' : 'hover:text-ink')}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className={dark ? 'text-white' : 'text-ink'}>
              {hero.crumb}
            </li>
          </ol>
        </motion.nav>

        <div className="grid gap-12 pb-14 pt-10 md:pb-20 md:pt-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="relative lg:col-span-8">
            <h1 className={cx('font-light text-[clamp(2.75rem,min(13vw,1.25rem+5.8vw),7rem)] leading-[0.98] tracking-[-0.045em]', dark ? 'text-white' : 'text-ink')}>
              <span className="sr-only">{hero.headline.join(' ')}</span>
              {hero.headline.map((line, i) => (
                <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.1em]">
                  <motion.span
                    className="block whitespace-nowrap"
                    initial={reduced ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.11 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            {aside ? (
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden items-center xl:flex">
                {aside}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:pb-3">
            <motion.p className={cx('max-w-[40ch] font-sans text-lede', dark ? 'text-white/70' : 'text-ink-2')} {...fade(0.5)}>
              {hero.lede}
            </motion.p>
            {buttons.length ? (
              <motion.div className="mt-9 flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3" {...fade(0.62)}>
                {buttons.map(({ b, variant }) =>
                  b.to ? (
                    <Button key={b.label} to={b.to} variant={variant} size="compact" className="flex-auto justify-center whitespace-nowrap sm:flex-none">
                      {b.label}
                    </Button>
                  ) : (
                    <Button
                      key={b.label}
                      as="a"
                      href={b.href}
                      onClick={(e) => scrollTo(e, b.href.slice(1))}
                      variant={variant}
                      size="compact"
                      className="flex-auto justify-center whitespace-nowrap sm:flex-none"
                    >
                      {b.label}
                    </Button>
                  ),
                )}
              </motion.div>
            ) : null}
          </div>
        </div>

        {children}

        {hero.facts?.length ? (
          <ul
            className={cx(
              'grid sm:grid-cols-2 lg:grid-cols-4',
              glossy ? 'gap-4 pb-14' : cx('border-t', dark ? 'border-white/12' : 'border-rule'),
            )}
          >
            {hero.facts.map((f, i) => (
              <Fact key={f.label} value={f.value} label={f.label} i={i} reduced={reduced} dark={dark} glossy={glossy} />
            ))}
          </ul>
        ) : null}
      </Container>
    </header>
  )
}
