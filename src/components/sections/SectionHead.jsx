import { motion } from 'motion/react'
import { Label } from '../ui/Pill'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'

const EASE = [0.16, 1, 0.3, 1]

/* `Headline` and `SectionIntro` are the two heading components every section
 * uses. (The centred, stacked `SectionHead` they replaced is gone.)
 *
 * A heading set the way large type is set on enterprise sites: left-aligned,
 * regular weight, tight, in ONE colour -- no italic, no word picked out in a
 * brand colour. The accent half of a title (`accent`) is carried on as the
 * second half of the sentence in a quieter grey, which gives the line a
 * hierarchy without a hue.
 *
 * Each word rises out of its own mask, one after another. Masked rather than
 * faded: the word is cut off by an invisible edge as it climbs, which reads as
 * the line being drawn on to the page rather than switched on. */
export function Headline({
  as: Tag = 'h2',
  title,
  accent,
  onDark = false,
  className,
  size = 'text-h1',
  delay = 0,
  once = true,
}) {
  const reduced = usePrefersReducedMotion()
  const words = [
    ...title.split(' ').map((w) => ({ w, soft: false })),
    ...(accent ? accent.split(' ').map((w) => ({ w, soft: true })) : []),
  ]
  const soft = onDark ? 'text-white/45' : 'text-ink-3'

  return (
    <Tag className={cx(size, 'text-balance', onDark ? 'text-white' : 'text-ink', className)}>
      {words.map(({ w, soft: isSoft }, i) => (
        <span key={`${w}-${i}`} className="mr-[0.24em] inline-block overflow-hidden pb-[0.14em] align-top last:mr-0">
          <motion.span
            className={cx('inline-block', isSoft && soft)}
            initial={reduced ? false : { y: '112%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once, margin: '-8% 0px' }}
            transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.045 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* The split intro every full-width section opens with: the marker and index in
 * a narrow left column, the heading and its sentence in the wide right one.
 * Two columns instead of a centred stack is the single biggest difference
 * between a corporate page and a template. */
export function SectionIntro({ eyebrow, index, title, accent, sub, onDark = false, actions, className, titleClass }) {
  const reduced = usePrefersReducedMotion()
  const up = (d) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: { duration: 0.8, ease: EASE, delay: d },
        }

  return (
    <div className={cx('grid gap-8 lg:grid-cols-12 lg:gap-10', className)}>
      <motion.div className="lg:col-span-3" {...up(0)}>
        <Label onDark={onDark} index={index}>
          {eyebrow}
        </Label>
      </motion.div>
      <div className="lg:col-span-9">
        <Headline title={title} accent={accent} onDark={onDark} size={titleClass ?? 'text-h1'} className="max-w-[18ch]" delay={0.05} />
        {sub ? (
          <motion.p
            className={cx('mt-8 max-w-[58ch] font-sans text-lede', onDark ? 'text-white/65' : 'text-ink-2')}
            {...up(0.3)}
          >
            {sub}
          </motion.p>
        ) : null}
        {actions ? (
          <motion.div className="mt-10 flex flex-wrap gap-3" {...up(0.4)}>
            {actions}
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

