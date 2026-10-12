/* /solutions -- the live site's eight service lines on one page.
 *
 * The live site has eight near-identical service pages (CLAUDE.md: "within 100
 * bytes of each other in length"). They are one page here, each line an anchor,
 * and the nav's Solutions menu links straight to them.
 *
 * Honesty notes kept with the data:
 *  - The live pages promise "Proven Results", "Expert Team", "24/7 monitoring",
 *    "penetration testing", "compliance frameworks" and placement outcomes.
 *    None of that is claimed: Akronix has no completed client work to prove
 *    results with, and the security and placement items are not verified
 *    capabilities. Each line below lists only what the live list said it does,
 *    minus those.
 *  - Business Networking carries the stage "Forming". The community does not
 *    operate yet (see services.js), so the line says so rather than selling
 *    membership. The live Networking page's three membership prices are not
 *    shown for the same reason.
 *  - Academy is folded into Mentorship & Training: the live Academy page is a
 *    second list of the same offer, plus a graduates counter and a row of
 *    university logos, neither of which is true here.
 *
 * `core` marks the four lines the nav's Solutions menu lists (Step 7): the rest
 * are one click further, on this page. `slug` is the in-page anchor and the
 * `?service=` value the contact form understands. Keep the two in step with `contact.js`.
 */
export const solutionsHero = {
  crumb: 'Solutions',
  facts: [
    { value: 8, label: 'lines of work, one team' },
    { value: 5, label: 'steps from first call to launch' },
    { value: '30 min', label: 'free discovery call' },
    { value: 'Remote', label: 'or in person in Chennai' },
  ],
  headline: ['One studio,', 'eight ways', 'to help.'],
  lede: 'We build software and AI tools, run marketing, and teach, and we are building twelve products of our own while we do it. Find the line that fits below, or tell us the problem and we will tell you which one it is.',
  primary: { label: 'Book a Consultation', to: '/contact' },
  secondary: { label: 'See the Eight', href: '#solutions' },
}

export const solutions = [
  {
    slug: 'saas',
    core: true,
    name: 'SaaS Development',
    short: 'SaaS',
    line: 'Custom SaaS built around your workflow.',
    copy: 'Multi-tenant architecture, subscription billing and admin dashboards, designed around how your business already runs rather than around a template.',
    items: ['Custom SaaS development', 'White-label solutions', 'API development', 'Cloud integration'],
  },
  {
    slug: 'web-mobile',
    name: 'Web & Mobile',
    short: 'Web & Mobile',
    line: 'Sites and apps, built and maintained.',
    copy: 'Website redesigns that are meant to bring in enquiries, e-commerce storefronts and mobile apps, with the upkeep included in the conversation from the start.',
    items: ['Web applications', 'Mobile applications', 'E-commerce solutions', 'UI/UX design'],
  },
  {
    slug: 'ai',
    core: true,
    name: 'AI & Automation',
    short: 'AI & Automation',
    line: 'Take the manual steps out.',
    copy: 'Assistants that answer from your own material, internal chatbots and workflow automation that removes repeated busywork from a team’s week.',
    items: ['AI chatbots', 'Workflow automation', 'Business intelligence', 'AI integrations'],
  },
  {
    slug: 'marketing',
    core: true,
    name: 'Digital Marketing',
    short: 'Marketing',
    line: 'Qualified leads, not just traffic.',
    copy: 'Search, paid acquisition and content for local and B2B brands that need enquiries they can act on, with the writing behind them done properly.',
    items: ['SEO & SEM', 'Social media marketing', 'Google & Meta ads', 'Content & growth marketing'],
  },
  {
    slug: 'cloud',
    name: 'Cloud & DevOps',
    short: 'Cloud & DevOps',
    line: 'Infrastructure that ships on its own.',
    copy: 'Moving to the cloud, and setting up the pipelines and infrastructure on AWS or similar platforms so releases stop being an event.',
    items: ['Cloud migration', 'DevOps automation', 'CI/CD pipelines', 'Monitoring'],
  },
  {
    slug: 'consulting',
    name: 'IT Consulting',
    short: 'IT Consulting',
    line: 'Think it through before you spend.',
    copy: 'Technical audits, architecture reviews and roadmap planning, so the budget is committed to a build only after the plan has been argued with.',
    items: ['IT strategy & roadmap', 'Technology consulting', 'System architecture', 'Technical audits'],
  },
  {
    slug: 'mentorship',
    core: true,
    name: 'Mentorship & Training',
    short: 'Mentorship',
    line: 'Learn it from someone doing it.',
    copy: 'One-to-one mentorship and workshops for students and early founders on product, technical and career decisions, and training for teams.',
    items: [
      'Startup mentorship',
      'Career guidance',
      'Workshops & bootcamps',
      'Academic projects',
      'Technical courses',
      'Corporate training',
    ],
  },
  {
    slug: 'networking',
    name: 'Business Networking',
    short: 'Networking',
    stage: 'Forming',
    line: 'A referral community, forming now.',
    copy: 'A structured referral community for founders, freelancers and small business owners, modelled on BNI. It is not running yet; register interest and you will hear when the first meeting is set.',
    items: ['Referral networking', 'Founder communities', 'Networking events', 'Strategic partnerships'],
  },
]

/* The five steps from the live "Our Approach". Verbs and one sentence each,
   rewritten; the live copy was one generic line per step. */
export const approach = {
  eyebrow: 'How a project runs',
  title: 'Five steps,',
  accent: 'in this order.',
  steps: [
    { n: '01', name: 'Discover', copy: 'We learn the business, the problem and what a good outcome would look like to you, before anything is estimated.' },
    { n: '02', name: 'Plan', copy: 'A written plan with milestones and a price, agreed before work starts, so an overrun is visible while it happens.' },
    { n: '03', name: 'Build', copy: 'The work itself, in short stretches you can look at, rather than a long silence ending in a reveal.' },
    { n: '04', name: 'Launch', copy: 'We put it in front of real users with you, and stay until the first problems have been found and fixed.' },
    { n: '05', name: 'Grow', copy: 'Ongoing support and the next round of changes, agreed the same way as the first.' },
  ],
}

export const solutionsClose = {
  eyebrow: 'Not sure which line?',
  title: 'Tell us the',
  accent: 'problem.',
  copy: 'Describe what you are trying to do or fix, and we will tell you honestly whether and how we can help, and which of the eight it belongs to.',
  primary: { label: 'Book a Free Consultation', to: '/contact' },
  secondary: { label: 'See the Pricing', to: '/pricing' },
}
