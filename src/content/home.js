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
  headline: ['Build.', 'Connect.', 'Scale.'],
  /* Step 6: the hero gained a sentence. A corporate first screen says in plain
     words who is speaking and what they do; the headline alone could be any
     company's. Every clause is true today -- it says "building", never "built". */
  lede: 'Akronix is a studio in Chennai. We take on software, marketing and mentorship work for startups and growing businesses, and we are building twelve products of our own.',
  /* A film, if there is one (Step 6: it is its own band directly under the
   * hero now, not a frame inside it).
   *
   * Both null until real files exist. While null NOTHING renders -- not a
   * placeholder, and certainly not a mocked-up product screen. Akronix has
   * shipped nothing, so a fabricated product demo would be the exact failure
   * this rebuild exists to remove.
   *
   * Drop an .mp4 into /public (e.g. /public/demo.mp4) and set:
   *   videoUrl: '/demo.mp4',
   *   videoPoster: '/demo-poster.jpg',
   * and the Film band appears, with a Play control. */
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
    to: '/solutions#saas',
  },
  {
    eyebrow: 'Grow your brand',
    title: 'Digital Growth',
    copy: 'Data-driven marketing strategies that generate leads, build brands and accelerate business growth.',
    items: ['SEO & SEM', 'Social Media Marketing', 'Performance Marketing', 'Branding & Content'],
    cta: 'Explore Marketing',
    to: '/solutions#marketing',
  },
  {
    eyebrow: 'Connect & collaborate',
    title: 'Business Networking',
    copy: 'A networking ecosystem that connects, mentors, collaborates and creates opportunities.',
    items: ['Tailored Networking', 'Mentorship Networking Events', 'Business Communities', 'Strategic Partnerships'],
    cta: 'Join the Network',
    to: '/solutions#networking',
  },
  {
    eyebrow: 'Learn & grow',
    title: 'Academy & Mentorship',
    copy: 'Helping students, startups and professionals up-skill, find mentorship and unlock opportunities.',
    items: ['Startup Mentorship', 'Fund Your Projects', 'Workshops & Internships', 'Business Guidance'],
    cta: 'Explore Academy',
    to: '/solutions#mentorship',
  },
]

/* "Why Businesses Choose Akronix", rewritten in Step 5.2 for `WhyAkronix`.
 *
 * The live six titles are kept; the copy under each was a generic one-liner
 * ("Guidance from industry experts") and is now something a visitor can
 * check, or says the stage where one applies -- Networking is still forming.
 * Each row links to the page that backs it up, so the claim and its evidence
 * sit one click apart. */
export const advantages = [
  {
    title: 'Complete Ecosystem',
    copy: 'Software, marketing, mentorship and networking under one roof, so you brief one team instead of four.',
    to: '/solutions',
    cta: 'See all eight solutions',
  },
  {
    title: 'Expert Mentorship',
    copy: 'One-to-one sessions and workshops for students and early founders, on product, technical and career decisions.',
    to: '/solutions#mentorship',
    cta: 'About mentorship',
  },
  {
    title: 'AI-Powered Growth',
    copy: 'Assistants, chatbots and workflow automation that take repeated steps out of a team’s week, built on your own material.',
    to: '/solutions#ai',
    cta: 'About AI & automation',
  },
  {
    title: 'Strategic Networking',
    copy: 'A referral community for founders and small business owners, modelled on BNI. It is forming now; register interest to hear first.',
    to: '/solutions#networking',
    cta: 'Register interest',
    stage: 'Forming',
  },
  {
    title: 'Scalable Solutions',
    copy: 'Multi-tenant architecture and cloud setup from the first sprint, so a product does not need rebuilding when it grows.',
    to: '/solutions#saas',
    cta: 'About SaaS development',
  },
  {
    title: 'Long-Term Partnership',
    copy: 'We keep maintaining what we build. Scope, milestones and price are agreed up front, and stay in view.',
    to: '/about#how',
    cta: 'How we work',
  },
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
