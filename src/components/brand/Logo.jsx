import { cx } from '../../lib/cx'

/* The Akronix logo, as supplied: the figure mark stacked over the AKRONIX
 * wordmark with the I in vermilion. It carries an alpha channel, so it sits
 * straight on the cream page with no plate behind it.
 *
 * Because the wordmark is part of the artwork, nowhere that uses this should
 * set the studio name in type beside it -- that reads as the name twice.
 *
 * `light` is the lockup for dark grounds: white figure and letters with the I
 * still red, as the client's logo has it (Step 4.7). It is a separate image,
 * `logo-new-light.webp`, generated from the original by turning every
 * non-red pixel white and leaving the red I and the alpha alone. A CSS filter
 * cannot do this: `brightness-0 invert` whitens the I with everything else,
 * and a plain `invert` turns it cyan.
 *
 * `mono` is the older flat-white treatment -- the accent is lost in it. Kept
 * for the one place that still wants a single colour; use `light` for the
 * logo proper.
 *
 * `mark` crops to the figure alone, for the nav bar, where the stacked lockup
 * would put the wordmark at 8px and turn it into a smudge. The numbers: the
 * window is square, the artwork is sized to 142% of it and top-aligned, so the
 * visible band is the top ~70% of a 555x407 image -- which is exactly where
 * the figure sits, ending just above the wordmark. The figure has no red in
 * it, so the nav tones it with filters.
 *
 * `word` crops to the AKRONIX wordmark alone, red I and all, for the nav name
 * (Step 4.7 -- it replaced the name typed in the sans). Measured off the
 * artwork: the letters sit in x 20-533, y 335-386 of 555x407. The window takes
 * x 18-535, y 333-388 -- a couple of pixels' air so antialiasing is not
 * shaved -- which is a 517x55 box: aspect 9.4, the image at 740% of its height
 * (407/55), shifted up 605.45% (333/55) and left 3.48% (18/517).
 *
 * Change the artwork and every number above has to be re-derived. */
const SRC = '/logo/logo-new.webp'
const SRC_LIGHT = '/logo/logo-new-light.webp'

export function Logo({ className, mono = false, light = false, mark = false, word = false, alt = 'Akronix', ...rest }) {
  const src = light ? SRC_LIGHT : SRC
  const tone = mono && !light ? 'brightness-0 invert' : undefined

  if (word) {
    return (
      <span className={cx('relative block aspect-[517/55] overflow-hidden', className)}>
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="absolute left-[-3.48%] top-[-605.45%] h-[740%] w-auto max-w-none select-none"
          {...rest}
        />
      </span>
    )
  }

  if (mark) {
    return (
      <span className={cx('relative block aspect-square overflow-hidden', className)}>
        <img
          src={src}
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
      src={src}
      alt={alt}
      width={555}
      height={407}
      draggable="false"
      className={cx('block w-auto select-none', tone, className)}
      {...rest}
    />
  )
}
