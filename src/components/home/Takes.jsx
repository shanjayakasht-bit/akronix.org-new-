import { Body, Grid, H2, H3, Lede, Qualifier, Section } from '../primitives'
import { Reveal } from '../motion/Reveal'
import { Rise } from '../motion/Rise'
import { services } from '../../content/services'
import { serviceIcons } from '../brand/Icons'

/* Section 4. Running prose, alternating across the grid -- cols 1-6, then
   7-12, and back. No icon-above-heading grid, which is the single most
   recognisable generated-site shape and the one CLAUDE.md names first. */
export default function Takes() {
  return (
    <Section tone="panel">
      <Rise as="div">
        <H2 className="max-w-[15em]">
          Four kinds of work. <Qualifier>Two of them are not software.</Qualifier>
        </H2>
      </Rise>

      <Reveal as="div" delay={0.06} className="mt-8">
        <Lede>
          All four are scoped the same way and billed the same way. The rates are
          published on the work page rather than quoted on request.
        </Lede>
      </Reveal>

      <div className="mt-16 border-b border-rule md:mt-20">
        {services.map((service, i) => {
          const Icon = serviceIcons[service.name]
          return (
          <Reveal
            as="div"
            key={service.name}
            delay={Math.min(i, 3) * 0.05}
            className="group border-t border-rule px-4 py-10 -mx-4 transition-colors duration-300 hover:bg-paper md:py-14"
          >
            <Grid>
              <div
                className={
                  i % 2 === 0
                    ? 'col-span-4 md:col-span-6'
                    : 'col-span-4 md:col-span-6 md:col-start-7'
                }
              >
                {Icon ? <Icon className="h-8 w-8 text-ink" /> : null}
                <H3 className="mt-5 transition-colors group-hover:text-signal">{service.name}</H3>
                <Body className="mt-3 text-ink-2">{service.body}</Body>
              </div>
            </Grid>
          </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
