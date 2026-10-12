import { cx } from '../../lib/cx'

/* One line glyph, drawn for this site: 24-unit box, 1.6 stroke, round joins.
 * It is the chevron on every control that opens something (the nav's Home icon
 * that shared this file became a word in Step 7). They are all the icons the site has -- the decorative sets that
 * once labelled pillars, products and advantages were removed in Step 6, where
 * a number and a word do that job. */
function G({ className, children, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round"
      strokeLinejoin="round" stroke="currentColor" aria-hidden="true"
      className={cx('block', className)} {...rest}>{children}</svg>
  )
}

export const Chevron = (p) => <G {...p}><path d="m6.5 9.5 5.5 5.5 5.5-5.5" /></G>
