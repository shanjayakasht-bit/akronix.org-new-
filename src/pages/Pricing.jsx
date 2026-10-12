import Seo from '../components/shell/Seo'
import PageIntro from '../components/sections/PageIntro'
import Plans from '../components/pricing/Plans'
import EveryPlan from '../components/pricing/EveryPlan'
import GlossFaq from '../components/pricing/GlossFaq'
import GlossCta from '../components/pricing/GlossCta'
import { pricingHero, pricingFaq, pricingClose } from '../content/pricing'

/* /pricing, glossy and curved (Step 7: the client asked for it on this page).
   A white hero whose facts are rounded glazed tiles; the plans as frosted glass
   on a black curved stage, with a finder that lights the one written for you;
   what every plan includes as a glossy bento, with the custom route beside
   glazed pills; the questions as rounded glossy cards; a black rounded close.
   The rest of the site stays flat and square on purpose. */
export default function Pricing() {
  return (
    <div>
      <Seo
        title="Pricing"
        description="Akronix plans from ₹999 a month: Starter, Growth, Business and Enterprise, with what each includes. No long-term contract. Custom work is quoted in writing before it starts."
      />
      <PageIntro hero={pricingHero} glossy />
      <Plans />
      <EveryPlan />
      <GlossFaq eyebrow="Pricing questions" title="Six plain" accent="answers." items={pricingFaq} index="04" />
      <GlossCta {...pricingClose} />
    </div>
  )
}
