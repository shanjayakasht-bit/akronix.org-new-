import { cx } from '../../lib/cx'

/* Hierarchy is carried by size and space, not weight. Everything sits at 400,
   which is both more editorial and why the no-bold rule never needs its
   main-heading exception. */

export function Display({ as: Tag = 'h1', className, children, ...rest }) {
  return (
    <Tag className={cx('text-display font-normal text-balance', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function H1({ as: Tag = 'h1', className, children, ...rest }) {
  return (
    <Tag className={cx('text-h1 font-normal text-balance', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function H2({ as: Tag = 'h2', className, children, ...rest }) {
  return (
    <Tag className={cx('text-h2 font-normal text-balance', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function H3({ as: Tag = 'h3', className, children, ...rest }) {
  return (
    <Tag className={cx('text-h3 font-normal', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function Lede({ as: Tag = 'p', className, children, ...rest }) {
  return (
    <Tag className={cx('text-lede text-ink-2 measure', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function Body({ as: Tag = 'p', className, children, ...rest }) {
  return (
    <Tag className={cx('text-body measure', className)} {...rest}>
      {children}
    </Tag>
  )
}

/* Interface text: nav, buttons, labels, form fields. */
export function UI({ as: Tag = 'span', className, children, ...rest }) {
  return (
    <Tag className={cx('font-sans text-ui', className)} {...rest}>
      {children}
    </Tag>
  )
}

/* The annotation layer. Mono is reserved for facts -- stage, dates, prices,
   counts -- and is never decorative. */
export function Mark({ as: Tag = 'span', className, children, ...rest }) {
  return (
    <Tag className={cx('font-mono text-mark uppercase text-ink-3', className)} {...rest}>
      {children}
    </Tag>
  )
}
