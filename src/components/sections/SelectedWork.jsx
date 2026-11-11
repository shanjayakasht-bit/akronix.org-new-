import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { RollText } from '../ui/RollText'
import { SectionIntro } from './SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { cx } from '../../lib/cx'
import { selectedWork } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* "Selected Work" (Step 7.6): real, live sites, shown as what they are.
 *
 * Each card is one link to the project's own site, which opens in a new tab: a
 * browser-frame crop of a real screenshot, the name and what it is, who contributed
 * (where the brief gave an attribution), the technology that could be verified
 * from the live site, and a "Visit site" line that rolls. No stock imagery, no
 * figures, no testimonials; see the note on `selectedWork` in `content/home.js`
 * for exactly what is and is not claimed, and how the screenshots were taken.
 *
 * On the dark graphite ground the page uses for its other dark bands, so the
 * screenshots -- which are light -- are the brightest things on it. Hover lifts the
 * border and eases the picture in a few percent; reduced motion keeps the border
 * change and drops the movement. */
function ExternalArrow({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true" className={cx('size-4 shrink-0', className)}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  )
}

function Project({ p, i, reduced }) {
  return (
    <motion.li
      className={cx(i === 2 ? 'md:col-span-2 lg:col-span-1' : '')}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
    >
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${p.name}: visit ${p.host} (opens in a new tab)`}
        className="group/roll group flex h-full flex-col border border-white/12 bg-white/[0.03] outline-offset-4 transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.05] focus-visible:border-white/35"
      >
        {/* a browser-frame crop of the live site */}
        <span className="block border-b border-white/12 bg-ui-charcoal">
          <span className="flex items-center gap-1.5 px-3.5 py-2.5" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="ml-3 truncate font-sans text-[0.6875rem] text-ui-grey">{p.host}</span>
          </span>
          <span className="block aspect-[16/10] overflow-hidden bg-ui-navy">
            <img
              src={p.image}
              alt={p.alt}
              width="1280"
              height="800"
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
            />
          </span>
        </span>

        <span className="flex flex-1 flex-col p-6 md:p-7">
          <span className="flex items-center justify-between gap-4 font-sans text-mark font-medium uppercase text-ui-grey">
            <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
            <span>{p.category}</span>
          </span>
          <span className="mt-5 block font-display text-h3 text-white">{p.name}</span>
          <span className="mt-3 block max-w-[46ch] font-sans text-ui text-white/65">{p.copy}</span>

          <span className="mb-8 mt-6 flex flex-wrap items-center gap-2">
            {p.attribution ? (
              <span className="border border-ui-violet/50 bg-ui-violet/10 px-2.5 py-1 font-sans text-[0.6875rem] text-white/85">{p.attribution}</span>
            ) : null}
            {p.tech.map((t) => (
              <span key={t} className="border border-white/15 px-2.5 py-1 font-sans text-[0.6875rem] text-white/70">
                {t}
              </span>
            ))}
          </span>

          <span className="mt-auto flex items-center justify-between gap-4 border-t border-white/12 pt-5 font-sans text-ui font-medium text-white">
            <RollText>Visit site</RollText>
            <ExternalArrow className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </span>
      </a>
    </motion.li>
  )
}

export default function SelectedWork() {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone="graphite" pad="md" id="work">
      <Container wide>
        <SectionIntro eyebrow={selectedWork.eyebrow} index="02" title={selectedWork.title} accent={selectedWork.accent} sub={selectedWork.sub} onDark />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {selectedWork.projects.map((p, i) => (
            <Project key={p.slug} p={p} i={i} reduced={reduced} />
          ))}
        </ul>

        <p className="mt-8 font-sans text-ui text-white/50">{selectedWork.note}</p>
      </Container>
    </Band>
  )
}
