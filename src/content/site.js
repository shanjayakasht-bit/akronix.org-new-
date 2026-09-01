/* Single source of truth for anything that appears in more than one place.
 *
 * NOTE: `email` is an open question — the live contact page uses a Gmail address
 * while the policies page uses admin@akronix.org. A custom-domain address reads
 * materially better. Change it here and it changes everywhere.
 */
export const site = {
  name: 'Akronix',
  email: 'akronix.in@gmail.com',
  phone: '+91 93607 45895',
  phoneHref: 'tel:+919360745895',
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
}

/* Policies is deliberately absent — it belongs in the footer, not the nav. */
export const nav = [
  { to: '/building', label: 'Products' },
  { to: '/work', label: 'Solutions' },
  { to: '/work', label: 'Pricing' },
  { to: '/studio', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

/* Footer columns. Every href resolves to a page that exists -- the live site
   links to Case Studies, Testimonials, Our Team and Partners, none of which
   this site has or will have. */
export const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'Akronix CRM', to: '/building' },
      { label: 'Akronix HRMS', to: '/building' },
      { label: 'Akronix ERP', to: '/building' },
      { label: 'Akronix POS', to: '/building' },
      { label: 'Akronix AI', to: '/building' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'SaaS Development', to: '/work' },
      { label: 'Digital Marketing', to: '/work' },
      { label: 'Business Networking', to: '/work' },
      { label: 'Mentorship', to: '/work' },
      { label: 'AI & Automation', to: '/work' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/studio' },
      { label: 'How We Work', to: '/studio' },
      { label: 'Contact', to: '/contact' },
      { label: 'Policies', to: '/policies' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Pricing', to: '/work' },
      { label: 'What We’re Building', to: '/building' },
      { label: 'Book a Call', to: '/#slots' },
      { label: 'Privacy Policy', to: '/policies' },
      { label: 'Terms & Conditions', to: '/policies' },
    ],
  },
]

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akronix-org-106425413/' },
  { label: 'Instagram', href: 'https://www.instagram.com/akronix_org' },
  { label: 'Twitter', href: 'https://twitter.com/akronix' },
]
