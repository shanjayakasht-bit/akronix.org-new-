import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Slab } from '../ui/Slab'
import SectionHead from './SectionHead'
import * as Glyphs from '../brand/Glyphs'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { advantages } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* An aligned three-up grid. The previous version offset the right column to
 * break symmetry and the client was right that it just read as scattered --
 * alignment is what makes a grid legible. The icon sits inline with the title
 * rather than centred above it, which keeps it clear of the icon-above-heading
 * pattern CLAUDE.md warns about. */
const TONE = [
  { chip: 'bg-clay-tint text-clay', ring: 'hover:ring-clay/35' },
  { chip: 'bg-moss-tint text-moss', ring: 'hover:ring-moss/35' },
  { chip: 'bg-slate-tint text-slate', ring: 'hover:ring-slate/35' },
  { chip: 'bg-ochre-tint text-ochre', ring: 'hover:ring-ochre/35' },
  { chip: 'bg-clay-tint text-clay', ring: 'hover:ring-clay/35' },
  { chip: 'bg-moss-tint text-moss', ring: 'hover:ring-moss/35' },
]

export default function Advantages() {
  const reduced = usePrefersReducedMotion()

  return (
    <Slab tone="cream">
      <Container>
        <SectionHead
          eyebrow="Our advantage"
          tone="moss"
          title="Why Businesses Choose"
          accent="Akronix"
          className="mx-auto text-center"
        />

        <div className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {advantages.map((a, i) => {
            const Glyph = Glyphs[a.glyph]
            return (
              <motion.article
                key={a.title}
                initial={reduced ? false : { opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.75, ease: EASE, delay: (i % 3) * 0.1 + Math.floor(i / 3) * 0.06 }}
                className={`group flex h-full flex-col rounded-[1.5rem] bg-panel p-7 ring-1 ring-rule transition-all duration-500 hover:-translate-y-1 ${TONE[i].ring}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110 ${TONE[i].chip}`}>
                    {Glyph ? <Glyph className="h-5 w-5" /> : null}
                  </span>
                  <h3 className="font-serif text-h3 leading-tight tracking-tight text-ink">{a.title}</h3>
                </div>
                <p className="mt-4 font-sans text-body leading-relaxed text-ink-2">{a.copy}</p>
              </motion.article>
            )
          })}
        </div>
      </Container>
    </Slab>
  )
}
