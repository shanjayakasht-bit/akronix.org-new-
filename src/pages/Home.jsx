import Seo from '../components/shell/Seo'
import Hero from '../components/sections/Hero'
import Film from '../components/sections/Film'
import Pillars from '../components/sections/Pillars'
import Showcase from '../components/sections/Showcase'
import WhyAkronix from '../components/sections/WhyAkronix'
import Tools from '../components/sections/Tools'
import FinalCta from '../components/sections/FinalCta'

/* The homepage: a white hero of four slides, the four lines of work, the twelve
   products, the approach, the technologies, and the close. White, grey, white, grey,
   white, grey, then the black footer -- the change of ground between sections does the separating that
   rounded slabs used to. (A "Selected Work" band of three live projects sat after the
   lines of work from Step 7.6 until the client had it removed: see STATUS, Step 7.7.)
   Every section after the hero uses the same medium vertical
   padding (`pad="md"`: 64px on a phone, 96px from `md`) and the same 48px between a
   heading and what it introduces, so the page keeps one rhythm. (The hero was black
   in Step 6; the client asked for it to stop starting that way. A bar of the four
   disciplines and a "Who we are" statement used to sit between the hero and the
   pillars; the client had them removed, Step 6.1.) */
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
