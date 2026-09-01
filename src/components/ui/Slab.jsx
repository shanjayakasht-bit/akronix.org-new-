import { forwardRef } from 'react'
import { cx } from '../../lib/cx'

/* A section that sits ON the cream page as a rounded block rather than
 * running edge to edge. Taken from the reference sites: the cream showing at
 * the margins is what stops a long page reading as a stack of flat bands. */
const TONES = {
  cream: 'bg-paper text-ink',
  sand: 'bg-mist text-ink',
  panel: 'bg-panel text-ink',
  forest: 'bg-forest text-paper',
  coal: 'bg-coal text-paper',
  cocoa: 'bg-cocoa text-paper',
}

export const Slab = forwardRef(function Slab(
  { as: Tag = 'section', tone = 'cream', flush = false, className, children, ...rest },
  ref,
) {
  return (
    <div className={cx('px-3 md:px-5', flush && 'px-0 md:px-0')}>
      <Tag
        ref={ref}
        className={cx(
          'relative overflow-hidden py-12 md:py-12 lg:py-12',
          !flush && 'rounded-slab',
          TONES[tone],
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    </div>
  )
})
