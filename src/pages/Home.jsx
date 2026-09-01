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
    <div className="space-y-4 pb-4 md:space-y-5 md:pb-5">
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
