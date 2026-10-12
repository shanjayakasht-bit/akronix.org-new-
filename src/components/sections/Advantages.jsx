import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { SectionIntro } from './SectionHead'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { advantages } from '../../content/home'
import { cx } from '../../lib/cx'

const EASE = [0.16, 1, 0.3, 1]

/* A row of ruled cells -- number, title, one sentence. On hover a black ground
 * rises from the foot of the cell and the text turns white; that is the whole
 * interaction. No glyphs, no coloured chips, no cards: the number and the words
 * identify it.
 *
 * Every piece of copy is a prop so /building can use it for "In every product".
 * `four` sets four across from `xl`; the default is three from `lg`. */
export default function Advantages({
  eyebrow = 'Our advantage',
  index = '02',
  title = 'Why Businesses Choose',
  accent = 'Akronix',
  items = advantages,
  four = false,
  tone = 'mist',
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <Band tone={tone}>
      <Container wide>
        <SectionIntro eyebrow={eyebrow} index={index} title={title} accent={accent} />

        <ul
          className={cx(
            'mt-16 grid border-l border-t border-rule bg-white md:grid-cols-2',
            four ? 'xl:grid-cols-4' : 'lg:grid-cols-3',
          )}
        >
          {items.map((a, i) => (
            <motion.li
              key={a.title}
              className="border-b border-r border-rule"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: (i % 4) * 0.08 }}
            >
              <div className="group relative isolate flex h-full min-h-[18rem] flex-col justify-between overflow-hidden p-8 transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-ink before:transition-transform before:duration-[650ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-y-100 hover:text-white">
                <span className="tnum font-sans text-mark text-ink-3 transition-colors duration-500 group-hover:text-white/55">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-h3 text-ink transition-colors duration-500 group-hover:text-white">{a.title}</h3>
                  <p className="mt-4 max-w-[34ch] font-sans text-ui text-ink-2 transition-colors duration-500 group-hover:text-white/75">{a.copy}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </Container>
    </Band>
  )
}
