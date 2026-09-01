import { cx } from '../../lib/cx'

/* Line glyphs drawn for this site: 24-unit box, 1.6 stroke, round joins.
 * They label pillars, products and advantages -- an informational job. */
function G({ className, children, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round"
      strokeLinejoin="round" stroke="currentColor" aria-hidden="true"
      className={cx('block', className)} {...rest}>{children}</svg>
  )
}

export const Code = (p) => <G {...p}><path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.5 5l-3 14" /></G>
export const Chart = (p) => <G {...p}><path d="M4 20h16M7 20v-6M12 20V8M17 20v-9" /></G>
export const Users = (p) => <G {...p}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M17 6.2a3 3 0 0 1 0 5.6M18.5 19a5.6 5.6 0 0 0-2-4" /></G>
export const Cap = (p) => <G {...p}><path d="M12 4 22 9l-10 5L2 9l10-5Z" /><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" /></G>
export const Contact = (p) => <G {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="11" r="2" /><path d="M5.5 17c.6-1.7 2-2.5 3.5-2.5s2.9.8 3.5 2.5M15 10h4M15 13.5h4" /></G>
export const Badge = (p) => <G {...p}><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6M3 12h18" /></G>
export const Layers = (p) => <G {...p}><path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" /><path d="m3 12.5 9 4.5 9-4.5M3 17l9 4.5 9-4.5" /></G>
export const Box = (p) => <G {...p}><path d="M21 8.5 12 13 3 8.5 12 4l9 4.5Z" /><path d="M3 8.5v7L12 20l9-4.5v-7M12 13v7" /></G>
export const Card = (p) => <G {...p}><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19M6 15h4" /></G>
export const Spark = (p) => <G {...p}><path d="M12 3.5 13.8 9l5.7 1.7-5.7 1.8L12 18l-1.8-5.5-5.7-1.8L10.2 9 12 3.5Z" /><path d="M18.5 16.5 19.3 19l2.2.8-2.2.8-.8 2.4" /></G>
export const Grid = (p) => <G {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></G>
export const Compass = (p) => <G {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></G>
export const Bolt = (p) => <G {...p}><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" /></G>
export const Link = (p) => <G {...p}><path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 1 0-5.7-5.7l-1.5 1.5" /><path d="M14 10.5a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 1 0 5.7 5.7l1.5-1.5" /></G>
export const Growth = (p) => <G {...p}><path d="M3 17.5 9 11l4 4 8-8.5" /><path d="M15.5 6.5H21V12" /></G>
export const Handshake = (p) => <G {...p}><path d="m3 12 4-4 3.5 3.5a2 2 0 0 0 2.8 0L17 8l4 4" /><path d="m9 15 2.5 2.5a2 2 0 0 0 2.8 0L21 11M3 12l4.5 4.5" /></G>
