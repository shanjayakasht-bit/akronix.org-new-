import { motion } from 'motion/react'
import { FIGURE } from './figure'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

const EASE = [0.65, 0, 0.35, 1]

/* The Akronix figure, drawn.
 *
 * On load the outline of the figure is traced stroke by stroke -- the body,
 * then the leg, then the head -- the way a mark is drawn at the start of a
 * brand film. When the lines meet, the shapes take a faint fill and the head
 * fills in the brand red: the same red as the I in the wordmark, and the one
 * colour on a black field. A slow band of light then crosses the figure every
 * few seconds, clipped to its silhouette.
 *
 * Behind it, two rings centred on the figure -- one solid, one a dotted track
 * turning very slowly. They are construction lines: they make the mark read as
 * designed to a system. They carry no data and mean nothing beyond that.
 *
 * It is the hero's image because Akronix has no photograph, no screenshot and
 * no product to show yet, and a placeholder box or an invented dashboard are
 * the two things this site will not put there. The one asset that is real and
 * its own is the mark, so the hero is built from that.
 *
 * Drawn with `pathLength` strokes in viewBox units, not `non-scaling-stroke`:
 * a non-scaling stroke dashes in screen pixels and the draw-on would break. */
const CX = 137
const CY = 146.5

/* `tone` is the ground it sits on: "dark" draws white lines on black (the Step 6
   hero), "light" draws ink lines on white (the Step 7 hero, which the client
   asked to stop starting black). The head is the brand red either way. */
const TONES = {
  dark: {
    line: 'rgba(255,255,255,0.85)',
    fill: '#fff',
    fillOpacity: 0.08,
    ring: 'rgba(255,255,255,0.14)',
    dots: 'rgba(255,255,255,0.28)',
    sweep: '#fff',
    sweepOpacity: 0.28,
    headStroke: 'var(--color-brand-soft)',
  },
  light: {
    line: 'rgba(11,12,15,0.9)',
    fill: '#0b0c0f',
    fillOpacity: 0.045,
    ring: 'rgba(11,12,15,0.12)',
    dots: 'rgba(11,12,15,0.34)',
    sweep: '#0b0c0f',
    sweepOpacity: 0.16,
    headStroke: 'var(--color-brand)',
  },
}

export function HeroFigure({ className, tone = 'dark' }) {
  const reduced = usePrefersReducedMotion()
  const t = TONES[tone]
  const stroke = (delay, fill) =>
    reduced
      ? { initial: false, animate: { pathLength: 1, fillOpacity: fill } }
      : {
          initial: { pathLength: 0, fillOpacity: 0 },
          animate: { pathLength: 1, fillOpacity: fill },
          transition: {
            pathLength: { duration: 2.4, ease: EASE, delay },
            fillOpacity: { duration: 1.4, ease: 'easeOut', delay: delay + 1.9 },
          },
        }

  return (
    <svg viewBox="-40 -30 354 353" fill="none" aria-hidden="true" className={cx('block overflow-visible', className)}>
      <defs>
        <clipPath id="akx-fig-clip">
          <path d={FIGURE.body} />
          <path d={FIGURE.leg} />
        </clipPath>
        <linearGradient id="akx-fig-sweep" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={t.sweep} stopOpacity="0" />
          <stop offset="0.5" stopColor={t.sweep} stopOpacity={t.sweepOpacity} />
          <stop offset="1" stopColor={t.sweep} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* construction rings */}
      <motion.circle
        cx={CX}
        cy={CY}
        r="140"
        stroke={t.ring}
        strokeWidth="0.5"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.6, ease: EASE, delay: 0.2 }}
      />
      <g className={reduced ? undefined : 'origin-[137px_146.5px] animate-[spin_180s_linear_infinite]'}>
        <circle cx={CX} cy={CY} r="168" stroke={t.dots} strokeWidth="0.9" strokeDasharray="0.1 5.2" strokeLinecap="round" />
      </g>

      {/* the figure */}
      <motion.path
        d={FIGURE.body}
        stroke={t.line}
        strokeWidth="0.7"
        strokeLinejoin="round"
        fill={t.fill}
        {...stroke(0.5, t.fillOpacity)}
      />
      <motion.path
        d={FIGURE.leg}
        stroke={t.line}
        strokeWidth="0.7"
        strokeLinejoin="round"
        fill={t.fill}
        {...stroke(1.1, t.fillOpacity)}
      />
      <motion.path
        d={FIGURE.head}
        stroke={t.headStroke}
        strokeWidth="0.7"
        fill="var(--color-brand)"
        {...stroke(1.7, 1)}
      />

      {/* the light that crosses it */}
      <g clipPath="url(#akx-fig-clip)">
        <rect className="akx-sweep [transform-box:fill-box] [transform-origin:center]" x="17" y="11" width="70" height="271" fill="url(#akx-fig-sweep)" />
      </g>
    </svg>
  )
}
