import { cx } from '../../lib/cx'

/* Container 1280, outer margin 24 / 64. */
export function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cx('mx-auto w-full max-w-7xl px-10 lg:px-10', className)} {...rest}>
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
