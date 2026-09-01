import { Link } from 'react-router-dom'
import { Body, Grid, H2, H3, Lede, Qualifier, Section, StageMark, UI } from '../primitives'
import { Reveal } from '../motion/Reveal'
import { Rise } from '../motion/Rise'
import { products } from '../../content/products'

/* Section 3. Rows, not cards: there is no interface to screenshot, and a
   mockup of one is exactly how the old site's fake dashboard came to exist.
 *
 * Every row carries its own stage marker even though all six currently read
 * the same. A visitor who lands on one row must not be able to mistake it for
 * something they can buy -- which is the failure the old page had. */
export default function Building() {
  return (
    <Section>
      <Rise as="div">
        <H2 className="max-w-[16em]">
          Six products in development.{' '}
          <Qualifier>None of them shipped.</Qualifier>
        </H2>
      </Rise>

      <Reveal as="div" delay={0.06} className="mt-8">
        <Lede>
          All six are specified and being built. Early access opens as each one
          becomes usable.
        </Lede>
      </Reveal>

      <ul className="mt-16 border-b border-rule md:mt-20">
        {products.map((product, i) => (
          <Reveal
            as="li"
            key={product.name}
            delay={Math.min(i, 4) * 0.05}
            className="group border-t border-rule px-4 py-8 -mx-4 transition-colors duration-300 hover:bg-panel md:py-9"
          >
            <Grid className="items-baseline gap-y-3">
              <H3 className="col-span-4 transition-colors md:col-span-4 group-hover:text-signal">{product.name}</H3>
              <Body className="col-span-4 text-ink-2 md:col-span-5">{product.line}</Body>
              <div className="col-span-4 md:col-span-3 md:flex md:justify-end">
                <StageMark active={product.live}>{product.stage}</StageMark>
              </div>
            </Grid>
          </Reveal>
        ))}
      </ul>

      <Reveal as="div" delay={0.1} className="mt-12 md:mt-14">
        <Link
          to="/contact"
          className="group inline-flex items-baseline gap-2 border-b border-ink pb-1 text-ink transition-colors hover:border-signal hover:text-signal"
        >
          <UI>Request early access</UI>
          <UI aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            &rarr;
          </UI>
        </Link>
      </Reveal>
    </Section>
  )
}
