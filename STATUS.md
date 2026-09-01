# Akronix — Status

Rebuild of akronix.org from scratch. Direction agreed and approved; see the plan at
`~/.claude/plans/read-claude-md-in-full-enchanted-brooks.md` for the full sitemap,
content audit, design system and homepage structure.

---

## Done

### Step 3g — Client fix list, after reading nuraform.com (current)

Visited nuraform.com and re-read wisprflow.ai / withjuno.com. Every item on the
client's list actioned:

| Complaint | Cause | Fix |
|---|---|---|
| Highlight lit all lines at once | Each line had its OWN `useScroll` ref, so both progressed together | One shared ref, one continuous word index across all lines |
| Hero fade overlapped the tools slab | Hero had a downward y-parallax while the page scrolled up | y-parallax removed; opacity only, finishing at 55% of the section |
| Accordion open state invisible | Only the text colour changed | Open pillar now gets its own tinted panel, filled icon chip and coloured bullets |
| Advantages "scattered / zig zag" | I offset the right column on purpose to break symmetry | Aligned 3-up card grid. Alignment is what makes a grid legible |
| Booking not premium | Plain bordered box | Step rail (Day / Time / Confirm), serif heading, slot summary panel, Meet block |

#### The Google Meet link — read before changing

`site.meetLink` is **null on purpose**. A Meet code cannot be invented: a made-up
one simply fails to open, which is worse than no link. While null, the panel
says the link arrives with the confirmation email, which is true.

To turn it on: create a room at meet.google.com (New meeting -> Create a meeting
for later), paste the URL into `site.meetLink`, and the panel renders it with a
working copy-to-clipboard button. **Do not generate a placeholder Meet code.**

#### Note on shell heredocs
Writing this JSX through a bash `cat <<'EOF'` heredoc failed with an unbalanced
quote error and applied nothing. Use the Write tool for large JSX files; keep
bash heredocs for short python patches.

### Step 3f — Redesigned after studying the reference sites

Client rejected the previous pass outright and asked me to go and look at other
sites. I opened wisprflow.ai and withjuno.com in the browser and took the
structure from them, not the content.

**What those sites actually do, and what was adopted**
- **Rounded colour slabs.** Each section is a large rounded block sitting ON a
  warm cream page, with cream showing at the margins. This is the single
  biggest change: a long page stops reading as a stack of flat bands.
  `src/components/ui/Slab.jsx`, radius 2.5rem.
- **Floating pill navbar** with a real CTA button, not a full-width bar of
  plain links. The client called the old one "third class" and was right.
- **Centred hero**, tight to the nav. The old one left a dead band of cream
  between header and eyebrow.
- **Serif display with a true italic** for one word — "Build. Connect.
  *Scale.*" This is CLAUDE.md's original signature device, and it is also what
  both reference sites do.

**Palette:** warm cream `#faf7ef` page; deep forest `#12403a`, coal `#191713`
and cocoa `#43302a` slabs; clay `#b4552f` accent. Subtle overall, rich where
the slabs land.

**Products** moved onto the forest slab as rounded cards — it was the weakest
section and is now the centrepiece. Stage tags kept: nothing has shipped.

**Removed:** the slide-to-the-right-on-hover the client specifically called out.
It was on product rows and footer links. Hovers are now colour and scale only.
Do not reintroduce translate-on-hover for text.

Kept from the motion pass: scroll progress bar, word-by-word scroll highlight on
the quote, word-stagger headings, hero parallax, CSS marquee.

### Step 3e — Motion pass

Client: "there is no animations or scroll on reveal or anything?" The reveals
existed but were calibrated far too low to notice — 20px of travel over 0.55s,
which on a Lenis scroll is invisible. Motion is now the point, not a garnish.

**Added**
- `motion/ScrollProgress.jsx` — spring-damped hairline across the top of every
  page, fills as the page is read.
- `motion/ScrollHighlight.jsx` — text that lights word by word against the
  scroll position. Each word owns a slice of the section's progress, so the
  sentence reads at the reader's pace. Used on the quote band.
- Section headings now rise **word by word**, each out of its own mask.
- Hero: the background wash, the copy and the fade are all scroll-linked.
- Quote band: an oversized quotation mark drifts on scroll.

**Strengthened**
- Reveal travel 20px -> 40-44px, durations 0.55s -> 0.75-0.85s, stagger doubled.
- Product rows: blur-to-sharp entry; on hover the row slides 12px, a clay wash
  wipes across, the glyph rotates and scales, the stage tag picks up the accent.
- Advantage glyphs lift, rotate and scale; the rule warms to clay.
- Accordion rows widen their gap on hover; the glyph rotates.
- Nav links grow an underline from zero; footer links slide right.
- Buttons lift 2px.

Everything still collapses under `prefers-reduced-motion` — `ScrollProgress`
returns null, `ScrollHighlight` renders plain lit text, all parallax is skipped.

**Verifying motion in the browser is counter-intuitive.** Transform and opacity
animations run on the compositor, so `getComputedStyle` returns a *stale* value
within a single script execution — the marquee and the progress bar both read as
frozen while visibly moving. Compare across separate tool calls, use
`element.getAnimations()[0].currentTime`, or just take two screenshots.

### Step 3d — Homepage redesigned: subtle palette, CLAUDE.md rules restored

Client rejected the saturated ember/teal/plum design and the exact-clone layout:
"I said similar not exactly", "remember the rules from claude.md", "use a subtle
colour palette", "just take the content exactly from the existing website".

**Content is unchanged** — still exactly the live site's copy, in the same
section order. Only palette and section shapes changed.

#### CLAUDE.md rules are back in force
- Bone white (#f7f5f0) is the ground again; accents are desaturated clay,
  moss, slate and ochre. No saturated fills.
- **No colour gradients anywhere.** Verified: 0 matches for bg-gradient /
  text-transparent in markup.
- Sharp edges: `rounded-control` (2px) and `rounded-full` (the status dot and
  one background wash) are the only radii.
- `font-bold` appears only on h1/h2 and the wordmark. Verified: 0 elsewhere.
- No inline styles outside the booking picker's computed values.

#### Sections reshaped so this is not a clone of the live site
| Section | Live site | Here |
|---|---|---|
| Ecosystem | 2x2 card grid | Numbered accordion; one pillar open, hover to switch |
| Products | 3x2 card grid | Hairline rows: glyph, code, name, line, stage tag |
| Advantages | symmetric 2-col icon grid | Inline glyphs, right column offset so it never grids up |
| Quote | purple/blue gradient card | Full-bleed night section, lines rising into a mask |
| Final CTA | gradient band | Bone section, copy left, booking picker right |

#### Marquee bug — fixed, and worth remembering
The tools strip was frozen. Motion's `animate={{x:['0%','-50%']}}` with
`repeat: Infinity` ran one pass and stopped dead at -50%. It is now a CSS
keyframe (`.akx-marquee` in index.css), which cannot fail that way and pauses
on hover.

**Diagnosing it is counter-intuitive:** the animation is transform-only, so it
runs on the compositor thread and `getComputedStyle().transform` returns a
stale value *within a single script execution*. Compare across separate calls,
or use `element.getAnimations()[0].currentTime`.

### Step 3c — Homepage rebuilt to match the live site's structure

Client supplied a screenshot of the live akronix.org and asked for the same
sections and content with a new design. The previous editorial homepage was
replaced. Sections now, in order:

Hero -> ToolStrip -> Ecosystem -> Products -> Advantages -> QuoteBand ->
FinalCta (with the booking picker) -> Footer.

Components live in `src/components/sections/`; copy in `src/content/home.js`.

#### CLAUDE.md design rules are deliberately overridden here

The client instructed this directly and repeatedly ("not in black white theme",
"not fully in squares and boxes", "fill it with animations"). The following
CLAUDE.md rules no longer hold on the homepage, by client decision:

- white/bone as primary colour -> warm ivory with ember/teal/plum/sage
- minimal rounded corners -> pill buttons, 22px cards, 32px gradient bands
- no gradients -> two full gradient bands, plus gradient headline words
- no icon sets -> a drawn glyph set labels pillars, products and advantages

Type is now Instrument Sans throughout (bold headlines), not Newsreader.
`src/pages/Specimen.jsx` still documents the old system and is now stale.

#### What was NOT carried over from the live site, and why

- **"Our Trusted Partners" logo wall** — removed. Those are tools, not
  partners, and the same names already appear in the tools strip. Client chose
  "one honest logo strip".
- **Footer links to Case Studies, Testimonials, Our Team, Partners** — removed.
  Those pages do not and will not exist. Every footer target now resolves to a
  real route; there is a check for this in the verification block below.
- **Products as purchasable** — every card carries a "Coming soon" tag.
- **"Watch Video"** — the button is built but renders only when
  `quote.videoUrl` in `src/content/home.js` is set. It is null. The client
  asked to keep the slot for a video that does not exist yet.

#### A client instruction that was declined, and stays declined

The client asked to "lie about the products" — drop the stage and add a Demo
button. Declined: it tells a visitor they can try software that does not exist,
which is the failure this rebuild exists to fix. "Coming soon" plus a real
booking flow shipped instead. Do not reverse this without the products existing.

#### Verification

Build clean; SSR renders all 7 routes. Rendered output contains zero hits for
Trusted Partners, 250,000, 1,420, Testimonials, Case Studies, Our Team and
Request Demo. All nav and footer targets resolve to real routes.

Never checked below a 1280px viewport — the browser here will not go narrower.

### Step 3b — Homepage revision after client review (complete)

Client review: the page read "like Wikipedia" -- too much text, one flat ground,
no colour, no icons, no interactive element. Actioned:

- **Content cut hard.** Thesis 4 paragraphs to 2. FAQ 6 questions to 4, one
  paragraph each. Service bodies to a single line. Convictions to one sentence.
  Product lede to two lines.
- **The systems diagram was removed** at client request ("very ugly").
- **Grounds now alternate** -- bone, sand, white, night, sand -- instead of one
  bone tone the length of the page.
- **A logo mark exists** (`src/components/brand/Mark.jsx`): monogram A, one
  stroke weight, crossbar in vermilion extended past both diagonals. Nav,
  favicon, and oversized in the hero with scroll parallax.
- **A drawn icon set** (`src/components/brand/Icons.jsx`) labels the four
  service areas. Same 32-unit box and stroke language as the mark, one vermilion
  element each. Not a stock set -- they do an informational job.
- **Booking slot picker** (`src/components/home/Booking.jsx`) in the contact
  section, at `#book`.

#### The booking picker has no backend — read before changing it

It cannot know real availability, so **it never claims any**. No slot is shown
as "available" and none is shown as taken. The visitor proposes a day and time,
the CTA composes a prefilled mailto, and the copy says plainly: *"Choosing a
time sends us a request; nothing is confirmed until we reply."*

If a real calendar is connected later (Cal.com and Calendly both embed), replace
the component. **Do not bolt fake availability onto it.**

#### A client instruction that was declined

The client asked, in these words, to "lie about the products" -- remove the
stage marker and add a Demo button. That was declined and the reason given: it
tells a visitor they can try software that does not exist, which is the exact
failure that made the current site read as fake, and it is prohibited by this
project's own CLAUDE.md.

What shipped instead, and why it is honest:
- `stage` reads **"Coming soon"** rather than "In development" -- forward
  looking, reads as momentum, and true.
- The CTA is **"Request early access"**, wired to the booking picker. A real
  conversation Akronix can actually have, rather than a product screen that
  does not exist.
- Offered but not yet taken up: "Book a walkthrough" if the word Demo is wanted.

**Do not remove the stage, and do not add a Demo control, without the products
actually existing.** If a future session is asked again, the honest substitutes
above are the answer.

### Step 3 — Homepage (complete)

Seven sections, each a deliberately different shape. The failure this rebuild
exists to avoid is "every section follows heading -> subheading -> grid", so the
shapes are tracked here as a constraint on future pages, not just a record:

| # | Section | Shape | Rules? | Rests on |
|---|---|---|---|---|
| 1 | `Opening` | Full-bleed type, single left stack | no | The studio model — true by definition |
| 2 | `Thesis` | Short heading left, long prose right | no | A market observation. An opinion needs no proof |
| 3 | `Building` | Hairline table rows, 3 columns | yes | Six products, stage-marked |
| 4 | `Takes` | Alternating blocks, cols 1-6 / 7-12 | yes | Four service areas |
| 5 | `HowWeWork` | **Dark ground**, hanging mono numerals | **no** | Three verbatim client answers |
| 6 | `Questions` | Question left, essay right | yes | Six FAQ entries, all traceable |
| 7 | `Contact` | Two large actionable details | yes | contact.md, verified |

**The dark-section budget is now spent.** One was allowed site-wide, two at
most. It went to section 5 rather than the FAQ, because the FAQ is essay-length
reading that would suffer on a dark ground. One remains — spend it deliberately.

**Section 5 is the only section on the page with no hairlines.** The change of
ground does the separating. That is a second axis of difference beyond colour.

**The italic qualifier does not appear in the hero.** A plain statement of
services contains no clause that limits or states a stage, and forcing one would
have made the device decorative — the one thing its rule forbids. It appears in
the headings of sections 2, 3, 4, 5, 6 and 7.

#### Content decisions taken with the client

- **The hero states what the studio does and nothing else.** No location, no
  product count, no company detail. Client directive, given twice and firmly.
  Recorded because it overrides CLAUDE.md's "say something only Akronix could
  say" for that one screen — the FAQ and /building carry that weight instead.
- **Twelve products became six.** The legacy page listed LMS, Helpdesk,
  Attendance, Project Management, Books and E-commerce on top of the six real
  ones. Six is the number that ships.
- **All six product dots are grey (`live: false`).** The vermilion dot is
  reserved for the first product that reaches a usable stage, so that when one
  turns it reads as an event rather than decoration. One flag in
  `src/content/products.js`.
- **Anonymity is answered as a plain preference.** The client's stated reason is
  that they simply do not like team pages — nothing behind it. The FAQ answer
  therefore asserts no rationale beyond that. **Do not later "improve" it into a
  positioning statement ("we let the work speak") — that is a motive the client
  explicitly did not claim.**

#### Deliberately excluded — needs a client answer before it can go back

- **Cloud Development as a standalone service** — migration, DevOps-as-a-service,
  "24/7 monitoring and alerts". Infrastructure currently appears only as running
  what we build ourselves, which needs no staffing claim.
- **IT Consulting's security half** — "penetration testing", "compliance
  frameworks", security hardening audits.
- **"Response Time < 24 Hours — Guaranteed"** from the legacy contact page.
  A guarantee nobody is rostered to honour is the same class of problem as the
  invented metrics, only slower to surface.

Each is one edit away, in `src/content/services.js` and
`src/components/home/Contact.jsx`, which both document what was removed.

#### Verification at completion

Build clean. SSR renders all 7 routes. No `font-bold`/`font-semibold`, no inline
styles, `rounded-*` only on the status dot and the specimen's controls, no
`italic` outside `Qualifier`. Zero hits in rendered output for: 250,000 · 1,420 ·
Trusted by · Proven · testimonial · 5-Star · thousands of · Join hundreds ·
Request Demo · Guaranteed · empower · world-class · cutting-edge.

**Still never seen below a 1280px viewport.** The browser window on this machine
will not go under 1280 CSS px — height resizes, width does not. Nothing uses a
fixed width and all type is `clamp()`, so it should hold, but no breakpoint below
`md` has ever actually been rendered. Verify before launch.

### Step 2 — Shell (complete)

Navigation, footer, routing, transitions. Still no page copy.

| Path | What it is |
|---|---|
| `src/content/site.js` | Nav items, contact details, socials. Single source of truth. |
| `src/components/shell/Nav.jsx` | Sticky nav + mobile overlay. |
| `src/components/shell/Footer.jsx` | Full navigation, contact, text social links. |
| `src/components/shell/ScrollToTop.jsx` | Lenis-aware scroll reset on route change. |
| `src/components/shell/Placeholder.jsx` | Marks unbuilt pages unmistakably. |
| `src/App.jsx` | Routes + page transitions. |
| `src/pages/` | Stubs for the five pages, Policies, and a real 404. |

**Verified:** build passes; all seven routes server-render with nav and footer intact
and unknown paths hit the 404; compliance greps still clean.


---

### Step 1 — Foundation (complete)

Toolchain, design tokens and typography primitives. No page content yet.

**Stack installed:** Vite 8 + React 19 (JS, no TypeScript), Tailwind 4.3,
`motion` 13, Lenis 1.3, React Router 7, Fontsource faces.

**Files:**

| Path | What it is |
|---|---|
| `src/styles/index.css` | All design tokens. Tailwind v4 `@theme` block — the single source of truth for colour, type scale, radius. |
| `src/components/primitives/` | `Type` (Display/H1/H2/H3/Lede/Body/UI/Mark), `Qualifier`, `Rule`, `StageMark`, `Container`/`Grid`, `Section`. Barrel export in `index.js`. |
| `src/lib/SmoothScroll.jsx` | Lenis wrapper, `lerp: 0.09`. |
| `src/lib/usePrefersReducedMotion.js` | Media-query hook. |
| `src/pages/Specimen.jsx` | **Scaffolding, not site content.** Renders every token for visual check. Delete when the shell lands in step 2. |

**Verified:** production build clean; all eight colour tokens and every custom
utility (`text-display`…`text-mark`, `measure`, `rounded-control`) emit into the
compiled CSS; both Newsreader optical-size faces (normal + italic) link correctly.
Compliance greps pass — no `font-bold`/`font-semibold`, no inline `style={{}}`, and
every `rounded-*` is either a control or the stage dot.

---

## Decisions future sessions need

1. **Tailwind v4, CSS-first config.** There is deliberately **no `tailwind.config.js`**.
   Tokens live in the `@theme` block of `src/styles/index.css`. Edit them there.

2. **Framer Motion is installed as the `motion` package** (v13), which is its current
   name. Imports are `from 'motion/react'`. Grepping for `framer-motion` will find
   nothing — this is expected, not a missing dependency.

3. **Every type weight sits at 400.** Hierarchy comes from size and space, not weight.
   This is more editorial *and* it means CLAUDE.md's "no bold except main headings"
   exception never has to be invoked. Do not add weight to create emphasis.

4. **`font-optical-sizing: auto` is set on `body`.** The browser picks Newsreader's
   `opsz` value from the rendered size, which is what stops an 88px headline reading
   as inflated body text. Don't hard-code `font-variation-settings` over it.

5. **Reduced motion is a hard stop.** `SmoothScroll` returns children untouched — Lenis
   never initialises — and the CSS media query kills transitions. Not a softening.

6. **Tailwind class names must be literal strings.** `` `text-${token}` `` produces no
   CSS, because the scanner reads source statically. Cost a bug during this step.

7. **`Qualifier` is the signature device and is semantically reserved.** Italic marks
   the clause that limits, qualifies, or states actual stage — never emphasis, never
   decoration. If you want to stress a benefit, rewrite the copy instead.

8. **Font payload.** `unicode-range` means browsers fetch only the Latin subsets
   (~276KB for the serif, normal + italic). Cyrillic and Vietnamese are bundled into
   `dist/` but never downloaded. If dist size matters later, hand-written `@font-face`
   rules limited to `latin`/`latin-ext` would cut roughly 250KB of unused files.

9. **Nav is sticky, with a hairline bottom border and nothing else.** No shadow, no
   blur, no pills — it stays a rule and some text, which is why it reads as a document
   rather than an app shell. The mobile trigger is the word "Menu"/"Close" rather than
   a hamburger, because the design rules ban decorative icons.

10. **Page transitions are asymmetric on purpose:** 500ms in, 200ms out. Symmetric
    600ms made navigation feel laggy. The plan's 600ms still governs scroll reveals.

11. **Motion API gotcha:** per-state timing goes *inside* the target object —
    `exit={{ opacity: 0, transition: {...} }}`. `transition={{ exit: {...} }}` is
    silently ignored. Cost a bug during this step.

12. **The specimen lives at `/specimen`, dev-only.** Guarded by `import.meta.env.DEV`,
    so it never reaches production. Keep it as the token reference.

13. **No browser available in this environment.** The Chrome extension is not
    connected, so visual checks are the client's. Routes are verified instead by
    server-rendering them: write a temporary `src/__smoke.jsx` that renders each path
    through `MemoryRouter`, `npx vite build --ssr src/__smoke.jsx --outDir .smoke`,
    run it, then delete both. The output dir must sit **inside** the project or Node
    cannot resolve `node_modules`. This catches import errors, hook misuse and render
    crashes.

---

## Content rules that bind every future session

Two are easy to break by accident:

- **Never write "we kept rebuilding these systems."** The client confirmed the
  repeated-systems insight is a *market observation*, not Akronix's own history.
  Akronix has completed no client work; that phrasing invents a past.
- **Never build a "what we refuse" section.** The client takes what comes. Inventing
  principles the studio doesn't hold is the exact failure this rebuild exists to fix.

The site is **fully anonymous** — no names, photos, roster or signatures anywhere.
The FAQ must address that directly rather than let visitors wonder.

**Pricing is settled, not open.** The ₹999 / ₹2,499 / ₹4,999 tiers ship with their
current contents. This was raised twice and reaffirmed by the client; do not
re-litigate it. The recorded risk and its one-line fix are in the plan.

---

## Local dev environment — a trap worth knowing

**A service worker from an unrelated project (`suvarna-v2.0.21`) was registered at
scope `http://localhost:5173/`.** Service workers are scoped to origin *and port*,
not to a project directory, so it intercepted every request before Vite saw it and
served a stale module graph — the browser requested `src/context/SmoothScrollProvider.jsx`,
a file this project has never contained, and the page rendered blank white.

Symptoms, so it is recognisable next time:
- Blank page, correct `<title>`, no error visible in the page itself.
- Console: `TypeError: RefreshRuntime.getRefreshReg is not a function`, pointing at a
  source file that does not exist. (Vite's SPA fallback serves `index.html` for
  unknown paths; the browser then executes HTML as a module.)
- The dep hash in console URLs (`?v=acf4e0c2`) differs from what the server is
  actually serving (`?v=7e50a16e`).
- **Ctrl+Shift+R fixes it; a normal reload does not** — a bypass-cache reload skips
  the service worker, ordinary navigation goes through it.

It was unregistered on 2026-08-29. If it returns (running that other project
re-registers it), unregister it from the console rather than debugging this code:
`navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()))`

**Do not use `window.scrollTo()` to drive the page while checking it in a browser.**
Lenis owns the scroll position and animates back, which leaves the compositor
mid-flight and produces torn or blank screenshots. Use real wheel events.

**Display scaling matters when checking breakpoints.** This machine runs at 150% DPR,
so the browser window is ~1.5x the CSS viewport. Resizing the window to 1440 does not
give a 1440 viewport — read `window.innerWidth` to confirm what you are actually
looking at.

---

## Homepage hero — signed off

The hero is finished and approved by the client. It took four rounds of
correction; what follows is the part a future session actually needs.

### Shape

Type left, demo video right. Above them, the four capabilities as one plain row
of text with clay dots — **not** in boxes or ruled cells; that was tried and
rejected. There is no eyebrow line above the headline: the old
"Software, marketing & networking for growing businesses" was deleted from
`src/content/home.js` at the client's request.

### The video's scroll choreography — `src/components/sections/Hero.jsx`

The frame starts beside the headline, travels to the centre of the screen and
grows to full bleed on a screen of its own, then shrinks back and releases.

**The hero and the video's screen share one scroll track.** They have to: the
video is a single element travelling between them, so one scroll position has to
drive both. An earlier attempt gave the video its own component
(`Showreel.jsx`, since deleted) and that is what broke it — the video could no
longer start beside the type.

Phases are named constants at the top of the file:

| constant | range | what happens |
|---|---|---|
| `TRAVEL_END` | 0 → 0.45 | Centre moves from beside the headline to the screen centre. |
| `GROW_END` | 0 → 0.72 | Growth, running *underneath* the travel. Both start on the first scroll. |
| `HOLD_END` | 0.72 → 0.86 | Full bleed. |
| — | 0.86 → 1 | Shrinks to a rounded frame and releases. |

Growth is eased so it is slow early. That is load-bearing, not cosmetic: it lets
the video start growing immediately without covering the headline, because by
the time the frame is wide enough to reach the type the hero has scrolled off.
The client rejected a version that paused, and separately rejected a version
that grew over the type — this easing is what satisfies both.

**Corners are not on a schedule.** The radius is derived from how close the
frame is to the screen edges, so it holds round the whole way out and squares
off only when the frame is actually touching them. The exit is symmetrical for
free. Do not replace this with keyframed radius stops; that was the earlier
version and it squared the corners too early.

### Why the geometry is measured, not written in vw

The headline, the capability row and the nav all sit on the page's content
column. A viewport percentage cannot land on that column — it is a centred
`max-w-[1280px]` box with its own padding, so the two agree at exactly one
window width. Positioning the video in `vw` is why "nothing lined up".

The rest frame is measured from the DOM and re-measured on resize:
- right edge → the content column's right edge
- bottom edge → the same line as the bottom of the buttons
- width → half the content column; height → 16:10 from that
- a **ceiling** keeps the top below the capability row. On a short window the
  frame shortens rather than covering it.

### Three traps, all hit and fixed — do not reintroduce

1. **`document.documentElement.clientWidth` for the full-bleed size.** Read at
   mount it can still report 1280 while the vertical scrollbar is settling; the
   frame then overflows by the scrollbar's width and the page grows a horizontal
   scrollbar at full bleed. The size is measured from the pinned layer instead,
   which is self-correcting.
2. **The pinned layer must start above the nav.** It reaches `-4.875rem`, the
   exact height the nav pill occupies in flow. Without it the frame spends the
   first 78px of scroll settling upward before it pins, and that settle eats the
   start of the movement.
3. **The nav pill is sticky *in flow*.** It already occupies ~5rem at the top of
   the page, so the hero must not add clearance for it — that is what produced
   the dead band above the headline. The hero measures `calc(100svh - 5rem)`
   and centres its content group.

### Headline size

`Hero.jsx` line ~229, the `clamp()` on the `<h1>`:
`clamp(<floor>, min(<width-driven>, <height-driven>), <max>)`. The client set
the max to `7rem`. The `svh` term is a cap that stops three lines running off a
short window — raising the max alone will not work if that cap is lower.

### Standing refusal — carry this forward

The client asked to **present the products as shipped and add a Demo button**.
Declined, and it stays declined: it tells visitors they can try software that
does not exist, which is the exact failure this rebuild exists to fix and is
prohibited by `CLAUDE.md`. Shipped instead: stage reads "Coming soon" and the
CTA is "Request early access". `src/content/products.js` carries a comment
saying so. If the word *Demo* is wanted, "Book a walkthrough" was offered.

### Two things blocked on the client

- **The demo video file.** `hero.videoUrl` and `hero.videoPoster` are `null` in
  `src/content/home.js`, so the frame shows a plainly labelled placeholder —
  deliberately not a mocked-up product screen. Drop an `.mp4` into `/public` and
  set the two values; the choreography needs no other change.
- **The Google Meet room URL.** `site.meetLink` in `src/content/site.js` is
  `null`. The booking component's copy-link block is built and hides itself
  until a real URL exists. A Meet code cannot be invented.

### Still unverified

Nothing on this site has been rendered below a 1280px CSS viewport. The browser
available here will not go narrower — height resizes, width does not.

---

## Next

Step 4 — the remaining pages, in this order:

1. `/building` — the six products at length. Reads `src/content/products.js`.
2. `/work` — services and pricing on one page. Reads `src/content/services.js`.
   Pricing is settled: the ₹999 / ₹2,499 / ₹4,999 tiers ship with their current
   contents. Raised twice and reaffirmed; do not re-litigate.
3. `/studio` — the thesis and working method, long-form. No people, no timeline,
   no mission/vision/values.
4. `/contact` — the four-step flow from contact.md is usable; the form belongs
   here rather than on the homepage.
5. `/policies` — legal utility. Note it is dated 22 March 2026, a future date,
   and uses `admin@akronix.org` while contact.md uses the Gmail address.

Then SEO metadata, favicon, OG images, 404 polish.

Run with `npm run dev`.
