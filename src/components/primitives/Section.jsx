import { cx } from '../../lib/cx'
import { Container } from './Container'

/* Section rhythm: 64 / 96 / 160 by breakpoint. */
export function Section({ as: Tag = 'section', tone, bare = false, className, children, ...rest }) {
  const body = bare ? children : <Container>{children}</Container>

  return (
    <Tag
      className={cx(
        'py-16 md:py-24 lg:py-40',
        tone === 'night' && 'bg-night text-paper',
        tone === 'panel' && 'bg-panel',
        tone === 'sand' && 'bg-sand',
        tone === 'clay' && 'bg-clay',
        className,
      )}
      {...rest}
    >
      {body}
    </Tag>
  )
}
