import { cx } from '../../lib/cx'

/* The Akronix logo, as supplied: the figure mark stacked over the AKRONIX
 * wordmark with the I in vermilion. It carries an alpha channel, so it sits
 * straight on the cream page with no plate behind it.
 *
 * Because the wordmark is part of the artwork, nowhere that uses this should
 * set the studio name in type beside it -- that reads as the name twice.
 *
 * `mono` renders it flat white for dark grounds. `brightness-0` crushes every
 * channel to black first, so `invert` lands on pure white rather than the
 * inverse of each colour -- which is what stops the red I turning cyan. The
 * accent is lost in that state, which is the usual trade for a one-colour
 * lockup on a dark field.
 *
 * `mark` crops to the figure alone, for the nav bar, where the stacked lockup
 * would put the wordmark at 8px and turn it into a smudge. The numbers: the
 * window is square, the artwork is sized to 142% of it and top-aligned, so the
 * visible band is the top ~70% of a 555x407 image -- which is exactly where
 * the figure sits, ending just above the wordmark. Change the artwork and
 * these two numbers have to be re-derived. */
const SRC = '/logo/logo-new.webp'

export function Logo({ className, mono = false, mark = false, alt = 'Akronix', ...rest }) {
  const tone = mono ? 'brightness-0 invert' : undefined

  if (mark) {
    return (
      <span className={cx('relative block aspect-square overflow-hidden', className)}>
        <img
          src={SRC}
          alt={alt}
          draggable="false"
          className={cx('absolute left-1/2 top-0 h-[142%] max-w-none -translate-x-1/2 select-none', tone)}
          {...rest}
        />
      </span>
    )
  }

  return (
    <img
      src={SRC}
      alt={alt}
      width={555}
      height={407}
      draggable="false"
      className={cx('block w-auto select-none', tone, className)}
      {...rest}
    />
  )
}
