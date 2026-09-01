import { H2, Lede, Mark, Qualifier, Section } from '../primitives'
import { Reveal } from '../motion/Reveal'
import Booking from './Booking'
import { Rise } from '../motion/Rise'
import { site } from '../../content/site'

/* Section 7. The only section on the page that is data rather than prose --
 * a ruled block of facts, closer to a colophon than a call to action.
 *
 * No form. The page already asks enough of a reader; an intake form here would
 * be a second ask, and /contact is where one belongs.
 *
 * Only the two actionable details appear here. Location and hours live in the
 * footer, which sits directly below this section on the homepage -- carrying
 * all four in both places made the page repeat itself within one screen.
 *
 * NOT included, deliberately: the legacy page's "Response Time — < 24 Hours,
 * Guaranteed response". A guarantee nobody is rostered to honour is the same
 * class of problem as the invented metrics, just slower to surface. Add it
 * back only if someone will actually answer within a day.
 */
const details = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'Phone', value: site.phone, href: site.phoneHref },
]

export default function Contact() {
  return (
    <Section tone="sand" id="book">
      <Rise as="div">
        <H2 className="max-w-[14em]">
          Tell us what is going wrong.{' '}
          <Qualifier>We will come back with a number.</Qualifier>
        </H2>
      </Rise>

      <Reveal as="div" delay={0.06} className="mt-8">
        <Lede>
          You do not need a specification, a budget range, or a brief already
          written. Those come out of the conversation rather than before it.
        </Lede>
      </Reveal>

      <Reveal as="div" delay={0.12} className="mt-12 md:mt-16">
        <Booking />
      </Reveal>

      <Reveal
        as="div"
        delay={0.16}
        className="mt-12 grid grid-cols-1 border-t border-rule md:mt-16 md:grid-cols-2"
      >
        {details.map((detail) => (
          <div
            key={detail.label}
            className="border-b border-rule py-8 md:border-l md:py-12 md:pl-10 md:first:border-l-0 md:first:pl-0"
          >
            <Mark as="div">{detail.label}</Mark>
            <a
              href={detail.href}
              className="mt-4 inline-block text-h3 text-ink transition-colors hover:text-signal"
            >
              {detail.value}
            </a>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
