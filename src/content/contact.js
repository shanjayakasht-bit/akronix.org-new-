/* /contact -- also what every "Book a Consultation" button leads to.
 *
 * The live page's four contact tiles, its four-step "What Happens Next",
 * four FAQ questions (no answers in the scrape -- written here, see below) and
 * its enquiry form.
 *
 * Dropped: the "< 24 Hours / Guaranteed response" tile. A reply within a day is
 * kept as a plain statement; "guaranteed" is a promise with nothing behind it.
 * "Tamil Nadu, IN 600001" is dropped to the city -- a postcode points at an
 * office, and the site does not claim one.
 *
 * The form's options are the live form's, regrouped: services, then the twelve
 * products as early access. A product link anywhere on the site arrives as
 * `?product=<slug>` and pre-selects its option; a plan link as `?plan=<key>`;
 * a service link as `?service=<slug>`. Slugs are `productSlug()` for products
 * and `solutions[].slug` for services.
 *
 * FAQ answers: written to make only the claims the flow itself makes, and to
 * say so where a policy does not exist yet. They want the client's read.
 */
export const contactHero = {
  crumb: 'Contact',
  facts: [
    { value: '24 h', label: 'to a first reply' },
    { value: '30 min', label: 'free discovery call' },
    { value: 'Mon–Sat', label: '9 AM to 7 PM IST' },
    { value: 'Remote', label: 'or in person in Chennai' },
  ],
  eyebrow: 'Book a consultation',
  headline: ['Tell us what', 'you’re building,', 'or trying to fix.'],
  lede: 'Fill in the form, or book a time. We reply within a day, and the first call is free: thirty minutes to understand what you need and say honestly whether we are the right people.',
}

export const detailTiles = [
  { label: 'Email', note: 'We reply within a day', kind: 'email' },
  { label: 'Call', note: 'Mon–Sat, 9 AM – 7 PM IST', kind: 'phone' },
  { label: 'Visit', note: 'Or work together fully remote', kind: 'place' },
]

export const nextSteps = {
  eyebrow: 'What happens next',
  title: 'Four steps from',
  accent: 'hello.',
  steps: [
    { name: 'Send your request', copy: 'Tell us what you need and anything you already know about it. A few lines is plenty.' },
    { name: 'We review and reply', copy: 'We read it properly and come back within a day, with questions if we have them.' },
    { name: 'A free discovery call', copy: 'Thirty minutes to understand the problem and what a good result looks like.' },
    { name: 'Proposal and kickoff', copy: 'A written proposal with scope, milestones and a price. If it suits, we start.' },
  ],
}

export const formCopy = {
  eyebrow: 'Start a conversation',
  title: 'Send us a',
  accent: 'message.',
  sub: 'It opens in your own email app, ready to send. Nothing goes anywhere until you press send there.',
}

export const serviceGroups = [
  {
    label: 'Services',
    options: [
      { value: 'saas', label: 'SaaS Development' },
      { value: 'web-mobile', label: 'Web & Mobile Development' },
      { value: 'ai', label: 'AI & Automation' },
      { value: 'marketing', label: 'Digital Marketing' },
      { value: 'cloud', label: 'Cloud & DevOps' },
      { value: 'consulting', label: 'IT Consulting' },
      { value: 'mentorship', label: 'Mentorship & Training' },
      { value: 'networking', label: 'Business Networking (register interest)' },
      { value: 'custom', label: 'Something else' },
    ],
  },
  /* Products are filled in from products.js by the form. */
]

export const planOptions = [
  { value: 'starter', label: 'Starter, ₹999 / month' },
  { value: 'growth', label: 'Growth, ₹2,499 / month' },
  { value: 'business', label: 'Business, ₹4,999 / month' },
  { value: 'enterprise', label: 'Enterprise, custom' },
]

export const slotsCopy = {
  eyebrow: 'Prefer a call?',
  title: 'Pick a',
  accent: 'time.',
  copy: 'Choose a date and a slot and we will set up the call. It is a request until we reply, and the first call is free.',
}

export const contactFaq = {
  eyebrow: 'Before you write',
  title: 'Four common',
  accent: 'questions.',
  items: [
    {
      q: 'How long does it take to get started?',
      a: [
        'We reply within a day. If it looks like a fit, the discovery call is usually the same week, and a written proposal follows it. Work starts once you have agreed the scope, milestones and price, not before, so the date you start is mostly in your hands.',
      ],
    },
    {
      q: 'Do you work with clients outside India?',
      a: [
        'Yes. We are based in Chennai and work entirely remotely when that suits you, over video and shared documents. We have not yet worked with an overseas client, and we would rather you heard that from us than assumed otherwise. The first call is free.',
      ],
    },
    {
      q: 'What is the minimum project budget?',
      a: [
        'We do not publish a floor for project work, because it depends on what is being built; it is quoted in writing after the discovery call. The monthly plans on the Pricing page start at ₹999. If what you are asking for will not fit your budget, we will say so plainly and suggest a smaller first piece.',
      ],
    },
    {
      q: 'Can I ask for changes once the project has started?',
      a: [
        'Yes. Scope and milestones are agreed at the start precisely so a change is visible when it is asked for. We tell you what a change does to time and cost before any extra work is done, and you decide whether it is worth it.',
      ],
    },
  ],
}
