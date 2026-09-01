import Hero from '../components/sections/Hero'
import ToolStrip from '../components/sections/ToolStrip'
import Ecosystem from '../components/sections/Ecosystem'
import Products from '../components/sections/Products'
import Advantages from '../components/sections/Advantages'
import QuoteBand from '../components/sections/QuoteBand'
import FinalCta from '../components/sections/FinalCta'

/* Slabs are separated by cream, not butted together -- the gap is what makes
   them read as blocks sitting on a page. */
export default function Home() {
  return (
    <div className="space-y-0 pb-0 md:space-y-0 md:pb-0">
      <Hero />
      <ToolStrip />
      <Ecosystem />
      <Products />
      <Advantages />
      <QuoteBand />
      <FinalCta />
    </div>
  )
}
