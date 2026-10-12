/* /building -- all twelve products at length. The products themselves live in
 * `products.js`; this is the page's own copy.
 *
 * Honesty notes kept with the data, so a future session sees them:
 *  - Every line here states the actual stage. Nothing has shipped, nothing has
 *    a usable interface, and there is no demo. Do not soften any of it into
 *    wording that implies availability, and do not add a Demo control.
 *  - No dates. None have been given, so none are published.
 *  - The page follows the live products page's structure (Step 4.4):
 *    hero, products, four benefit blocks, "Have a Unique Requirement?".
 */
export const buildingHero = {
  crumb: 'Products',
  /* The live site's headline, word for word, at the client's direction
     (Step 4.4). Three lines, as the homepage's "Build. / Connect. / Scale.".
     The lede carries the real stage. */
  headline: ['Our Products,', 'Built to Power', 'Your Business.'],
  lede: 'A suite of white-label SaaS products for running a business: six specified and being built now, six more planned. None has shipped yet, and early access opens as each one becomes usable.',
  primary: { label: 'Request Early Access', to: '/contact' },
  secondary: { label: 'See All Twelve', href: '#portfolio' },
}

/* The live products page's four benefit blocks, in its order, after the
   products. Worded as plans: nothing has shipped, so nothing here "is" yet.

   The fourth is not the live one. "Dedicated Support -- our expert support
   team is always here to help you succeed" promises a support team for
   products that do not exist. The client chose this honest version instead
   (Step 4.4). Do not restore the original. */
export const buildingTraits = {
  /* Set in the homepage's "Why Businesses Choose Akronix" section, at the
     client's request (Step 4.5) -- same cards, same glyph chips. */
  /* Held under ~22 characters so the centred heading does not break inside
     its accent -- "Planned Into Every Product" did, at 1512. */
  eyebrow: 'Planned across all twelve',
  title: 'In Every',
  accent: 'Product',
  items: [
    { title: 'Enterprise Security', copy: 'Role-based access, encrypted data and regular backups, planned into every product from the start.' },
    { title: 'Cloud-Based', copy: 'Planned to be hosted and monitored by us, and reachable from anywhere, so there is nothing to install or run.' },
    { title: 'Fully Customizable', copy: 'White-label throughout: your name and brand on it, configured around how your business already works.' },
    { title: 'Support from the Builders', copy: 'Questions go straight to the people building the product, not to a separate support desk.' },
  ],
}

/* The quote band between the four boxes and "Have a Unique Requirement?",
   in the homepage QuoteBand, at the client's request (Step 4.5). The studio
   model in one true line -- client work and our own products side by side.
   Stated as what the studio does, never as a history: there is no completed
   client work to point back to. */
export const buildingQuote = {
  lines: ['We build software for clients,', 'and these twelve for ourselves.'],
  cta: { label: 'See Client Work', to: '/solutions' },
}

export const buildingIndex = {
  eyebrow: 'All twelve',
  /* Short enough to hold one line from ~768px up. Centred, a longer title
     wrapped inside its accent -- "where / it stands." -- because the words
     are flex items and `text-balance` cannot reach them. */
  title: 'Where each',
  accent: 'one stands.',
  sub: 'What each one is for, and what it is being built to do. The scope is the plan, not a list of features that work today. Open any card to ask for early access.',
  groups: { building: 'In development', planned: 'Planned' },
}

/* The live page's closing section, in its place before the footer. Its copy
   ended "Let's create something amazing together!" -- dropped as filler. */
export const buildingUnique = {
  eyebrow: 'Custom software development',
  title: 'Have a Unique',
  accent: 'Requirement?',
  copy: 'We build custom software around your business goals. Tell us what you need, and we’ll tell you honestly whether and how we can help.',
  primary: { label: 'Talk to an Expert', to: '/contact' },
  secondary: { label: 'Book a Free Consultation', to: '/contact#slots' },
}
