import { motion } from 'motion/react'
import Seo from '../components/shell/Seo'
import PageIntro from '../components/sections/PageIntro'
import Faq from '../components/sections/Faq'
import Booking from '../components/home/Booking'
import ContactForm from '../components/contact/ContactForm'
import Details from '../components/contact/Details'
import { Container } from '../components/primitives'
import { Band } from '../components/ui/Band'
import { Label } from '../components/ui/Pill'
import { Headline } from '../components/sections/SectionHead'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { contactHero, contactFaq, formCopy, slotsCopy } from '../content/contact'

const EASE = [0.16, 1, 0.3, 1]

/* /contact -- and the page every "Book a Consultation" button lands on.
 *
 * The form is first, because that is what the visitor came for; the details and
 * the four steps sit beside it (below it on a phone). The scheduler follows on
 * grey for anyone who would rather pick a time than write, and the questions
 * close the page. The form opens with a product, service or plan already chosen
 * when the link that brought the visitor named one -- see `ContactForm`. */
export default function Contact() {
  const reduced = usePrefersReducedMotion()
  const hero = {
    crumb: contactHero.crumb,
    facts: contactHero.facts,
    headline: contactHero.headline,
    lede: contactHero.lede,
    primary: { label: 'Write to Us', href: '#form' },
    secondary: { label: 'Pick a Time', href: '#slots' },
  }

  return (
    <div>
      <Seo
        title="Contact"
        description="Book a free 30-minute consultation with Akronix, or write to us about a project, a service or early access to one of our products. We reply within a day. Chennai, India."
      />
      <PageIntro hero={hero} />

      <Band tone="light" pad="md" id="form" className="scroll-mt-24">
        <Container wide>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <Details />
            </div>
            <motion.div
              className="order-1 lg:order-2 lg:col-span-7"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Label index="01">{formCopy.eyebrow}</Label>
              <Headline title={formCopy.title} accent={formCopy.accent} size="text-h2" className="mt-6" />
              <p className="mt-5 max-w-[48ch] font-sans text-lede text-ink-2">{formCopy.sub}</p>
              <div className="mt-10">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </Container>
      </Band>

      <Band tone="mist" id="slots" className="scroll-mt-24">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Label index="03">{slotsCopy.eyebrow}</Label>
              <Headline title={slotsCopy.title} accent={slotsCopy.accent} size="text-h1" className="mt-6" />
              <p className="mt-6 max-w-[40ch] font-sans text-lede text-ink-2">{slotsCopy.copy}</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Booking />
            </div>
          </div>
        </Container>
      </Band>

      <Faq {...contactFaq} index="04" />
    </div>
  )
}
