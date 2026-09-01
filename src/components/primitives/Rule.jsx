import { cx } from '../../lib/cx'

/* The primary structural device. Hairlines do the work cards and shadows would
   otherwise do -- a document set by hand rather than a page of modules. */
export function Rule({ className, ...rest }) {
  return <hr className={cx('border-0 border-t border-rule', className)} {...rest} />
}
