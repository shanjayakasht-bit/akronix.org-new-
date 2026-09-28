import PageHero from '../components/building/PageHero'
import ProductIndex from '../components/building/ProductIndex'
import UniqueRequirement from '../components/building/UniqueRequirement'
import Advantages from '../components/sections/Advantages'
import QuoteBand from '../components/sections/QuoteBand'
import { buildingQuote, buildingTraits } from '../content/building'

/* The live products page's structure (Step 4.4) -- hero, the products, the
   four benefit blocks, "Have a Unique Requirement?" -- with a quote band
   added before the last (Step 4.5). The four blocks and the quote are the
   homepage's own Advantages and QuoteBand, saying this page's words. Cream,
   forest, cream, cocoa, sand: light and dark in turn, as the homepage runs. */
export default function Building() {
  return (
    <div>
      <PageHero />
      <ProductIndex />
      <Advantages {...buildingTraits} four wide />
      <QuoteBand lines={buildingQuote.lines} cta={buildingQuote.cta} videoUrl={null} />
      <UniqueRequirement />
    </div>
  )
}
