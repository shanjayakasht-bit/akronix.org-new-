import Seo from '../components/shell/Seo'
import PageIntro from '../components/sections/PageIntro'
import PolicyDocs from '../components/policies/PolicyDocs'
import CtaBand from '../components/sections/CtaBand'
import { policiesHero } from '../content/policies'

/* /policies: the live site's policy page, which is also what its "Privacy Policy"
   and "Terms & Conditions" footer links open -- it has no separate pages for
   either. Four documents in a tabbed sheet; see `content/policies.js` for what
   was carried over and what was reworded to stay true, and PolicyDocs for how the
   tabs behave. */
export default function Policies() {
  return (
    <div>
      <Seo
        title="Policies"
        description="How Akronix works with clients, in writing: the legal and operational overview, the referral network terms, how an engagement runs, and the ground rules for events."
      />
      <PageIntro hero={policiesHero} />
      <PolicyDocs />
      <CtaBand
        eyebrow="Questions"
        title="Ask us"
        accent="directly."
        copy="If a term here is unclear, or you need something agreed in writing before you start, say so and we will put it in the proposal."
        primary={{ label: 'Contact Us', to: '/contact' }}
      />
    </div>
  )
}
