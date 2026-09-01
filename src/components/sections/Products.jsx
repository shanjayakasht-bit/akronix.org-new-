import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { RollText } from '../ui/RollText'
import { Slab } from '../ui/Slab'
import * as Glyphs from '../brand/Glyphs'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { products } from '../../content/products'

const EASE = [0.16, 1, 0.3, 1]

/* On the dark slab, so the six products read as the centrepiece rather than a
 * list buried mid-page. Every card keeps its stage: none has shipped, and a
 * card read on its own must not look purchasable. */
export default function Products() {
  const reduced = usePrefersReducedMotion()
  const up = (d) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 26 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-10% 0px' },
      transition: { duration: 0.8, ease: EASE, delay: d },
    }

  return (
    <Slab tone="forest">
      <Container>
        <div className="text-center">
          <motion.p className="font-sans text-mark uppercase tracking-[0.16em] text-paper/45" {...up(0)}>
            White-label SaaS
          </motion.p>
          <h2 className="mx-auto mt-6 max-w-[16ch] font-serif text-h1 leading-[1.04] tracking-[-0.025em] text-paper">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={reduced ? false : { y: '112%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
              >
                Our Premium <em className="italic text-clay-soft">Products</em>
              </motion.span>
            </span>
          </h2>
          <motion.p className="mx-auto mt-6 max-w-[46ch] font-sans text-lede leading-relaxed text-paper/60" {...up(0.24)}>
            White-label SaaS products to simplify your business operations.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {products.map((p, i) => {
            const Glyph = Glyphs[p.glyph]
            return (
              <motion.article
                key={p.name}
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.09 + Math.floor(i / 3) * 0.06 }}
                className="group rounded-[1.75rem] border border-paper/12 bg-paper/[0.04] p-7 transition-colors duration-500 hover:border-paper/30 hover:bg-paper/[0.08]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper/80 transition-colors duration-500 group-hover:bg-clay-soft group-hover:text-paper">
                    {Glyph ? <Glyph className="h-5 w-5" /> : null}
                  </span>
                  <span className="rounded-full border border-paper/20 px-3 py-1 font-sans text-mark uppercase text-paper/50">
                    {p.stage}
                  </span>
                </div>
                <h3 className="mt-7 font-serif text-h3 tracking-tight text-paper">{p.name}</h3>
                <p className="mt-2.5 font-sans text-body leading-relaxed text-paper/55">{p.line}</p>
              </motion.article>
            )
          })}
        </div>

        <motion.div className="mt-12 flex justify-center" {...up(0.3)}>
          <Link
            to="/building"
            className="group/roll group inline-flex items-center gap-2.5 rounded-full bg-paper px-6 py-3.5 font-sans text-ui text-ink transition-colors duration-300 hover:bg-clay-soft hover:text-paper"
          >
            <RollText>View All Products</RollText>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </motion.div>
      </Container>
    </Slab>
  )
}
