/* /about -- the live About page, minus what is not true.
 *
 * Carried: the purpose, the way of working (live "Values" and "Why Choose
 * Akronix", turned into things a visitor can check), and the close.
 *
 * Not carried, and why:
 *  - "Leadership That Inspires" / Meet the Team -- the client excluded the team
 *    page, and the site is anonymous (STATUS, content rules).
 *  - "Our Journey" 2021-2025. It says the studio launched products in 2022,
 *    launched an Academy and networking community in 2023 and worked with
 *    clients beyond India in 2024. None of that has happened: no product has
 *    shipped and there are no clients. A timeline of it would be the invented
 *    history this rebuild exists to remove. No dates are published.
 *  - Mission and Vision ("a global ecosystem that inspires growth...") -- the
 *    sort of line any company could carry. The plan for this page excluded
 *    them; the working principles below do the same job with evidence.
 *
 * The "state of the studio" board is the page's demonstration: every row is
 * a thing that is true today, with the stage written out. It replaces the
 * invented numbers the live site opens with.
 */
export const aboutHero = {
  crumb: 'About Us',
  facts: [
    { value: 'Chennai', label: 'where the studio is' },
    { value: 12, label: 'products in the works' },
    { value: 8, label: 'lines of work' },
    { value: 'Remote', label: 'or in person, as you prefer' },
  ],
  headline: ['A studio,', 'building in', 'the open.'],
  lede: 'Akronix is a studio in Chennai. We take on software, AI, marketing and mentorship work for clients, and we are building twelve products of our own. This page says plainly what exists today and what is still on its way.',
  primary: { label: 'Book a Consultation', to: '/contact' },
  secondary: { label: 'See What We Do', to: '/solutions' },
}

export const purpose = {
  eyebrow: 'Our purpose',
  lines: [
    'We are here to help businesses and the people in them move faster,',
    'with software that fits, marketing that is measured, and people to learn from.',
  ],
}

/* Stage vocabulary matches the products: nothing here is promoted to a
   stage it has not reached. `chips` ('building' | 'planned') puts the products'
   own colours under a row's note -- solid for the six being built, pale for the
   six not started -- taken from products.js, never typed here. */
export const state = {
  eyebrow: 'The state of the studio',
  title: 'Where things',
  accent: 'stand today.',
  sub: 'Nothing here is rounded up. If a row has not happened yet, it says so.',
  rows: [
    { what: 'Our own products', stage: 'In development', note: 'Six of twelve are specified and being built: CRM, HRMS, ERP, Inventory, POS and an AI Assistant. None has shipped.', to: '/building', chips: 'building' },
    { what: 'The other six products', stage: 'Planned', note: 'Attendance, Project Management, Books, E-commerce, LMS and Helpdesk. Not started.', to: '/building', chips: 'planned' },
    { what: 'Client projects', stage: 'Open', note: 'We are taking on our first client work. Rates are published and the price is agreed before work starts.', to: '/pricing' },
    { what: 'Mentorship and training', stage: 'Offered', note: 'One-to-one sessions and workshops for students and early founders.', to: '/solutions#mentorship' },
    { what: 'Business networking', stage: 'Forming', note: 'A referral community modelled on BNI. The first meeting is not set.', to: '/solutions#networking' },
  ],
}

export const principles = {
  eyebrow: 'How we work',
  title: 'Five things you',
  accent: 'can check.',
  items: [
    { name: 'One team, start to finish', copy: 'Strategy, build and marketing are not handed between agencies. You brief one team and get one answer.' },
    { name: 'Clear execution', copy: 'Scope, milestones and price are written down before work begins, so progress is something you can look at rather than take on trust.' },
    { name: 'In person or remote', copy: 'We work with clients across a table in Chennai or entirely over video, whichever suits you. Neither is a second-best.' },
    { name: 'Your success first', copy: 'If we are not the right fit, or a smaller piece of work would do the job, we will say so before you spend anything.' },
    { name: 'Technology that earns its place', copy: 'We use AI and automation where it removes real work, and leave it out where a simple tool is enough.' },
  ],
}

export const aboutClose = {
  eyebrow: 'Let’s talk',
  title: 'Tell us what you’re',
  accent: 'building.',
  copy: 'Whether you run a business that wants to scale, a startup with an idea, or you are an individual ready to learn, we will tell you honestly whether and how we can help.',
  primary: { label: 'Book a Free Consultation', to: '/contact' },
  secondary: { label: 'Our Solutions', to: '/solutions' },
}
