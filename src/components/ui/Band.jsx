import { forwardRef } from 'react'
import { cx } from '../../lib/cx'

/* A full-bleed section. The rounded slabs that grew into place as they were
 * scrolled (Steps 3h-4.8) are gone: sections run edge to edge, square, and are
 * told apart by their ground -- white, light grey, black -- the way enterprise
 * sites separate them. The change of ground is the transition.
 *
 * `tone` names the ground. The old tone names still resolve so any caller that
 * has not been rewritten keeps working: cream/panel -> white, sand -> grey,
 * forest/coal/cocoa -> black.
 *
 * `pad` is the vertical rhythm: `lg` is 96px on a phone and 128px from `md`,
 * which is the corporate pace; `md` is the tighter pair for a band that
 * belongs to the one above it. */
const TONES = {
  light: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  dark: 'bg-coal text-white',
  graphite: 'bg-graphite text-white',
  cream: 'bg-paper text-ink',
  panel: 'bg-paper text-ink',
  sand: 'bg-mist text-ink',
  forest: 'bg-coal text-white',
  coal: 'bg-coal text-white',
  cocoa: 'bg-graphite text-white',
}

const PAD = {
  lg: 'py-24 md:py-32',
  md: 'py-16 md:py-24',
  none: '',
}

export const Band = forwardRef(function Band(
  { as: Tag = 'section', tone = 'light', pad = 'lg', className, children, ...rest },
  ref,
) {
  return (
    <Tag ref={ref} className={cx('relative', TONES[tone], PAD[pad], className)} {...rest}>
      {children}
    </Tag>
  )
})

/* Callers written against the old name. */
export const Slab = Band
