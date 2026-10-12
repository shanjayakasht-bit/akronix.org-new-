import { Band } from '../ui/Band'
import { Container } from '../primitives'
import { Label } from '../ui/Pill'
import { Marquee } from '../motion/Marquee'
import { tools } from '../../content/home'

/* One list of names, one framing. The live site shows the same logos twice, the
 * second time under "Our Trusted Partners" -- these are tools the studio works
 * with, not partnerships, so that second row is gone and the names are set as
 * type, not as logos, which is also what keeps them from reading as
 * endorsements.
 *
 * The strip drifts on its own and answers the scroll: scroll down and it
 * quickens, scroll back and it turns round (`Marquee`). */
export default function Tools() {
  return (
    <Band tone="light" pad="md" className="border-y border-rule">
      <Container wide>
        <Label index="04">Tools &amp; platforms we work with</Label>
      </Container>
      <Marquee className="mt-10" speed={3.2}>
        {tools.map((t) => (
          <span key={t} className="flex items-center whitespace-nowrap">
            <span className="px-10 font-display text-[clamp(2.5rem,1.6rem+3vw,5rem)] font-light leading-none tracking-[-0.04em] text-ink/30 transition-colors duration-300 hover:text-ink md:px-14">
              {t}
            </span>
            <span aria-hidden="true" className="size-2 shrink-0 bg-brand" />
          </span>
        ))}
      </Marquee>
    </Band>
  )
}
