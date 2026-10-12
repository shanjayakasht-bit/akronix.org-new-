/* /policies -- the live site's policy page, ported and made true.
 *
 * The live site has no standalone Privacy Policy or Terms & Conditions page.
 * Both of its footer links, "Privacy Policy" and "Terms & Conditions", open the
 * one page this is taken from: "Our Policies", with a sidebar of four documents
 * (Overview, Referral Network, Akronix Startup Execution, Innovation Events) that
 * swap in an animated panel, and "Last updated: March 22, 2026". The four
 * documents, their clauses, their numbers (48 hours, 24 hours, 1-2 week sprints,
 * the lien on code until final payment, the ₹2L to ₹15L+ referral tiers) and the
 * date are the live page's. The ids are too, so a link that worked there works
 * here: overview, referral, execution, innovation.
 *
 * What is reworded, and why. The live copy was written as if the studio were
 * established, and Akronix has no clients (CLAUDE.md), so:
 *  - "premium Digital Nomad Team", "enterprise-grade quality", "relentless
 *    velocity", "wildly collaborative", "As leaders in the tech ecosystem" are
 *    cut. They are filler, and the last one is a claim.
 *  - "for our clients worldwide" and "enterprise clients" are gone: there are no
 *    clients, and the contact FAQ says outright that no overseas client has been
 *    served yet.
 *  - "regularly hosts and participates in hackathons..." claims an activity
 *    nobody can point to. The Innovation Events document now says what it is --
 *    the ground rules for any event the studio hosts or joins -- and no more.
 *  - The referral network is "Forming" everywhere else on this site (the first
 *    meeting is not set), so its document opens with that status instead of
 *    reading as a record of how it has run.
 *  - "SLAs come with a response time guarantee of under 24 hours" keeps the
 *    number and drops "guarantee", as the contact page already did.
 * The phone number on the live page (+91 9360745895) is not carried; the site's
 * one email and its two numbers are used, from `site`.
 *
 * Wording here wants the client's read before it is treated as legal text. See
 * STATUS, "Waiting on the client".
 *
 * A clause body is an array of paragraphs. A `closing` is an array of parts:
 * plain strings, `{ mail: true }` for the site's email as a link, and
 * `{ phones: true }` for both phone numbers as links.
 */
export const updated = '22 March 2026'

export const policiesHero = {
  crumb: 'Policies',
  headline: ['How we work,', 'in writing.'],
  lede: 'Four short documents: the overview, the terms of the referral network, how an engagement is run, and the ground rules for events. Where something has not started yet, it says so.',
  facts: [
    { value: 4, label: 'documents on this page' },
    { value: '48 h', label: 'to give feedback after a sprint demo' },
    { value: '24 h', label: 'standard response on a maintenance retainer' },
    { value: 'Written', label: 'scope, milestones and price, before work starts' },
  ],
}

export const documents = [
  {
    id: 'overview',
    label: 'Overview',
    summary: 'Who we are, and what we commit to.',
    title: 'Legal and operational',
    accent: 'overview.',
    intro: [
      'This is the framework for how we work with the people and businesses we take on: how we design, build and grow digital products, and how we look after what you share with us while we do.',
      'Akronix is a studio based in Chennai, India, working as a distributed team across SaaS development, MVP builds, AI and automation, and digital marketing. We aim for the standard of a larger company with the pace of a small one.',
    ],
    clausesTitle: 'Our core commitments',
    clauses: [
      { name: 'Excellence', body: ['Scalable solutions, built around the goals of the business they are for.'] },
      { name: 'Transparency', body: ['Plain communication about timelines, budgets and technical trade-offs, in writing and before work starts.'] },
      { name: 'Security', body: ['Care for client intellectual property, data and sensitive configuration, at all times.'] },
    ],
    closing: [
      'By working with us, using our services or taking part in what we run, you agree to the standards set out in these documents. For a question about a specific agreement, or anything not covered here, write to ',
      { mail: true },
      ' or call ',
      { phones: true },
      '.',
    ],
  },
  {
    id: 'referral',
    label: 'Referral network',
    summary: 'How introductions are rewarded.',
    title: 'Referral network',
    accent: 'policy.',
    status: 'Forming. The first meeting has not been set, so this is the set of terms the network will run on, not a record of how it has run.',
    intro: [
      'The referral network is built on trust, shared growth and good introductions. It follows a structured, BNI-style model, and is meant to reward the partners who help the studio find work worth doing.',
    ],
    clauses: [
      {
        name: 'Reward structure',
        body: [
          'Referral credit or compensation is processed only after the project has kicked off and the initial milestone payment has been received from the referred client.',
          'Tiers are based on the project’s estimated budget (for example, projects in the ₹2L to ₹15L+ range) and on how much the partner did to bring the work to a close.',
        ],
      },
      {
        name: 'Partner obligations',
        body: [
          'Partners keep to a professional standard. Misrepresenting Akronix’s services, capabilities or pricing means immediate removal from the network.',
          'A warm, well-explained introduction is worth more than a cold lead: make sure the person you refer knows what Akronix does before you connect us.',
        ],
      },
      {
        name: 'Network audits',
        body: [
          'Akronix may review the quality of referrals from time to time. Partners who are inactive, or who regularly send leads that are a poor fit, may have their agreement reviewed.',
        ],
      },
    ],
    closing: ['To talk about becoming a partner, write to ', { mail: true }, '.'],
  },
  {
    id: 'execution',
    label: 'Startup execution',
    summary: 'Sprints, ownership and support.',
    title: 'How an engagement',
    accent: 'runs.',
    intro: [
      'Engagement agreements say in advance where the lines fall on sprint cycles, intellectual property, deployment and technical debt, so that a product reaches market quickly and securely.',
    ],
    clauses: [
      {
        name: 'Agile development sprints',
        body: [
          'Work runs in short, focused sprints, typically one to two weeks, each ending in a review, so the build stays in step with what you learn about your market.',
          'Please give feedback within 48 hours of a sprint demo, so development is not held up waiting.',
        ],
      },
      {
        name: 'IP ownership and handover',
        body: [
          'Your product is yours. The full codebase, deployment configuration and assets are documented, and transferred to you in law once the agreed milestones are complete and final payment has cleared.',
          'Until final payment clears, Akronix keeps a lien on the code it has developed.',
        ],
      },
      {
        name: 'Maintenance and retainers',
        body: [
          'After launch we offer maintenance retainers, from fixing bugs promptly to building new features.',
          'A retainer’s service level is written into the agreement. Our standard is a response in under 24 hours.',
        ],
      },
    ],
    closing: ['Questions about an agreement? Write to ', { mail: true }, ' or call ', { phones: true }, '.'],
  },
  {
    id: 'innovation',
    label: 'Innovation events',
    summary: 'Ground rules for events.',
    title: 'Innovation and',
    accent: 'ecosystem events.',
    intro: [
      'These are the ground rules for any hackathon, ecosystem meetup or design sprint that Akronix hosts or takes part in, so that every event stays inclusive, safe and collaborative.',
    ],
    clauses: [
      {
        name: 'Confidentiality',
        body: [
          'Participants share general insights and methods freely, and respect the confidential, proprietary data of the partners and clients we work with.',
          'Breaking an NDA, or sharing private code at a hackathon, means immediate removal from the event.',
        ],
      },
      {
        name: 'Open-source contributions',
        body: [
          'We encourage generic tools, libraries and boilerplates that come out of an event to be contributed back to the open-source community, provided they contain no client business logic or secrets.',
        ],
      },
    ],
    closing: [
      'Want to co-host an event, mentor at a hackathon, or sponsor a tech meetup in Chennai? Send the community team a plan at ',
      { mail: true },
      '.',
    ],
  },
]
