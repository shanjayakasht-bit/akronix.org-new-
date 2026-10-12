import { products, productShort, productSlug } from './products'
import { solutions } from './solutions'

/* Single source of truth for anything that appears in more than one place.
 *
 * NOTE: `email` is an open question — the live contact page uses a Gmail address
 * while the policies page uses admin@akronix.org. A custom-domain address reads
 * materially better. Change it here and it changes everywhere.
 */
export const site = {
  name: 'Akronix',
  email: 'akronix.in@gmail.com',
  /* Two numbers, as the client gave them (Step 7). The second is NINE digits,
     "882543947"; an Indian mobile number is ten, so a digit may be missing. It
     is published exactly as given -- do not guess one -- and the `tel:` link
     dials exactly what is written. Confirm it with the client. */
  phones: [
    { display: '+91 97157 94422', href: 'tel:+919715794422' },
    { display: '+91 88254 3947', href: 'tel:+91882543947' },
  ],
  location: 'Chennai, Tamil Nadu, India',
  hours: 'Mon–Sat, 9AM – 7PM IST',

  /* Your permanent Google Meet room, e.g. https://meet.google.com/abc-defg-hij
   *
   * Left null on purpose: a Meet code cannot be invented -- a made-up one
   * simply fails to open, which is worse than no link at all. Create a room
   * at meet.google.com (New meeting -> Create a meeting for later), paste the
   * URL here, and the booking panel shows it with a copy button.
   *
   * While this is null the panel says the link arrives with the confirmation,
   * which is true and costs nothing. */
  meetLink: null,

  /* Where a submitted booking is POSTed as JSON
     ({ date, iso, time, timezone, email }).
     
     Null, because nothing is wired up yet. While it is null the booking panel
     falls back to handing the filled-in request to the visitor's own mail
     client, and its closing screen says only that -- it does NOT say the
     meeting is scheduled, because with no endpoint nothing received it.

     Set this to a form/email service URL (Formspree, Web3Forms, EmailJS, or a
     serverless function) and the panel switches to POSTing and to the
     scheduled wording. Whatever sits on the other end is also what has to
     issue the Google Meet link, since `meetLink` above is still null. */
  bookingEndpoint: null,

  /* Where the contact form is POSTed as JSON
     ({ name, email, company, topic, plan, message }). Null for the same
     reason as `bookingEndpoint`: nothing is wired up. While null the form
     hands the filled-in message to the visitor's own mail client and its
     closing screen says only that -- never that the message was received. */
  contactEndpoint: null,
}

/* Policies is deliberately absent -- it belongs in the footer, not the nav.
 *
 * `children` are the subdivisions: the Products menu lists all twelve (each
 * with its colour), the Solutions menu the eight lines. Each child links to
 * its own anchor on the parent page. */
/* The menus list only the CORE items (Step 7): the six products being built and
   the four main lines of work. The rest are named in the menu's last row and
   live on the page itself -- a menu of twelve and of eight read as a sitemap,
   not a menu. */
const productChildren = products
  .filter((p) => p.building)
  .map((p) => ({
    label: productShort(p),
    hint: p.stage,
    to: `/building#${productSlug(p)}`,
    dot: p.accent.dot,
  }))

const solutionChildren = solutions
  .filter((s) => s.core)
  .map((s) => ({
    label: s.name,
    hint: s.line,
    to: `/solutions#${s.slug}`,
  }))

export const nav = [
  {
    to: '/building',
    label: 'Products',
    children: productChildren,
    note: 'The six in development.',
    all: `See all ${products.length} products`,
    rest: `${products.length - productChildren.length} more are planned`,
  },
  {
    to: '/solutions',
    label: 'Solutions',
    children: solutionChildren,
    note: 'Our four main lines of work.',
    all: `See all ${solutions.length} solutions`,
    rest: `${solutions.length - solutionChildren.length} more on the page`,
  },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

/* Footer columns. Every href resolves to a page that exists -- the live site
   links to Case Studies, Testimonials, Our Team and Partners, none of which
   this site has or will have. */
export const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'Akronix CRM', to: '/building#crm' },
      { label: 'Akronix HRMS', to: '/building#hrms' },
      { label: 'Akronix ERP', to: '/building#erp' },
      { label: 'Akronix POS', to: '/building#pos' },
      { label: 'Akronix AI', to: '/building#ai-assistant' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'SaaS Development', to: '/solutions#saas' },
      { label: 'Digital Marketing', to: '/solutions#marketing' },
      { label: 'AI & Automation', to: '/solutions#ai' },
      { label: 'Mentorship & Training', to: '/solutions#mentorship' },
      { label: 'Business Networking', to: '/solutions#networking' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'How We Work', to: '/about#how' },
      { label: 'Contact', to: '/contact' },
      { label: 'Policies', to: '/policies' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Pricing', to: '/pricing' },
      { label: 'What We’re Building', to: '/building' },
      { label: 'Book a Call', to: '/contact#slots' },
      { label: 'Privacy Policy', to: '/policies#overview' },
      { label: 'Terms & Conditions', to: '/policies#execution' },
    ],
  },
]

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akronix-org-106425413/' },
  { label: 'Instagram', href: 'https://www.instagram.com/akronix_org' },
  { label: 'Twitter', href: 'https://twitter.com/akronix' },
]
