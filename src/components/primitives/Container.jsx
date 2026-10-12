import { cx } from '../../lib/cx'

/* The page measure: 1440px, with a 20 / 32 / 48px gutter by breakpoint.
 *
 * Step 6 widened it from 1280 and made the gutter proportional: corporate
 * layouts are set on a wide, strict grid, and at the client's 1512px screen
 * the old 1280 measure left ~120px of nothing either side. `wide` lifts it to
 * 1664 for the few places that should run closer to the edges. */
export function Container({ as: Tag = 'div', wide = false, className, children, ...rest }) {
  return (
    <Tag
      className={cx('mx-auto w-full px-5 md:px-8 lg:px-12', wide ? 'max-w-[104rem]' : 'max-w-[90rem]', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* 12 columns, 24px gutter. */
export function Grid({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx('grid grid-cols-4 gap-6 md:grid-cols-12', className)} {...rest}>
      {children}
    </Tag>
  )
}
