import { Body, Grid, H2, H3, Qualifier, Section } from '../primitives'
import { Reveal } from '../motion/Reveal'
import { Rise } from '../motion/Rise'
import { faq } from '../../content/faq'

/* Section 6. The credibility engine.
 *
 * Deliberately not an accordion. The length of these answers is the proof;
 * collapsing them behind a click would hide the only evidence the site has.
 *
 * The question sits in its own column and the answer runs beside it, so the
 * page can be skimmed by question and read by answer. */
export default function Questions() {
  return (
    <Section>
      <Rise as="div">
        <H2 className="max-w-[17em]">
          The questions you&rsquo;re actually asking.{' '}
          <Qualifier>Including the ones that don&rsquo;t flatter us.</Qualifier>
        </H2>
      </Rise>

      <dl className="mt-16 border-b border-rule md:mt-24">
        {faq.map((item, i) => (
          <Reveal
            as="div"
            key={item.q}
            delay={Math.min(i, 3) * 0.04}
            className="border-t border-rule py-10 md:py-16"
          >
            <Grid className="gap-y-6">
              <dt className="col-span-4 md:col-span-4">
                <H3>{item.q}</H3>
              </dt>
              <dd className="col-span-4 space-y-5 md:col-span-7 md:col-start-6">
                {item.a.map((para) => (
                  <Body key={para.slice(0, 24)} className="text-ink-2">
                    {para}
                  </Body>
                ))}
              </dd>
            </Grid>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
