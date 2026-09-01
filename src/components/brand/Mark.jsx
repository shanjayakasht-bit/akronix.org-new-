import { cx } from '../../lib/cx'

/* The Akronix mark. A monogram A drawn at one stroke weight, with the crossbar
 * carried in vermilion and extended past both diagonals -- so it reads as a
 * letter and as a line joining two things, which is the studio's whole argument.
 *
 * Deliberately not an icon from a set. Sharp terminals, no rounded joins, no
 * gradient, no container shape. It is drawn to sit beside Newsreader.
 */
export function Mark({ className, accent = true, title, ...rest }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      className={cx('block', className)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {/* apex is clipped flat -- a pure point reads soft at small sizes */}
      <path
        d="M4.5 28 L14 4 L18 4 L27.5 28"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <path
        d="M6.5 19.5 L25.5 19.5"
        stroke={accent ? 'var(--color-clay)' : 'currentColor'}
        strokeWidth="2.25"
        strokeLinecap="butt"
      />
    </svg>
  )
}
