import Seo from '../components/shell/Seo'
import PageIntro from '../components/sections/PageIntro'
import QuoteBand from '../components/sections/QuoteBand'
import Studio from '../components/about/Studio'
import StateBoard from '../components/about/StateBoard'
import Principles from '../components/about/Principles'
import CtaBand from '../components/sections/CtaBand'
import SoundScope from '../components/about/SoundScope'
import { SoundToggle } from '../components/about/SoundToggle'
import { PointerFigure } from '../components/about/PointerFigure'
import { aboutHero, aboutClose, purpose } from '../content/about'

/* /about: the live About page's real content. Intro, the purpose lit line by
   line on black, where the studio is (a radar and its clock) on white, "the
   state of the studio" on grey, five working principles as a stack of sheets on
   white, then the close. No team, no timeline: see `content/about.js` for why.

   Step 7 (client request): the page has interface sound. It is off until the
   visitor turns it on -- a switch under the headline, and a small one that follows
   down the page -- and SoundScope plays it for every control and marked row in
   here without any of them knowing. The figure in the hero follows the cursor. */
export default function About() {
  return (
    <SoundScope>
      <Seo
        title="About Us"
        description="Akronix is a studio in Chennai taking on software, AI, marketing and mentorship work while building twelve products of its own. An honest account of where each part stands today."
      />
      <PageIntro hero={aboutHero} aside={<PointerFigure className="h-[96%] w-auto text-ink" />}>
        <SoundToggle />
      </PageIntro>
      <QuoteBand lines={purpose.lines} cta={{ label: 'See What We Do', to: '/solutions' }} label={purpose.eyebrow} index="01" />
      <Studio />
      <StateBoard />
      <Principles />
      <CtaBand {...aboutClose} />
      <SoundToggle floating />
    </SoundScope>
  )
}
