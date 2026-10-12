import { cx } from '../../lib/cx'

/* The section marker: a short red bar -- the I of the wordmark, stood on end --
 * then an optional index and the label, in small tracked capitals.
 *
 * It was a pill with a leading rule in the cream design; it is a plain label
 * now. `Pill` is kept as an alias so older call sites still resolve. */
export function Label({ onDark = false, tone, index, className, children, ...rest }) {
  const dark = onDark || tone === 'onDark'
  return (
    <span
      className={cx(
        'inline-flex items-center gap-3 font-sans text-mark font-medium uppercase',
        dark ? 'text-white/75' : 'text-ink-2',
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true" className={cx('h-[0.95em] w-[3px] shrink-0', dark ? 'bg-brand-soft' : 'bg-brand')} />
      {index ? <span className={cx('tnum', dark ? 'text-white/45' : 'text-ink-3')}>{index}</span> : null}
      {children}
    </span>
  )
}

export const Pill = Label
