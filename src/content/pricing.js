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
  eyebrow: 'On every plan',
  title: 'What every plan',
  accent: 'includes.',
  items: [
    { name: 'Security', copy: 'Your data handled with care, in transit and at rest.' },
    { name: 'Networking access', copy: 'A place in the founders’ and professionals’ community, as it opens.' },
    { name: 'Academy access', copy: 'Resources, workshops and webinars for you and your team.' },
    { name: 'Expert support', copy: 'A real person answering, by email and chat.' },
    { name: 'Partner perks', copy: 'Discounts and offers from the tools we work with, when they exist.' },
  ],
}

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

export const pricingFaq = [
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: [
      'Yes. The plans are monthly with no long-term commitment, so you can move up as the business grows, or step down, from one month to the next. Tell us which plan you want and from when.',
    ],
  },
  {
    q: 'What payment methods do you accept?',
    a: [
      'We confirm the payment options when you get started, because we would rather set them up around what is easy for you than publish a list we have not tested. Tell us what you would prefer on the enquiry form.',
    ],
  },
  {
    q: 'Do you offer refunds?',
    a: [
      'We have not written a refund policy yet, and we would rather say so than invent one here. What we will do is agree it in writing with you before you pay anything, so there is nothing to find out afterwards.',
    ],
  },
  {
    q: 'Are there long-term contracts?',
    a: [
      'No. A plan is billed monthly and you are not tied to a term. Custom software is a different arrangement: it has a written scope, milestones and a price agreed before work starts.',
    ],
  },
  {
    q: 'Is there a setup fee?',
    a: [
      'The prices on this page are the whole price of a plan. Custom software and larger engagements are quoted separately and in writing before they begin, so a cost never arrives that you were not shown first.',
    ],
  },
  {
    q: 'Can I get a custom plan for my organisation?',
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
}
