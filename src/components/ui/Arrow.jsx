import { cx } from '../../lib/cx'

/* The arrow every control carries. Drawn, not a text character, so it is the
 * same weight as the type beside it at every size. */
export function Arrow({ className, ...rest }) {
  /* 1rem unless the caller names a size: `cx` is a plain join, so a default
     `h-4` next to a caller's `h-3` would be settled by stylesheet order and the
     default would win. */
  const sized = /(^|\s)([a-z]+:)*(h|w|size)-/.test(className ?? '')
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      className={cx('block shrink-0', !sized && 'h-4 w-4', className)}
      {...rest}
    >
      <path d="M1.5 8h12M9 3.5 13.5 8 9 12.5" />
    </svg>
  )
}
