import Seo from '../components/shell/Seo'
import Hero from '../components/sections/Hero'
import Film from '../components/sections/Film'
import Pillars from '../components/sections/Pillars'
import Showcase from '../components/sections/Showcase'
import WhyAkronix from '../components/sections/WhyAkronix'
import Tools from '../components/sections/Tools'
import FinalCta from '../components/sections/FinalCta'

/* The homepage: a white hero, the four pillars, the products, the reasons, the
   tools, and the close. White, grey, white, grey, white, grey, then the black
   footer -- the change of ground between sections does the separating that
   rounded slabs used to. (The hero was black in Step 6; the client asked for it
   to stop starting that way.) (A bar of the four disciplines and a "Who we are" statement used to sit
   between the hero and the pillars; the client had them removed, Step 6.1.) */
export default function Home() {
  return (
    <div>
      <Seo description="Akronix is a studio in Chennai. Software, AI, marketing and mentorship for startups and growing businesses, and twelve products of our own in the works." />
      <Hero />
      <Film />
      <Pillars />
      <Showcase />
      <WhyAkronix />
      <Tools />
      <FinalCta />
    </div>
  )
}
