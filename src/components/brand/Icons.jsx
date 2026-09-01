import { cx } from '../../lib/cx'

/* Drawn for this site, in the mark's language: 32-unit box, one stroke weight,
 * butt terminals, miter joins, and exactly one element carried in vermilion.
 * Not a stock set -- they exist to label the four kinds of work, which is an
 * informational job, not decoration.
 */
function Frame({ className, children, ...rest }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth="1.75"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={cx('block', className)}
      {...rest}
    >
      {children}
    </svg>
  )
}

/* A screen: the frame is the build, the vermilion rule is the thing running. */
export function IconSoftware(props) {
  return (
    <Frame {...props}>
      <rect x="3.5" y="6.5" width="25" height="19" stroke="currentColor" />
      <path d="M3.5 12.5 H28.5" stroke="var(--color-clay)" />
      <path d="M11 25.5 V29" stroke="currentColor" />
      <path d="M21 25.5 V29" stroke="currentColor" />
    </Frame>
  )
}

/* A spine with branches: work handed from one system to the next. */
export function IconAutomation(props) {
  return (
    <Frame {...props}>
      <path d="M7 5 V27" stroke="currentColor" />
      <path d="M7 11 H21" stroke="currentColor" />
      <path d="M7 21 H21" stroke="var(--color-clay)" />
      <rect x="21" y="8" width="6" height="6" stroke="currentColor" />
      <rect x="21" y="18" width="6" height="6" stroke="var(--color-clay)" />
    </Frame>
  )
}

/* A climb, with the last leg in vermilion: the part that is actually measured. */
export function IconMarketing(props) {
  return (
    <Frame {...props}>
      <path d="M3.5 27.5 H28.5" stroke="currentColor" />
      <path d="M5 22 L12 16 L18 19" stroke="currentColor" />
      <path d="M18 19 L28 7" stroke="var(--color-clay)" />
      <path d="M22 7 H28 V13" stroke="var(--color-clay)" />
    </Frame>
  )
}

/* One to one: two parties, a line between them, one of them further along. */
export function IconMentorship(props) {
  return (
    <Frame {...props}>
      <path d="M10 21 L22 11" stroke="currentColor" />
      <rect x="4" y="18" width="7" height="7" stroke="currentColor" />
      <rect x="21" y="7" width="7" height="7" stroke="var(--color-clay)" />
    </Frame>
  )
}

export const serviceIcons = {
  Software: IconSoftware,
  'AI and automation': IconAutomation,
  Marketing: IconMarketing,
  'Mentorship and training': IconMentorship,
}
