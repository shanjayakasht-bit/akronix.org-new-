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
/* The first screen is a short run of slides (Step 7.4), each one a different true
 * thing about the studio, none of them a product: who it is and what it builds
 * (an interface preview), what it does (the eight lines of work), how a job runs (the five
 * steps) and what it costs (the published plans). The home page shows the
 * products further down, and the menu lists them; the hero used to show them
 * as well (Step 7.3) and the client rightly found that the same twelve were
 * everywhere.
 *
 * Every line below is read from, or restates, something already on the site:
 * the lede of slide 1 is the live one, slide 2 the Solutions page's, slide 3
 * its five steps and its "free 30-minute discovery call", slide 4 the Pricing
 * page's. `headline.lead` is set in ink, `headline.rest` in grey, and the full
 * stop is the one red mark, as on every heading.
 *
 * The slide-1 headline was "Build. Connect. Scale." until Step 7.3 -- the live
 * site's line, and one that could be any company's. If it is wanted back:
 * ['Build.', 'Connect.', 'Scale.'] */
export const heroSlides = [
  {
    key: 'studio',
    tab: 'What we build',
    caption: 'Interface preview',
    headline: { lead: 'Business software,', rest: 'and the team to build it with you' },
    lede: 'Akronix is a studio in Chennai. We take on software, marketing and mentorship work for startups and growing businesses, and we are building twelve products of our own.',
    primary: { label: 'Talk to us', to: '/contact' },
    secondary: { label: 'See what we do', to: '/solutions' },
  },
  {
    key: 'work',
    tab: 'What we do',
    caption: 'Eight lines of work',
    headline: { lead: 'One studio,', rest: 'eight ways to help' },
    lede: 'We build software and AI tools, run marketing, and teach. Find the line that fits, or tell us the problem and we will tell you which one it is.',
    primary: { label: 'See what we do', to: '/solutions' },
    secondary: { label: 'Talk to us', to: '/contact' },
  },
  {
    key: 'steps',
    tab: 'How it goes',
    caption: 'From first call to launch',
    headline: { lead: 'Five steps,', rest: 'from first call to launch' },
    lede: 'A written plan with milestones and a price is agreed before work starts. The first call is free and lasts thirty minutes.',
    primary: { label: 'Book a free call', to: '/contact' },
    secondary: { label: 'How we work', to: '/about#how' },
  },
  {
    key: 'price',
    tab: 'What it costs',
    caption: 'Monthly price, to scale',
    headline: { lead: 'Plans with the price', rest: 'on the page' },
    lede: 'Most agencies hide what they charge until a call. These are the monthly plans, with what each one includes, and a note on custom work for anything that does not fit.',
    primary: { label: 'See pricing', to: '/pricing' },
    secondary: { label: 'Talk to us first', to: '/contact' },
  },
]

export const hero = {
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

/* "Selected Work" (Step 7.6): three live sites, with the attribution the client
 * gave and nothing more.
 *
 *  - CICT Digital Library and AUREX'26 were built through internship and team
 *    contributions at the Central Institute of Classical Tamil. They are NOT
 *    presented as commercial projects contracted to Akronix, and neither is called a
 *    client.
 *  - Alagu Crackers: the brief gives a description but no attribution, so none is
 *    claimed. Whether it is a client project, a personal one or Akronix's own needs
 *    confirming before any wording about it is added.
 *  - `tech` is only what could be verified from the live sites themselves (the
 *    Library sends `X-Powered-By: Next.js` and serves `/_next/` assets; AUREX'26 and
 *    Alagu Crackers mount a React root). Nothing else is listed: no hosting, no
 *    database, no backend.
 *  - The screenshots are of the live sites, taken with a headless browser at
 *    1280x800 (the Library after dismissing its announcements pop-up; Alagu Crackers
 *    at its category browser, not its splash page, whose hero carries the shop's own
 *    "10K+ happy customers" figures that are not Akronix's to display). Floating chat
 *    and social widgets that sat over the content were hidden for the capture. No
 *    figures, testimonials or outcomes are claimed for any of them. */
export const selectedWork = {
  eyebrow: 'Selected work',
  title: 'Selected',
  accent: 'Work',
  sub: 'Real projects. Practical engineering. Solutions built for real-world use.',
  note: 'Screenshots are of the live sites. Each project belongs to its owner.',
  projects: [
    {
      slug: 'cict-digital-library',
      name: 'CICT Digital Library',
      category: 'Digital library',
      href: 'https://library.cict.in',
      host: 'library.cict.in',
      image: '/work/cict-digital-library.jpg',
      alt: 'Home page of the Classical Tamil Digital Library, with its navigation, a banner and the library’s sections.',
      copy: 'A modern digital library platform developed and deployed through collaborative web development work at the Central Institute of Classical Tamil.',
      attribution: 'Internship and team contribution',
      tech: ['Next.js'],
    },
    {
      slug: 'aurex-26',
      name: 'AUREX’26',
      category: 'Event platform',
      href: 'https://aurexcict.in',
      host: 'aurexcict.in',
      image: '/work/aurex-26.jpg',
      alt: 'Home page of AUREX’26, a 24-hour technology hackathon, with its navigation and a registration button.',
      copy: 'A digital platform developed and deployed to support AUREX’26, a 24-hour technology hackathon organized at CICT.',
      attribution: 'Internship and team contribution',
      tech: ['React'],
    },
    {
      slug: 'alagu-crackers',
      name: 'Alagu Crackers',
      category: 'Digital commerce',
      href: 'https://alagucrackerstheni.in',
      host: 'alagucrackerstheni.in',
      image: '/work/alagu-crackers.jpg',
      alt: 'The Alagu Crackers store, showing a search bar and the product categories.',
      copy: 'A digital commerce solution featuring product browsing, order management, administrative workflows, and business operations.',
      attribution: null,
      tech: ['React'],
    },
  ],
}

export const tools = ['HubSpot', 'Google', 'BNI', 'Meta', 'GitHub', 'Hostinger', 'ZOHO', 'Microsoft', 'AWS']

/* The four lines of work, as the homepage's accordion states them (Step 7.6
 * rewrite). Each sentence now says what the line is, using only what
 * `solutions.js` already says about it -- the lists of work, and for Networking
 * that it is forming and modelled on BNI. The live site's one-liners ("generate
 * leads, build brands and accelerate business growth", "creates opportunities")
 * promised outcomes nothing here can back, so they are gone. */
export const pillars = [
  {
    eyebrow: 'Engineering',
    title: 'Software Solutions',
    copy: 'Custom SaaS, white-label products, CRM and ERP systems, and AI and automation, built around how your business already runs.',
    items: ['SaaS Development', 'White-Label Products', 'CRM & ERP Systems', 'AI & Automation'],
    cta: 'Explore Software',
    to: '/solutions#saas',
  },
  {
    eyebrow: 'Marketing',
    title: 'Digital Growth',
    copy: 'Search, social and performance marketing, branding and content, planned around goals you can measure.',
    items: ['SEO & SEM', 'Social Media Marketing', 'Performance Marketing', 'Branding & Content'],
    cta: 'Explore Marketing',
    to: '/solutions#marketing',
  },
  {
    eyebrow: 'Community',
    title: 'Business Networking',
    copy: 'A referral community for founders, freelancers and small business owners, modelled on BNI. It is forming now.',
    items: ['Tailored Networking', 'Mentorship Networking Events', 'Business Communities', 'Strategic Partnerships'],
    cta: 'Join the Network',
    to: '/solutions#networking',
  },
  {
    eyebrow: 'Learning',
    title: 'Academy & Mentorship',
    copy: 'One-to-one mentorship, workshops and training for students, early founders and teams.',
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
    title: 'Integrated services',
    copy: 'Software, marketing, mentorship and networking from one studio, so related work stays coordinated.',
    to: '/solutions',
    cta: 'See all eight solutions',
  },
  {
    title: 'Mentorship',
    copy: 'One-to-one sessions and workshops for students and early founders, on product, technical and career decisions.',
    to: '/solutions#mentorship',
    cta: 'About mentorship',
  },
  {
    title: 'AI and automation',
    copy: 'Assistants, chatbots and workflow automation that take repeated steps out of a team’s week, built on your own material.',
    to: '/solutions#ai',
    cta: 'About AI & automation',
  },
  {
    title: 'Networking',
    copy: 'A referral community for founders and small business owners, modelled on BNI. It is forming now; register interest to hear first.',
    to: '/solutions#networking',
    cta: 'Register interest',
    stage: 'Forming',
  },
  {
    title: 'Built to scale',
    copy: 'Multi-tenant architecture and cloud setup from the first sprint, so a product does not need rebuilding when it grows.',
    to: '/solutions#saas',
    cta: 'About SaaS development',
  },
  {
    title: 'Ongoing support',
    copy: 'We keep maintaining what we build. Scope, milestones and price are agreed up front, and stay in view.',
    to: '/about#how',
    cta: 'How we work',
  },
]

export const quote = {
  /* Step 7.6: this line has been rewritten twice. It was the live site's "We don't just
     build software. We build relationships, solutions and futures." (filler), then
     "One team answers for the whole job" (an unsupported claim). It now states what
     the studio's own About page lists as its second working principle: that scope,
     milestones and price are written down before work begins. */
  text: ['Scope, milestones and price are written down before work begins,', 'so progress is something you can see.'],
  /* Set to a real URL to make the Watch Video button appear. Until then the
     button does not render -- there is no video to watch. */
  videoUrl: null,
}

export const finalCta = {
  eyebrow: 'Get started today',
  headline: 'Ready to Talk About Your Project?',
  copy: 'Tell us what you’re building or trying to fix — we’ll tell you honestly whether and how we can help.',
}
