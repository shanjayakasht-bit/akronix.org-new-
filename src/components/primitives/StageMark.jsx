import { cx } from '../../lib/cx'

/* States what something actually is: IN DEVELOPMENT, SPEC COMPLETE, LAUNCHING.
   The dot is a circle -- a shape, not a border radius. */
export function StageMark({ active = false, className, children, ...rest }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 font-mono text-mark uppercase',
        active ? 'text-ink-2' : 'text-ink-3',
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cx('size-1.5 shrink-0 rounded-full', active ? 'bg-signal' : 'bg-ink-3')}
      />
      {children}
    </span>
  )
}
