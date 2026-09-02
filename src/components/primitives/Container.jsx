import { cx } from '../../lib/cx'

/* Container 1280, outer margin 20 / 40.
 *
 * The gutter was a flat 40px at every width, which is 21% of a 375px screen
 * gone before anything is drawn -- it left the booking card at 295px and put
 * the hero's four capabilities beyond any legible size on one line. 20px below
 * `md` is a real margin still, and it is what every one-line ask on the phone
 * is paid for out of. Above `md` nothing moves. */
export function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx('mx-auto w-full max-w-7xl px-5 md:px-10', className)} {...rest}>
      {children}
    </Tag>
  )
}

/* 12 columns, 24px gutter. Content sits in cols 1-7 or 6-12 -- never centred. */
export function Grid({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx('grid grid-cols-4 gap-6 md:grid-cols-12', className)} {...rest}>
      {children}
    </Tag>
  )
}
