import { cx } from '../../lib/cx'

/* The site's signature device.
 *
 * The italic is reserved for the clause that limits, qualifies, or states the
 * actual stage of something -- never for emphasis, never decorative. It exists
 * so the page always says the qualifying half of a sentence out loud.
 *
 *   <H1>A studio in Chennai building business software
 *     <Qualifier>for clients, and for ourselves.</Qualifier>
 *   </H1>
 *
 * If you are reaching for this to stress a benefit, you want different copy.
 */
export function Qualifier({ className, children, ...rest }) {
  return (
    <em className={cx('italic', className)} {...rest}>
      {children}
    </em>
  )
}
