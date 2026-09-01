import { Body, Grid, H2, H3, Mark, Qualifier, Section } from '../primitives'
import { Reveal } from '../motion/Reveal'
import { Rise } from '../motion/Rise'

/* Section 5. The one dark section on the site.
 *
 * Every conviction here is a verbatim client answer, not a principle invented
 * to fill a slot. It replaces the legacy Discover / Plan / Build / Launch /
 * Grow diagram, which every agency has and which proves nothing.
 *
 * No hairlines in this section -- the change of ground does the separating,
 * and every other section on the page is held together by rules. */
const convictions = [
  {
    n: '01',
    heading: 'We work out the number after we understand the problem.',
    body: 'There is no paid discovery phase and you do not need a specification. You describe the problem; we come back with an approach and a price.',
  },
  {
    n: '02',
    heading: 'Two or three people on a project, not a department.',
    body: 'A small pod for the length of the project rather than work handed between teams. Fewer people to brief, fewer places for a decision to get lost.',
  },
  {
    n: '03',
    heading: 'You hear from us at milestones, not on a schedule.',
    body: 'Check-ins are tied to what is actually finished, not a standing weekly call. Between them you can reach us.',
  },
]

export default function HowWeWork() {
  return (
    <Section tone="night">
      <Rise as="div">
        <H2 className="max-w-[15em]">
          How we work.{' '}
          <Qualifier>Three commitments, not a five-step diagram.</Qualifier>
        </H2>
      </Rise>

      <div className="mt-20 space-y-16 md:mt-24 md:space-y-20">
        {convictions.map((c, i) => (
          <Reveal as="div" key={c.n} delay={Math.min(i, 3) * 0.05}>
            <Grid className="gap-y-4">
              <Mark className="col-span-4 md:col-span-1">{c.n}</Mark>
              <div className="col-span-4 md:col-span-8 md:col-start-3">
                <H3>{c.heading}</H3>
                <Body className="mt-4 text-rule">{c.body}</Body>
              </div>
            </Grid>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
