import { Body, Grid, H2, Qualifier, Section } from '../primitives'
import { Reveal } from '../motion/Reveal'
import { Rise } from '../motion/Rise'

/* Section 2. Rests on an opinion, which is the point: an observation about the
   market needs no proof, where a claim about our own past would need one we do
   not have. Nothing here describes work Akronix has done. */
export default function Thesis() {
  return (
    <Section tone="sand">
      <Grid className="gap-y-10 md:gap-y-0">
        <Rise as="div" className="col-span-4 md:col-span-5">
          <H2>
            Every small business runs the same few systems.{' '}
            <Qualifier>Almost none of them chose those systems together.</Qualifier>
          </H2>
        </Rise>

        <Reveal as="div" delay={0.08} className="col-span-4 space-y-6 md:col-span-6 md:col-start-7">
          <Body>
            Customers, stock, payroll, the till, the books. A business trading
            for five years runs all of them, and never chose them together.
            They arrived one at a time.
          </Body>

          <Body>
            Each of them works. Together they leak. That is not a failure of the
            people running the business &mdash; it is what happens when software
            is priced for companies with an IT department and sold to companies
            without one.
          </Body>
        </Reveal>
      </Grid>

    </Section>
  )
}
