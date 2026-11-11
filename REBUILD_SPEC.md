# Akronix website: rebuild specification

Everything needed to recreate the site on another platform (Webflow, Framer, Next.js, Astro, Flutter web, etc.). Derived from the source in `src/`. Exact copy lives in `src/content/*.js`; tokens in `src/styles/index.css`.

## 1. What it is

Marketing site for **Akronix**, a Chennai studio. It does software and AI work, digital marketing, mentorship and business networking, and is building 12 SaaS products of its own.

Ground rules that shape every page (from CLAUDE.md):
- The company has **zero clients and no shipped products**. Never show invented metrics, testimonials, client or partner logos, or fake dashboards.
- Products must always carry their true stage: "Coming soon" (6) or "Planned" (6). There is no "Demo" or "Buy" button.
- Tone: corporate, like a large multinational. White ground, sharp square corners, one red accent, one typeface.
- Exceptions the client asked for: a glass-pill nav, a glossy and curved Pricing page, and interface sound on About.

Current stack: React 19, Vite, Tailwind v4, `motion` (Framer Motion), Lenis smooth scroll, React Router 7. JavaScript only.

## 2. Design tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| paper | #FFFFFF | page ground |
| mist | #F3F4F6 | alternate light sections |
| fog | #E9EBEF | |
| ink | #0B0C0F | text and black sections |
| ink-2 | #454B54 | body copy |
| ink-3 | #78808B | labels, muted text |
| rule | #E1E3E8 | hairlines |
| coal | #0B0C0F | dark sections, footer |
| graphite | #14171C | secondary dark |
| **brand** | **#DD1916** | the one accent (the red "I" of the logo) |
| brand-soft | #FF574D | red on black |

Product colours (solid for "Coming soon", tint for "Planned"):
CRM #2563EB/#DBEAFE · HRMS #16A34A/#DCFCE7 · ERP #EA580C/#FFEDD5 · Inventory #0D9488/#CCFBF1 · POS #E11D48/#FFE4E6 · AI Assistant #7C3AED/#EDE9FE · Attendance #0284C7/#E0F2FE · Project Mgmt #059669/#D1FAE5 · Books #D97706/#FDE68A · E-commerce #DB2777/#FBCFE8 · LMS #9333EA/#F3E8FF · Helpdesk #65A30D/#ECFCCB

Home "interface" palette (hero preview and product showcase only): cream #F2F0EA, charcoal #101217, navy #172033, violet #7047EB, grey #A7A9AD. Showcase slabs use a matte accent per product (for example CRM #86A4E0, HRMS #8DBB9F, ERP #D49A78, AI #A99AF2 on a #241F3D panel).

### Typography
- **IBM Plex Sans (variable weight)** is the only family. There is no italic and no monospace.
- Headings are weight 300–400, never bold. Small uppercase labels carry the weight.
- Scale (fluid `clamp`):
  - display: 3.25rem → 9rem, line height 0.94, tracking −0.045em
  - h1: 2.5 → 5rem, 1.02, −0.035em
  - h2: 1.875 → 3.125rem, 1.08, −0.03em
  - h3: 1.375 → 1.875rem
  - lede: 1.125 → 1.375rem, 1.5
  - body: 17px, 1.65
  - ui: 15px
  - mark (eyebrow labels): 12px, uppercase, tracking 0.14em
- Heading device: first half in ink, second half in grey (`ink-3`), ending in a single **red full stop**.
- Numbers use tabular figures.

### Shape and layout
- Radius is 0 everywhere except: the nav pill, the nav dropdown (28px), status dots, and the Pricing page (32px and up).
- Breakpoints are Tailwind defaults plus `wide` = 1360px. The client reviews at 1512×860 in Safari, and at 375 on mobile.
- Section padding: `md` is 64px (phone) / 96px (≥md); `lg` is 96 / 128px.
- Sections alternate white, grey and black. The change of ground is the only separator.
- Focus ring: 2px brand red, 3px offset. Text selection: red background, white text.

### Gloss (Pricing page only)
- `.gloss` (light):
  - vertical gradient #FFF → #F1F3F7 → #E5E9EF
  - 1px border at 9% ink
  - inset white top highlight
  - soft drop shadow
  - a pale elliptical "dome" pseudo-element across the top
- `.gloss-dark` (frosted glass):
  - 155° white wash from 18% down to 2.5%
  - `backdrop-filter: blur(24px) saturate(1.5)`
  - 16% white border, bright top rim, radial dome
- On hover, a skewed (−18°) white band sweeps across over 1.2s with `cubic-bezier(.16,1,.3,1)`.

## 3. Global motion system

| Item | Behaviour |
|---|---|
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for nearly everything |
| Smooth scroll | Lenis, `lerp: 0.09`; disabled under reduced motion |
| Page transition | `<main>` fades and rises 12px in 0.5s; exit is opacity only, 0.2s (mode "wait") |
| Scroll progress bar | 2px red line at the top, `scaleX` bound to page progress through a spring (stiffness 320, damping 40) |
| Reveal | Block rises 32px and fades in over 900ms the first time it is 6% inside the viewport. Staggers use fixed delays (for example 120ms) |
| **Roll text** (every link and button) | Each letter is doubled. On hover the visible copy climbs out of its box while an identical copy climbs in from below. 520ms each, stagger 18ms per letter, up to 26 letters. Triggered from the whole control, padding included |
| Button | 1px square border. A second colour wipes in from the left (scaleX 0→1, 550ms) behind the label. The label rolls and the arrow nudges 4px right. Variants: primary (ink→red), outline (→ink), onDark (white→red), onDarkGhost, quiet (underline, goes red) |
| Scroll highlight | A statement lights letter by letter. Each letter's opacity is mapped to scroll progress (`start 0.85` → `start 0.18`). Dim is 15% white, lit is white. A single shared letter index, so lines light in sequence |
| Counter | Counts 0→N in 1.6s (expo-out) when in view. Only used for true counts: 12 products, 8 lines of work, 5 steps |
| Marquee | Infinite ticker. Its speed adds scroll velocity (smoothed by a spring), and it reverses when scrolling up |
| Reduced motion | Hard stop: all durations → ~0, Lenis off, ticker and slide timers off, reveals simply shown |
| Blink / radar / sweep / tour keyframes | See section 5 |

Accessibility: skip-to-content link, `inert` on hidden slides, sr-only copies of letter-split text, `aria-roledescription="carousel"` on the hero.

## 4. Shell (on every page)

### Nav: liquid-glass pill
- Sticky at the top, fully rounded, floating. Max width 96rem. 12px (mobile) / 32px (md+) gutter.
- Left: the cropped logo mark, plus the red-I AKRONIX wordmark while the pill is wide.
- Links: **Home** (a word, not an icon), **Products ▾**, **Solutions ▾**, **Pricing**, **About Us**, **Contact**. All are roll-text. There is no active-link underline.
- Right: a "Book a Consultation" pill button, ink with a red hover.
- **Scroll behaviour:** wide while the scroll is under 260px. After that, on desktop only (≥1024px), it contracts to fit its content: the wordmark collapses and the mark stays. The contraction is a 0.7s layout animation.
- **Glass:** 6% white fill, 1px ring, inner white rim highlights, a 2px blur with saturate 1.2 and brightness 1.03.
  - Chromium also applies an SVG displacement filter (`feDisplacementMap`, band 14px, shift 30) driven by a generated map. This bends content at the rim, like an iOS pill.
  - Safari and Firefox get a harder-frosted ring along the rim instead.
- **Self-toning:** the logo, links and button pick black or white by reading the colour actually painted behind them (`elementsFromPoint` plus a walk up the DOM for the first opaque background). Threshold is lightness 0.4. It re-reads on scroll, resize and route change.
- **Dropdowns** (Products, Solutions):
  - A white card with a 28px radius, opening on hover or focus. There is a 140ms grace on leave, and Escape closes it.
  - It enters with opacity 0→1, y 10→0 and scale .97→1 over 0.34s. Rows stagger at 28ms.
  - Each row shows a colour dot (products) or a number (solutions), a label and a hint.
  - The footer row is "See all N …" with a sliding arrow.
  - Menus list only the core items: the 6 in-development products, and the 4 main solutions.
- **Mobile (<1024px):**
  - A "Menu / Close" pill button with three bars that fold into an X (outer bars converge and rotate ±45°, the middle bar scales out).
  - A full-screen white sheet fades in. It has 28px items and expandable sub-lists (height 0 → auto). Page scroll is locked while open.
- Every opening block of a page uses `NAV_PULL` (negative top margin equal to the nav height, 78px / 82px) so its ground and artwork run **behind** the pill.

### Footer
- Black. Logo, one line of intent, contact details, a four-column sitemap (Products, Solutions, Company, Legal). Privacy and Terms deep-link into Policies tabs.
- Legal row.
- A large vector outline of the brand figure sits at the bottom, bleeding off the corner. Its stroke draws itself over 2.6s when scrolled into view.

### Brand figure (signature graphic)
- A vector human figure (body, leg, head). The head is red.
- Hero version:
  - strokes trace in sequence (body → leg → head) using `pathLength`
  - the shapes then take a faint fill, and the head fills red
  - a light band sweeps across every few seconds, clipped to the silhouette (7s loop, 3.4s start delay)
  - behind it sit a solid ring and a slowly turning dotted ring
- Appears in many places:
  - on About, the head follows the cursor on a spring (stiffness 70) while the body leans the other way
  - on Pricing, drawn very large behind the plans
  - on product cards, faint, and re-traced over 1.5s on hover
  - in the footer
- Source geometry: `src/components/brand/figure.js`. Its trace scripts are in `scripts/figure/`.

## 5. Keyframes and CSS animations

| Name | Effect |
|---|---|
| `akx-blink` | 1s step blink (opacity 1 → 0.18) on the studio clock colon |
| `akx-radar` | 9s linear rotation of a conic-gradient wedge (a 55° trail, 22% white) |
| `akx-sweep` | 7s ease-in-out: a skewed highlight crosses the hero figure |
| `akx-tour` / `akx-slide` | scaleX 0→1 progress fill; 5.5s (showcase) and 7s (hero tab) |

## 6. Pages

Routes: `/`, `/building`, `/solutions`, `/pricing`, `/about`, `/contact`, `/policies`, `*` (404). `/work` redirects to `/solutions`, and `/studio` redirects to `/about`. Non-home pages are lazy-loaded and prefetched 3.5s after the home page settles.

### 6.0 Shared inner-page opening (`PageIntro`)
- Breadcrumb, then a large light headline in 3 lines, set left (about 8 columns).
- Each line is `overflow-hidden`, and its text slides up from 100% over 1.1s, staggered by 110ms.
- On the right, a narrow column with the lede and two buttons, all fading up (0.9s with a delay).
- Along the bottom, a row of "facts". Numbers count up and strings just set. Facts fade in at 0.7s + 80ms each.
- Variants: dark ground, glossy tiles (Pricing), an optional `aside` graphic, and optional children inserted under the headline.
- Closing blocks (`CtaBand`): the question set large on the left, a sentence and two buttons on the right, on grey. Fades up in 0.8s.

### 6.1 Home `/`
Order: Hero → (Film, which renders nothing without a video) → Pillars → Showcase → WhyAkronix → Tools → FinalCta → Footer.

1. **Hero: four auto-rotating slides**
   - Layout: white on the left (58.3%), a grey panel on the right from `lg`.
   - Left: the headline (light weight, up to 84px, grey second half, red full stop), lede, a primary button and a quiet button.
   - Right: the slide's picture, with a caption and "01 / 04".
   - Timing: 7s dwell. Parts of a slide arrive 120ms apart (translate-y 16px and opacity, 800ms). They leave in 300ms.
   - Control: pauses on hover or focus, and when off-screen. There is a Pause control. Four tabs underneath each fill (`akx-slide`) as time runs, and clicking one jumps to that slide. Under reduced motion it never advances on its own. Hidden slides are `inert`.
   - Slide headlines:
     1. "Business software, / and the team to build it with you." Picture: an interface preview (`HeroShowcase`), a window with a sidebar and 3 views (overview with a drawn chart, records table, automation flow). It contains placeholder bars only, with no numbers. The chart draws over 1.6s, and rows settle in sequence.
     2. "One studio, / eight ways to help." Picture: a ruled index of the eight lines of work.
     3. "Five steps, / from first call to launch." Picture: a vertical steps rail.
     4. "Plans with the price / on the page." Picture: `PriceLadder`, with columns growing from the baseline over 1.2s.
2. **Pillars:** four panels side by side.
   - The open panel animates `flexGrow` 2.6 vs 1 on a spring (stiffness 130, damping 24). It turns black with white text. Hover, focus or click opens it.
   - Content: "Software Solutions", "Digital Growth", "Business Networking", "Academy & Mentorship".
   - Panel titles hold a 10ch measure and the body is fixed at 26rem, so text never reflows while the width moves.
   - Below `lg` it becomes a normal accordion with a plus that collapses to a minus.
3. **Showcase ("Our Premium Products"):** twelve upright slabs side by side.
   - One is open at a time (spring, stiffness 120, damping 22). It auto-tours every 5.5s with a progress line.
   - Each slab is matte: dark for the 6 in development, light for the 6 planned. Each has a single accent rule, a stage dot and a stage word.
   - The brand figure re-traces behind the open slab's code.
   - Each slab links to `/contact?product=…` as an early-access request.
4. **WhyAkronix:** a heading column that is sticky (`top-32`). Six ruled rows pass by on the right.
   - The row crossing mid-screen is "reading": its number turns red, a 3px red bar slides down its left edge, and its title goes to full strength and its link opens. Hover does the same.
   - Every row links to the page that backs the claim.
5. **Tools:** nine technology names set as plain type in a ruled grid (2/3/5 columns). Grey text goes to ink on hover, and a 1px underline draws in over 500ms. A tenth cell states these are tools used, not partners. No logos.
6. **FinalCta + Booking:** the question on the left, a 3-step scheduler on the right (date → time → email → result).
   - Steps cross-fade in 0.45s.
   - There is no backend. It opens the visitor's mail client, and the confirmation says only that. `site.bookingEndpoint` is null.
   - Anchors `#book` and `#slots` are used by other links.

A "Selected Work" band (3 real projects: CICT Digital Library, AUREX'26, Alagu Crackers, images in `public/work/`) was removed at the client's request. The data remains in `home.js`.

### 6.2 Products `/building`
- Intro headline: "Our Products, Built to Power Your Business". Under it sits the **Spectrum**:
  - A strip of 12 colour blocks. Built products are solid; planned ones are outlines.
  - Hover or focus makes a block take a larger share on a spring (stiffness 150) while its name and stage appear.
  - Blocks grow up from the baseline left to right on arrival (1.1s, 60ms stagger).
  - Click clears the filters, scrolls to that card and flashes it for 2.6s. A `#slug` link does the same.
  - Blocks filtered out by the grid below are dimmed.
- **Portfolio:**
  - Category chips: All, CRM, HR & Workforce, Operations, Finance, Education, Retail, AI & Automation, with live counts.
  - Stage chips: All, In development, Planned. A choice that leaves zero results is disabled.
  - The active chip is a black block that slides between chips (shared `layoutId`).
  - A Cards / List switch.
  - When filtering, cards shrink and fade out, the rest glide, and arriving cards rise in.
  - A card has a 56px app tile in the product colour, a coloured top bar, the name, what it is for, and what it is being built to do. A faint figure sits in the corner and re-traces on hover.
  - Every card opens the contact form with the product chosen ("early access").
- Then an "Advantages" row of 4 ruled cells. On hover a black ground rises from the cell's foot over 650ms and the text turns white.
- Then a QuoteBand (the studio-model statement, lit letter by letter on black).
- Then "Have a Unique Requirement?".

### 6.3 Solutions `/solutions`
- Eight lines of work as a ledger.
  - A **sticky ServiceRail** on the left: a vertical track with a square node per line. Red fills down to the line being read, segment by segment. The active node is larger and pulses once. The active row expands to show its one-liner, and passed rows are marked. A counter rolls to the new number. A button at the foot changes per line, for example "Discuss AI & Automation".
  - On the right, ruled rows. Each hairline draws in as its row arrives (1.3s). A huge, faint index numeral sits behind each row and parallax-drifts at its own speed. Each row has a name, purpose, a two-column list of what it covers, and a button to `/contact?service=<slug>`.
- **Process (pinned horizontal read) on black:**
  - The section is tall and the inner frame is `sticky`. Vertical progress maps to the track's `x`.
  - The step at the left margin is lit, and neighbours fade (opacity and a lift of 24px or 12px). A bottom line fills with progress and the step names light as it reaches them.
  - Below `md`, and under reduced motion, it is a plain vertical list.
  - Copy: "Five steps, from first call to launch".
- Then CtaBand: "Tell us the …".

### 6.4 Pricing `/pricing` (glossy)
- Hero: white, with rounded glazed fact tiles. On `wide` screens the empty end shows **PriceLadder**, four columns drawn to scale (Business full height, Growth ½, Starter ⅕), growing from the baseline over 1.2s. Enterprise is a dashed, open-top column that fades upward.
- **Plans** on a black, large-radius stage:
  - Lit from above by a slow red light, with the brand figure very large behind, so the frosted `.gloss-dark` cards blur it.
  - Plans: **Starter ₹999 / Growth ₹2,499 / Business ₹4,999 / Enterprise Custom** (monthly, no contract).
  - A "finder" above them ("student/founder", "growing business", "established company", "large organisation") lights the matching plan. The lit plan becomes white glass with a red ring.
  - The finder's white pill and the ring both slide between targets on a spring (stiffness 260–380). Cards enter staggered at 90ms.
  - Each plan's button goes to `/contact?plan=…`.
- **EveryPlan:** a matte comparison table, grouped (Mentorship and learning, Digital marketing, Networking, Consultation and delivery, Discounts, Support, Platform and security).
  - Plain ticks and dashes. No animation.
  - Sticky header under the nav (`md:top-[5.25rem]`) with a solid ground. It scrolls sideways below 768px.
- **CustomPlan** ("Need something larger?"): six toggle buttons. Picked ones light like the chosen plan. The CTA sends `?plan=enterprise&custom=0,3`.
- **GlossFaq:** six questions, each with a one-line verdict and long answers.
  - The question index is sticky on the left and the one being read is red. Click glides to its answer.
  - Below 1024px the index goes away.
- **GlossCta:** a large rounded black card with a red glow (an 18s loop), the figure drawn across it, glass pills, and three glass "what happens next" steps.

### 6.5 About `/about` (with sound)
- **Sound:**
  - Off by default. Toggled by a switch under the headline, plus a small floating one. The choice is stored in `localStorage` key `akx-sound`.
  - All sounds are synthesised in Web Audio. There are no audio files: oscillators and filtered noise, through a compressor at master gain 0.85.
  - The audio context is only started after a user gesture.
  - Hover on any link, button or `data-sound` element plays a soft tick once (not on touch). Click gives a click. A sheet taking the top gives a paper-swipe. The two-note chime and the pulse are also in `lib/sound.js`.
  - Implemented by one delegating wrapper (`SoundScope`).
- Hero: the **PointerFigure**, with a red head tracking the cursor.
- **QuoteBand:** the purpose statement lit letter by letter on black.
- **Studio:** two cards.
  - Left: a radar over Chennai (3 rings, 9s sweep, a pin that pings). There are no blips, because a blip would imply a client.
  - Right: a live **IST clock** with seconds, a blinking colon, and "Open now / Closed". Hours are Mon–Sat 9–19 IST, computed with `Intl.DateTimeFormat` in `Asia/Kolkata`. Under the clock, a 7-cell week with today lit and Sunday marked closed.
- **StateBoard** ("state of the studio"): 5 ruled rows, each with its true stage.
  - "In development" and "Forming" rows pulse slowly. This is the only continuous motion on the page. "Open" and "Offered" are settled. "Planned" is a hollow marker.
  - Product rows carry 6 solid and 6 pale colour blocks that lift in sequence on hover.
  - Rows link to evidence and get a left bar on hover.
- **Principles:** five working principles as a stack of sheets.
  - Each is sticky and the next slides over it. Buried sheets scale down and darken.
  - A red bar down each sheet's left edge fills as its turn comes and stays filled.
  - Each sheet has a small diagram (`PrincipleArt`, 8.5rem tall) whose strokes draw with scroll progress. The 3rd sheet is black.
  - Sound: a paper swipe when a sheet takes the top.
- CtaBand close.

### 6.6 Contact `/contact`
- Intro with buttons "Write to Us" (`#form`) and "Pick a Time" (`#slots`).
- White band: a Details column (email, two phones, hours, location, a four-step "what happens next") and the **ContactForm** (the form rises 40px on scroll in, 0.9s).
  - Fields: name, email, company, topic, plan, message.
  - Prefill from the URL: `?product=`, `?service=`, `?plan=`, `?custom=`. A product choice turns it into an "Early access" request with a note that the product is in development.
  - Submit: `site.contactEndpoint` is null, so it opens the visitor's mail client. The success text must only say that. If an endpoint is set, it POSTs JSON.
  - The success state draws a tick (`pathLength`) over about 0.8s.
- Grey band: the Booking scheduler.
- FAQ: question on the left and answer on the right, with a hairline that draws across above each pair (1.1s). The heading column is sticky.

### 6.7 Policies `/policies`
- Four documents in a tabbed sheet (legal and operational overview, referral network terms, how an engagement runs, event ground rules). Footer links deep-link to tabs.
- Switching: the old sheet lifts and fades out (0.2s), then the new one fades in. Parts rise at 80ms stagger. Each clause's rule draws across from the left (about 1s), as if typeset.
- Text was reworded so that it claims nothing untrue. See the header of `content/policies.js`.

### 6.8 404
Light band: "That page isn't here." with a red full stop, a lede, and a button home.

## 7. Content inventory (`src/content/`)

| File | Contents |
|---|---|
| site.js | Name, email `akronix.in@gmail.com`, phones +91 97157 94422 and +91 88254 3947 (the second is 9 digits, published as given), Chennai, hours, nav tree, footer columns |
| home.js | 4 hero slides, pillars, why-Akronix rows, tools, final CTA, unused selected-work data |
| products.js | 12 products: name, code, category, accent, stage, "building" flag, copy |
| solutions.js | 8 lines of work (4 flagged `core`), the 5-step approach |
| pricing.js | 4 plans, comparison groups, custom-plan options, FAQ, close |
| about.js, building.js, contact.js, policies.js, faq.js, services.js | per-page copy |

Products (stage): CRM, HRMS, ERP, Inventory, POS, AI Assistant are **Coming soon**. Attendance, Project Management, Books, E-commerce, LMS, Helpdesk are **Planned**.

The 8 solutions: SaaS development, web and mobile, AI and automation, digital marketing, cloud and DevOps, IT consulting, mentorship and training, business networking.

## 8. Assets and SEO
- Logo: `public/logo/logo-new.webp` and `logo-new-light.webp` (a 555px raster, not enough for large display). Also `favicon-mark.svg`, `favicon.svg` and `og.png` (1200×630).
- Work images: `public/work/*.jpg`.
- JSON-LD `Organization` in `index.html`. The `<Seo>` component sets the title and description per page. Includes sitemap.xml and robots.txt.
- Theme colour #0B0C0F. Social links: LinkedIn, Instagram, Twitter.

## 9. Porting notes
1. **Hardest to reproduce:** the glass nav (SVG displacement is Chromium only), the self-toning logic, the pinned horizontal process, the letter-by-letter scroll highlight, `pathLength` figure drawing, and the synthesised sound. Anywhere without scroll-linked animation (basic Webflow or Framer), fall back to a simple reveal.
2. **Roll text** is pure CSS: doubled letters, a per-letter transition delay, and a named group hover. It ports to any platform.
3. Entrance effects were deliberately written as **CSS class swaps** (not `motion` `initial`), because of a bug where `initial` is ignored on a hard load. Keep that in mind if you use a similar library.
4. Forms and booking currently have **no backend**. Pick a form service or API and keep the honest "request is on its way" wording unless something truly receives it.
5. Keep the constraints in section 1 on any platform. They are the point of the redesign.
6. History and rationale for every decision is in `STATUS.md` (about 180 KB). Search it by "Step N" before changing anything.
