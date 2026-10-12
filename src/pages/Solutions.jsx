import Seo from '../components/shell/Seo'
import PageIntro from '../components/sections/PageIntro'
import SolutionList from '../components/solutions/SolutionList'
import Process from '../components/sections/Process'
import CtaBand from '../components/sections/CtaBand'
import { solutionsHero, approach, solutionsClose } from '../content/solutions'

/* /solutions: the live site's eight service pages as one. Intro, the eight as
   a ledger with a sticky index, the five-step approach as a pinned sideways
   read on black, then a closing call to action. */
export default function Solutions() {
  return (
    <div>
      <Seo
        title="Solutions"
        description="Eight lines of work from one team in Chennai: SaaS development, web and mobile, AI and automation, digital marketing, cloud and DevOps, IT consulting, mentorship and training, and business networking."
      />
      <PageIntro hero={solutionsHero} />
      <SolutionList />
      <Process process={approach} />
      <CtaBand {...solutionsClose} />
    </div>
  )
}
