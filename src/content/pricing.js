/* /pricing.
 *
 * The three prices and what each plan includes are SETTLED -- the client
 * reaffirmed them twice (STATUS, "Pricing is settled"). They ship with their
 * current contents; do not re-litigate.
 *
 * What is NOT carried from the live pricing page:
 *  - the "Business Analytics 80% / 60% / 90% / 45%" panel -- a made-up
 *    dashboard;
 *  - the "Most Popular" badge on Growth -- nobody has bought a plan, so
 *    nothing can be popular. Growth is set apart by treatment alone;
 *  - "Join thousands of businesses and professionals" -- invented scale;
 *  - the Monthly / Annual toggle: the live page gave "save up to 20%" and no
 *    annual prices, and an annual price cannot be invented.
 *
 * Plans include Networking and Academy access, and Networking is still
 * forming (see solutions.js). `pricingNote` says so under the plans instead of
 * leaving the plan lists to imply a running community. Wording wants the
 * client's eye.
 *
 * The FAQ answers are new -- the live page lists six questions with no
 * answers in the scrape. Each makes only a process claim that the live page
 * or the contact flow already makes, and where a policy has not been written
 * the answer says so, in the manner of faq.js. Wants the client's read.
 */
export const pricingHero = {
  crumb: 'Pricing',
  facts: [
    { value: 4, label: 'plans, with the price shown' },
    { value: '₹999', label: 'a month, to start' },
    { value: 'No term', label: 'plans are billed monthly' },
    { value: '24 h', label: 'to a first reply' },
  ],
  headline: ['Plans with', 'the price', 'on the page.'],
  lede: 'Most agencies hide what they charge until a call. These are the monthly plans, with what each one includes, and a note on custom work for anything that does not fit.',
  primary: { label: 'Choose a Plan', href: '#plans' },
  secondary: { label: 'Talk to Us First', to: '/contact' },
}

/* The plan finder above the plans: who you are, and which plan was written for
 * that person. The mapping is the live page's own `for` line on each plan
 * ("Students, individuals and early-stage startups", "Growing businesses...",
 * "Established businesses...", "Large organisations") -- it recommends nothing
 * the plans do not already say about themselves, and it claims no popularity. */
export const finder = {
  prompt: 'I am a',
  options: [
    { key: 'starter', label: 'Student or founder' },
    { key: 'growth', label: 'Growing business' },
    { key: 'business', label: 'Established company' },
    { key: 'enterprise', label: 'Large organisation' },
  ],
}

export const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: '₹999',
    per: '/ month',
    for: 'Students, individuals and early-stage startups.',
    lead: 'What’s included',
    items: [
      '1 on 1 mentorship session / month',
      'Basic digital marketing support',
      'Access to networking community',
      'Resource library access',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    key: 'growth',
    name: 'Growth',
    price: '₹2,499',
    per: '/ month',
    for: 'Growing businesses seeking more reach and results.',
    lead: 'Everything in Starter, plus',
    items: [
      'Advanced digital marketing',
      'Priority networking access',
      'Monthly networking events',
      'Business consultation (2 / month)',
      'Project discounts',
      'Priority email & chat support',
    ],
    cta: 'Get Started',
    feature: true,
  },
  {
    key: 'business',
    name: 'Business',
    price: '₹4,999',
    per: '/ month',
    for: 'Established businesses looking to scale operations.',
    lead: 'Everything in Growth, plus',
    items: [
      'Custom SaaS / software discounts',
      'Dedicated account manager',
      'Advanced analytics & reporting',
      'More exposure in the network',
      'Quarterly business review',
      'Priority support (24/7)',
    ],
    cta: 'Get Started',
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    per: 'pricing',
    for: 'Tailored solutions for large organisations.',
    lead: 'Everything in Business, plus',
    items: [
      'Custom solutions & integrations',
      'Dedicated team',
      'On-site / virtual workshops',
      'SLA & priority infrastructure',
      'Advanced security & compliance',
      '24/7 dedicated support',
    ],
    cta: 'Contact Sales',
  },
]

export const pricingNote =
  'Networking and Academy access are included from the day each opens. The networking community is still forming, so until its first meeting is set, that line of a plan means a place waiting for you. Everything else listed is available now.'

export const everyPlan = {
  eyebrow: 'Compare plans',
  title: 'Compare',
  accent: 'the plans.',
  items: [
    { name: 'Security', copy: 'Your data handled with care, in transit and at rest.' },
    { name: 'Networking access', copy: 'A place in the founders’ and professionals’ community, as it opens.' },
    { name: 'Academy access', copy: 'Resources, workshops and webinars for you and your team.' },
    { name: 'Expert support', copy: 'A real person answering, by email and chat.' },
    { name: 'Partner perks', copy: 'Discounts and offers from the tools we work with, when they exist.' },
  ],
}

/* The comparison table's rows (Step 7.5).
 *
 * Every row after "Included in every plan" is one line from `plans[].items`,
 * named here by its exact text and grouped by what it is about. Whether a plan
 * has a line is NOT typed: it is worked out from `plans` itself, by the one rule
 * the plans state about themselves -- a plan whose `lead` begins "Everything in"
 * includes every line of the plan before it. So a line is on the plan that lists
 * it and on every plan above that, and on none below; change a plan's items and
 * the table follows, and it cannot disagree with the cards above it.
 *
 * Two things this deliberately does not do. It does not decide that "Advanced
 * digital marketing" replaces "Basic digital marketing support" -- both are
 * listed, so a higher plan shows both, which is what "everything in Starter,
 * plus" says. And a line that is in `plans` but in no group here is not dropped:
 * it is appended under "More", so every line a plan lists is always in the table.
 *
 * Billing: the plans say "/ month", the hero says "plans are billed monthly" and
 * the contracts answer says there is no term. Nothing in this file mentions tax,
 * so the table does not either. */
const GROUPS = [
  { name: 'Mentorship and learning', lines: ['1 on 1 mentorship session / month', 'Resource library access', 'On-site / virtual workshops'] },
  { name: 'Digital marketing', lines: ['Basic digital marketing support', 'Advanced digital marketing', 'Advanced analytics & reporting'] },
  { name: 'Networking', lines: ['Access to networking community', 'Priority networking access', 'Monthly networking events', 'More exposure in the network'] },
  { name: 'Consultation and delivery', lines: ['Business consultation (2 / month)', 'Quarterly business review', 'Dedicated account manager', 'Dedicated team', 'Custom solutions & integrations'] },
  { name: 'Discounts', lines: ['Project discounts', 'Custom SaaS / software discounts'] },
  { name: 'Support', lines: ['Email support', 'Priority email & chat support', 'Priority support (24/7)', '24/7 dedicated support'] },
  { name: 'Platform and security', lines: ['SLA & priority infrastructure', 'Advanced security & compliance'] },
]

const carriesPrevious = (p, c) => c > 0 && /^Everything in\b/i.test(p.lead)

/* For one line: which of the four plans have it. */
const planHas = (text) => {
  const has = []
  plans.forEach((p, c) => has.push(p.items.includes(text) || (carriesPrevious(p, c) && has[c - 1])))
  return has
}

const listed = plans.flatMap((p) => p.items)
const placed = new Set(GROUPS.flatMap((g) => g.lines))
const leftovers = [...new Set(listed.filter((t) => !placed.has(t)))]

export const comparison = [
  {
    name: 'Included in every plan',
    rows: everyPlan.items.map((it) => ({ label: it.name, copy: it.copy, has: plans.map(() => true) })),
  },
  ...[...GROUPS, ...(leftovers.length ? [{ name: 'More', lines: leftovers }] : [])].map((g) => ({
    name: g.name,
    rows: g.lines.filter((t) => listed.includes(t)).map((t) => ({ label: t, has: planHas(t) })),
  })),
]

export const comparisonNote =
  'Starter, Growth and Business are billed monthly, with no long-term contract. Enterprise is priced to the organisation. Each plan includes everything in the plan before it, plus the lines shown for it.'

export const customPlan = {
  eyebrow: 'Custom solutions',
  title: 'Need something',
  accent: 'larger?',
  copy: 'We put together packages and enterprise arrangements around what an organisation actually needs. Tell us the shape of it.',
  items: [
    'Custom SaaS development',
    'Private networking events',
    'A dedicated marketing team',
    'Individual mentorship programmes',
    'Training and workshops',
    'And whatever else it takes',
  ],
  primary: { label: 'Book a Free Consultation', to: '/contact' },
}

/* Each question carries a `tag` (the short name in the index beside the answers)
 * and a `verdict` (the answer in a line). A verdict restates the first thing its
 * answer already says and adds nothing: where the answer says there is no refund
 * policy yet, the verdict says so too. */
export const pricingFaq = [
  {
    q: 'Can I upgrade or downgrade my plan?',
    tag: 'Changing plans',
    verdict: 'Yes, month to month',
    a: [
      'Yes. The plans are monthly with no long-term commitment, so you can move up as the business grows, or step down, from one month to the next. Tell us which plan you want and from when.',
    ],
  },
  {
    q: 'What payment methods do you accept?',
    tag: 'Payment',
    verdict: 'Confirmed when you start',
    a: [
      'We confirm the payment options when you get started, because we would rather set them up around what is easy for you than publish a list we have not tested. Tell us what you would prefer on the enquiry form.',
    ],
  },
  {
    q: 'Do you offer refunds?',
    tag: 'Refunds',
    verdict: 'Not written yet, so agreed first',
    a: [
      'We have not written a refund policy yet, and we would rather say so than invent one here. What we will do is agree it in writing with you before you pay anything, so there is nothing to find out afterwards.',
    ],
  },
  {
    q: 'Are there long-term contracts?',
    tag: 'Contracts',
    verdict: 'No',
    a: [
      'No. A plan is billed monthly and you are not tied to a term. Custom software is a different arrangement: it has a written scope, milestones and a price agreed before work starts.',
    ],
  },
  {
    q: 'Is there a setup fee?',
    tag: 'Fees',
    verdict: 'The price shown is the whole price',
    a: [
      'The prices on this page are the whole price of a plan. Custom software and larger engagements are quoted separately and in writing before they begin, so a cost never arrives that you were not shown first.',
    ],
  },
  {
    q: 'Can I get a custom plan for my organisation?',
    tag: 'Custom plans',
    verdict: 'Yes',
    a: [
      'Yes, and for most organisations beyond a certain size it is the right answer. Tell us about the team, what you want to build or learn, and we will propose something specific rather than pointing you at the nearest tier.',
    ],
  },
]

export const pricingClose = {
  eyebrow: 'Ready when you are',
  title: 'Start with a',
  accent: 'conversation.',
  copy: 'Pick the plan that looks closest and say so on the form, or book a call first. Either way you will hear back within a day.',
  primary: { label: 'Get Started Today', to: '/contact?plan=growth' },
  secondary: { label: 'Book a Consultation', to: '/contact' },
  /* What happens after the button. Each step is something this page already
     promises: the form names a plan, a first reply within a day (the "24 h" on the
     hero), and terms in writing before any payment (the refunds answer). */
  steps: [
    { title: 'Tell us which plan', copy: 'Name the closest one on the form, or leave it blank and say what you need.' },
    { title: 'Hear back within a day', copy: 'Every enquiry gets a first reply within 24 hours.' },
    { title: 'Agree it in writing', copy: 'Terms are set down and agreed before you pay anything.' },
  ],
}
