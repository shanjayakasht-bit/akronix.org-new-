/* Homepage content, matching the section order of the live akronix.org.
 *
 * Honesty notes kept with the data, so a future session sees them:
 *  - The tools strip is the ONLY logo row. The live site shows the same logos
 *    twice, the second time as "Our Trusted Partners" -- these are tools the
 *    studio uses, not partnerships, and that framing is dropped. Client agreed.
 *  - "Watch Video" is built but hidden: `quote.videoUrl` is null and the button
 *    does not render until a real URL is set. Client asked to keep the slot.
 *  - Products carry a "Coming soon" tag. None has shipped.
 */
export const hero = {
  /* The eyebrow line was removed at the client's request -- the four
     capabilities below now sit at the top of the hero and say the same thing
     more concretely. */
  headline: ['Build.', 'Connect.', 'Scale.'],
  capabilities: ['Software Development', 'Digital Marketing', 'Business Networking', 'Mentorship'],

  /* The hero demo video.
   *
   * Both null until real files exist. While null the hero renders a plainly
   * labelled placeholder frame -- NOT a mocked-up product screen. Akronix has
   * shipped nothing, so a fabricated product demo would be the exact failure
   * this rebuild exists to remove.
   *
   * Drop an .mp4 into /public (e.g. /public/demo.mp4) and set:
   *   videoUrl: '/demo.mp4',
   *   videoPoster: '/demo-poster.jpg',
   * The scroll behaviour works identically either way. */
  videoUrl: null,
  videoPoster: null,
}

export const tools = ['HubSpot', 'Google', 'BNI', 'Meta', 'GitHub', 'Hostinger', 'ZOHO', 'Microsoft', 'AWS']

export const pillars = [
  {
    eyebrow: 'Build powerful products',
    title: 'Software Solutions',
    copy: 'Custom SaaS, white-label products, CRM, ERP, AI applications and more to power your business.',
    items: ['SaaS Development', 'White-Label Products', 'CRM & ERP Systems', 'AI & Automation'],
    cta: 'Explore Software',
    to: '/work',
    tone: 'teal',
    glyph: 'Code',
  },
  {
    eyebrow: 'Grow your brand',
    title: 'Digital Growth',
    copy: 'Data-driven marketing strategies that generate leads, build brands and accelerate business growth.',
    items: ['SEO & SEM', 'Social Media Marketing', 'Performance Marketing', 'Branding & Content'],
    cta: 'Explore Marketing',
    to: '/work',
    tone: 'sage',
    glyph: 'Chart',
  },
  {
    eyebrow: 'Connect & collaborate',
    title: 'Business Networking',
    copy: 'A networking ecosystem that connects, mentors, collaborates and creates opportunities.',
    items: ['Tailored Networking', 'Mentorship Networking Events', 'Business Communities', 'Strategic Partnerships'],
    cta: 'Join the Network',
    to: '/contact',
    tone: 'plum',
    glyph: 'Users',
  },
  {
    eyebrow: 'Learn & grow',
    title: 'Academy & Mentorship',
    copy: 'Helping students, startups and professionals up-skill, find mentorship and unlock opportunities.',
    items: ['Startup Mentorship', 'Fund Your Projects', 'Workshops & Internships', 'Business Guidance'],
    cta: 'Explore Academy',
    to: '/contact',
    tone: 'ember',
    glyph: 'Cap',
  },
]

export const advantages = [
  { title: 'Complete Ecosystem', copy: 'One platform to manage all your business needs.', glyph: 'Grid' },
  { title: 'Expert Mentorship', copy: 'Guidance from industry experts and professionals.', glyph: 'Compass' },
  { title: 'AI-Powered Growth', copy: 'Smart solutions for faster, better decision making.', glyph: 'Bolt' },
  { title: 'Strategic Networking', copy: 'Opportunities that create real growth.', glyph: 'Link' },
  { title: 'Scalable Solutions', copy: 'Built to grow with your business at every stage.', glyph: 'Growth' },
  { title: 'Long-Term Partnership', copy: 'We grow when you grow. Your success is ours.', glyph: 'Handshake' },
]

export const quote = {
  text: ['We don’t just build software.', 'We build relationships, solutions and futures.'],
  /* Set to a real URL to make the Watch Video button appear. Until then the
     button does not render -- there is no video to watch. */
  videoUrl: null,
}

export const finalCta = {
  eyebrow: 'Get started today',
  headline: 'Ready to Talk About Your Project?',
  copy: 'Tell us what you’re building or trying to fix — we’ll tell you honestly whether and how we can help.',
}
