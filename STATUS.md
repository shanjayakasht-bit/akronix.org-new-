# Akronix — Status

Rebuild of akronix.org from scratch. Direction agreed and approved; see the plan at
`~/.claude/plans/read-claude-md-in-full-enchanted-brooks.md` for the full sitemap,
content audit, design system and homepage structure.

---

## Done

### Step 4.8 — Nav wordmark centred; project docs brought up to date (current)

Client report: the AKRONIX wordmark in the nav was not vertically centred.

**Measured, then fixed.** The wordmark's centre sat 4.2px above the pill's
at both 1512 and 375. Two causes, both in `Nav.jsx`:

1. **The logo link carried `pb-1.5`** -- the 3px lift for the figure's foot --
   so it lifted the wordmark as well. Step 4.7's `pt-2.5`/`pt-3` nudges only
   moved the wordmark half their size, because the padded box was itself
   being centred. The `pb-1.5` now sits on the mark's own span; the figure is
   exactly where it was (46 of 49 at 1512, unchanged).
2. **A real bug from Step 4.7:** the white-wordmark overlay was positioned by
   passing `absolute` to `Logo`, whose crop box sets `relative` itself -- and
   `relative` won. The overlay never overlaid: it stacked under the black copy,
   doubling the wordmark's height to 28.9px and holding the visible copy at
   the top. On dark grounds the white wordmark would have shown 14px low. It
   is now positioned by its own wrapper span.

**Rule this leaves:** never position a `Logo` crop by passing `absolute` in
its `className` -- wrap it. `cx` is a plain join, so two position utilities
are settled by stylesheet order, not by which was written last.

**Verified:** wordmark centre 48.99 vs pill 49 at 1512, 44.99 vs 45 at 375;
black and white copies at the same top (41.8); screenshots over cream and on
a phone; overflow probe clean at all eleven widths on `/` and `/building`.

Also this step: the summary sections below (nav decision, headline size,
Next, Waiting on the client) rewritten to match Steps 4.1-4.8, and CLAUDE.md
updated -- see its "Client decisions" section.

### Step 4.7 — The real logo (red I), and black-or-white nav links

Client direction, 28 Sep 2026, with the supplied logo image: the I in
AKRONIX is red, and it must show as red in the nav "and where all needed".
Also: the nav links should switch between black and white only, like the
logo and button -- no pink or pale blue.

Two questions asked first; answers:
- **Nav name: the logo's own wordmark.** The name typed in the sans beside
  the mark is gone; the AKRONIX wordmark is cropped from the artwork, red I
  included.
- **Links: black or white only.** `mix-blend-difference` cannot give that on a
  coloured ground -- it inverts it, hence pink on forest and pale blue on
  cocoa. So the links are toned like the logo now.

**What was built:**

| Change | Where |
|---|---|
| `logo-new-light.webp`: the artwork with every non-red pixel turned white, red I and alpha untouched. Generated in headless Chromium from `logo-new.webp` (683 red pixels kept, 36,141 whitened). Red in the artwork measures ~#DD1916 | `public/logo/` |
| `Logo` gains `light` (the white-with-red-I artwork) and `word` (the AKRONIX wordmark alone, crop numbers in the comment) | `brand/Logo.jsx` |
| Footer logo and the hero's demo-video placeholder use `light` -- red I shows on dark. Both used `mono` before, which whitened the I | `shell/Footer.jsx`, `sections/Hero.jsx` |
| Nav name: `Logo word`, 8.5rem wide, dark artwork on light grounds, light artwork on dark, cross-faded (both rendered) so the swap never flashes an unloaded image. `pt-3` sits it on the links' baseline | `shell/Nav.jsx` |
| Nav links toned by `useBackdropTone` on the links group: ink on light grounds, white on dark. The second, blended copy of the pill is **gone** -- the nav is one pill again | `shell/Nav.jsx` |

**Nothing in the nav is blended now.** Every piece -- mark, wordmark, links,
CTA, Menu -- is solid and toned by what is painted under its group. The
trade: a link flips as a whole at a section edge rather than per pixel. That
is the client's choice, made knowingly (the per-pixel option was offered).
The Step 3 open question about tinted links over forest and cocoa is closed
by this.

**Verified (Chromium, 2x):** nav over cream (black links, black wordmark
with red I), forest and cocoa (white links, white mark, white wordmark with
red I, paper button), footer logo white with red I, phone at 375 (mark +
wordmark + Menu fit); overflow probe clean at all eleven widths on `/` and
`/building`; build clean.

### Step 4.6 — Logo restored, wider hero, glass for Safari

Client feedback on Step 4.5, 28 Sep 2026 (viewing in Safari):
- **The logo plate was not asked for.** Only the hover tilt was to go. The
  Step 4.4 bare, centred mark is to come back exactly, minus the tilt. Do not
  add a plate or chip behind the nav logo again.
- Too much space either side of the homepage hero content.
- "The text is not bending at the edges" and "there is no glassmorphism
  effect". In Safari the SVG bend cannot run at all (see Step 4.5); the
  client wants the glass to read as glass there too.
- "Have a Unique Requirement?" on /building: no background.

**What was built:**

| Change | Where |
|---|---|
| Nav logo back to the Step 4.4 bare mark (h-10, `pb-1.5 pl-1.5` on the link, tone by `brightness-0`/`invert`), hover tilt removed. Plate gone | `shell/Nav.jsx` |
| Glass body in every browser: 2px frost, saturate 1.2, brightness 1.03, 6% white, specular rim (bright top-left, soft bottom-right, inner glow), hairline dark ring, soft drop | `shell/Nav.jsx` |
| Chromium: the true lens displacement runs first in the same `backdrop-filter` stack. Band 14px, shift 30px -- the middle ~38px of the pill stays readable | `shell/Nav.jsx` |
| Safari/Firefox: a second span, the pill's 9px padding ring masked out with `mask-composite: exclude`, frosted at 7px -- text crossing the rim smears as through a thick lens edge. The stand-in for the bend they cannot run | `shell/Nav.jsx` |
| Homepage hero in `Container wide`; headline width term re-derived for the 1600 measure, cap raised to 12rem. 185px at 1512x860 (height-limited), "Connect." 619px in a 659px column, buttons end at 803 of 860 | `sections/Hero.jsx` |
| Nav pill widened to line up with `Container wide`: wrapper `md:px-8`, pill `max-w-[96rem]` -- 8px proud of the content edge at every width | `shell/Nav.jsx` |
| "Have a Unique Requirement?": no slab, straight on the cream page | `building/UniqueRequirement.jsx` |

**Glass tuning, for the record:** the saturate lift was 1.8 on first try
and tinted the cream inside the pill visibly yellow; 1.2 does not. The lens
band was 22px / shift 46 on first try and scrambled any text lying across
the middle of the pill; 14 / 30 bends the rim and leaves the middle legible.
Checked by placing the homepage's "The Akronix Ecosystem" heading under the
rim and under the middle, at 2x.

**Safari path, how it was checked:** Playwright's WebKit will not paint
`backdrop-filter`, so the Safari path was rendered in Chromium with
`navigator.userAgentData` hidden (an init script) -- that switches `bends`
off and serves exactly the markup Safari gets. Real Safari is still
unverified by eye.

**Verified:** build clean; overflow probe clean at all eleven widths on `/`
and `/building`; screenshots of the homepage hero at eight desktop sizes and
at 375, the glass on both paths, and the /building close.

### Step 4.5 — Clear-glass nav, products page polish, homepage at 1512

Client feedback on Step 4.4, 28 Sep 2026: the nav reads as blurred, tinted
glass; the reference is the iOS camera mode pill -- CLEAR glass, text bending
only at the rim. Also: the four boxes should look like the homepage's "Why
Businesses Choose Akronix"; a quote band between them and "Custom software
development"; a whole-card entrance for the product cards as they scroll in;
no hover tilt on the nav logo; and "home page is not responsive on a MacBook
Pro screen".

**The homepage complaint, pinned down.** Screenshotted at 1512x860 in both
Chromium and WebKit: no broken layout, no overflow. Asked the client which of
three candidates they meant; the answer was **the empty band under the
hero** -- ~220px of bare cream below the buttons, because the headline was
capped at 7rem while the hero is held to the full screen.

**What was built:**

| Change | Where |
|---|---|
| Nav glass is CLEAR: no blur, saturate or tint. Bend only in a 20px band along the rim, from a displacement map drawn at the pill's pixel size by `lensMap` and redrawn on resize (`LENS_BAND` 20, `LENS_SHIFT` 36) | `shell/Nav.jsx`, `lib/lensMap.js` (new) |
| Nav mark on a solid round plate (CTA colours: ink on light grounds, paper on dark) so text passes behind the logo through clear glass; hover tilt removed | `shell/Nav.jsx` |
| Homepage headline from `lg` sized to the screen: min of column width / 3.5 and (100svh - 18rem) / 3.1, floor 4rem, cap 10.5rem. 158px at 1512x860 (was 112). Hero group centred vertically from `lg` | `sections/Hero.jsx` |
| `Advantages` takes `eyebrow`, `title`, `accent`, `items`, `four`, `wide`; defaults are the homepage's. /building's four boxes now use it: "In Every *Product*" | `sections/Advantages.jsx` |
| Glyphs `Shield`, `Cloud`, `Sliders` for the four boxes (fourth uses `Chat`) | `brand/Glyphs.jsx` |
| Quote band between the four boxes and "Have a Unique Requirement?": "We build software for clients, / and these twelve for ourselves.", CTA to /work | `pages/Building.jsx`, `content/building.js` |
| Product cards: whole-card entrance scrubbed by scroll -- rise 96px, grow from 92%, swing out of a 12deg tilt about the top edge, fade over the first half; reverses on the way back. Nothing inside the card animates on its own (client's call). `useScroll` measures an untransformed wrapper, never the card | `building/ProductIndex.jsx` |
| `building/Traits.jsx` deleted -- replaced by `Advantages` | -- |

**The glass is Chromium-only in its bend, and that is final, not a gap.**
Safari and Firefox cannot run SVG filters inside `backdrop-filter`, and no
CSS filter can displace. There they get clear glass with its rim, no bend.
The client uses Safari, so they will not see the bend on their own machine
-- they were told.

**Homepage hero numbers (Chromium, measured):** at 1512x860 the headline is
158px, "Connect." 529px in a 552px column, buttons end at 759 of 860. At
1280x720 height governs (139px). At 1920 and up the 1280 measure caps it at
158px and the screen shows more cream around it -- widening the hero to the
`wide` measure is the lever if that is raised.

**Headings: the 22-character rule held again.** "Planned Into Every
Product" broke inside its accent at 1512; now "In Every Product".

**Verified:** build clean; overflow probe clean at all eleven widths on both
`/` and `/building`; Chromium screenshots of the glass over text at the rim
(2x), the four boxes, the quote band, the card entrance mid-run, and the
homepage hero at eight desktop sizes.

### Step 4.4 — `/building` follows the live page; glass nav

Client direction and answers, 28 Sep 2026:

- **Headline: the live site's exact wording**, "Our Products, Built to Power
  Your Business". Asked whether to say "Being Built" given nothing has
  shipped; the client chose the exact wording. The lede under it states the
  real stage.
- **Structure follows the live page**: hero -> products -> four boxes ->
  "Have a Unique Requirement?" -> footer. The Questions section, the
  "We build for clients" band and the booking calendar are removed from
  /building (client's choice; the homepage keeps its own).
- **The four boxes are the live four**: Enterprise Security, Cloud-Based,
  Fully Customizable -- and the fourth, "Dedicated Support -- our expert
  support team is always here", replaced by "Support from the builders"
  (client chose the honest version). Worded as plans, since nothing ships.
- **The name rows above the headline are removed.**
- **Side space**: the four boxes and the product section run near edge to edge
  (40px margin) instead of the 1280 measure.
- **Nav**: no underline under the active link. The pill becomes liquid glass
  -- frosted, with a bright rim, and in Chromium an SVG displacement filter
  that bends what passes behind it (Safari and Firefox cannot run an SVG
  filter in `backdrop-filter`; they get the frost and rim only). The CTA /
  Menu button and the logo are solid, not blended; link text keeps the
  colour-inverting blend.

**What was built:**

| Change | Where |
|---|---|
| Hero: "Our Products, / *Built to Power* / Your Business." -- three lines like the homepage's, middle one clay italic; name rows gone; lede states six being built, six planned, none shipped | `building/PageHero.jsx`, `content/building.js` |
| Order: hero -> products -> four boxes -> Unique Requirement -> footer | `pages/Building.jsx` |
| Four boxes: Enterprise Security, Cloud-Based, Fully Customizable, Support from the Builders; now after the products | `building/Traits.jsx` |
| "Have a Unique Requirement?" on a sand slab, "Talk to an Expert" -> /contact, "Book a Free Consultation" -> /#slots | `building/UniqueRequirement.jsx` (new) |
| Removed from /building: Questions, statement band, FinalCta + Booking. `ProductQuestions.jsx` deleted; `QuoteBand` / `FinalCta` keep their props for later pages | -- |
| `Container wide`: 1600 measure instead of 1280, same gutter. Product section and four boxes use it | `primitives/Container.jsx` |
| Cross-page hash links now land: `ScrollToTop` waits for the element after the page swap. Fixes the footer's "Book a Call" too, which always landed at the top of the homepage | `shell/ScrollToTop.jsx` |
| Nav rebuilt -- see below | `shell/Nav.jsx`, `lib/useBackdropTone.js` (new) |

**The nav is two copies of the pill, and must stay that way.** Read the
comment at the top of `Nav.jsx` before touching it. In short:

- Copy one (sticky, in flow): the glass span, then the solid mark, name,
  CTA and Menu button. Link stand-ins are `invisible`.
- Copy two (`fixed`, same inset, `z-[51]`, `mix-blend-difference` on its
  wrapper): the links only; everything else an `invisible` stand-in.
- Both are built by one `pill(layer)` function from the same state, so their
  `layout` animations can never drift apart.
- **Links blended inside the glass pill do not work** -- tried first: they
  blend only with the pill's own faint tint, not the frosted page, and came
  out pale grey on cream. Measured in Chromium.
- **The glass must not be `-z-10` inside an `isolate` pill.** Suspected of
  voiding the frost in WebKit; the pieces after the glass are `relative`
  instead and paint over it in source order.
- The solid pieces read the ground under them with `useBackdropTone`
  (`elementsFromPoint`, first opaque background up the tree). Mark and
  action are read separately -- at a slab's rounded corner they can sit over
  different grounds.
- Links over the forest slab still come out pink under difference -- the
  open design question from Step 3 is unchanged.

**Glass, by engine:** Chromium gets frost + rim + the SVG displacement
(`#akx-glass`, `scale="18"` -- 26 smeared solid shapes into blobs).
Everything else gets frost + rim; `bends` is read from
`navigator.userAgentData`, which only Chromium has.

**Verified:** build clean; overflow probe clean at all eleven widths;
Chromium screenshots of the nav over cream, over overlapping page text, over
the forest slab, over the homepage's tools strip and product grid, at 1512
and 375; hash link from /building lands `#slots` 112px under the top.
**Not verified: the frost in Safari.** Playwright's headless WebKit does not
paint `backdrop-filter` into screenshots at all -- a bare test page with a
`blur(6px)` overlay renders unblurred -- though it reports support and the
computed style is right. Needs one look in real Safari.

**Headline measurement:** widest line "Your Business." is 6.11x its font
size at the 7rem cap, 5.82x at phone sizes. `min(12vw, 26svh)` fits with
room at every width (262px in a 335px column at 375).

### Step 4.3 — All twelve products, and the rest of the legacy products page

Client direction (28 Sep 2026): list **all twelve** products from the live
products page, not six, and bring over the page's other content. This
**reverses Step 3's "Twelve products became six"** -- the client's call to
make. What is kept honest: the six added products carry the stage
**"Planned"**, not "Coming soon", because they were dropped in Step 3 for not
being in active development. If any of them is being built, change its
`stage` and `building` in `products.js`.

Live page re-read with WebFetch the same day; it matches the scrape in
`_legacy_content/pages/products.md` exactly. What carries over and what
does not:

- Carried: all 12 products, their categories and feature lists; the
  White-Label / Secure / Customizable and Enterprise Security / Cloud-Based
  blocks, reworded as what every product is being built with.
- Not carried: the "Dashboard Preview" ($250k revenue, 1,420 users, 320
  active) -- invented metrics, hard rule in CLAUDE.md. "Dedicated Support --
  our expert support team is always here" -- a staffing promise for products
  that have not shipped. "View Roadmap" -- there is no roadmap page.

Client also reported too much empty space around the hero text (Safari,
MacBook Pro). Cause: Step 4.2's `min-h-[calc(100svh-5rem)]` centring padded a
short hero out to a full screen. **Removed** -- the hero's height is its
content now. Do not put a full-screen min-height back on a hero with no video.

**What was built:**

| Change | Where |
|---|---|
| Six products added (`stage: 'Planned'`, `building: false`, `live: false`), `category` on all twelve, `building`/`planned` exports | `src/content/products.js` |
| Four glyphs in the house style: `Clock` (Attendance), `Book` (Books), `Bag` (E-commerce), `Chat` (Helpdesk). Project Management uses `Grid`, LMS uses `Cap` | `brand/Glyphs.jsx` |
| Homepage Products grid shows only the six being built -- unchanged on screen | `sections/Products.jsx` |
| Hero: "Twelve products, / *six in the making.*" -- the qualifier states how many are actually being built. Names row split by stage, planned ones quieter with grey dots; hidden below `md` like the homepage capability row | `building/PageHero.jsx` |
| "Planned into every product" -- four-column spec strip on cream (white-label, access and data, hosted for you, fitted to you), from the legacy benefit blocks | `building/Traits.jsx` (new) |
| Index and entries grouped "In development" / "Planned", numbered 01-12 across both; category label on each card; group pill above each group so phones see the split | `building/ProductIndex.jsx` |
| FAQ: the white-label question (now covered by the strip) swapped for "Coming soon vs Planned" | `content/building.js` |
| Statement now "...and these twelve for ourselves." | `content/building.js` |

**`Slab` gained `anchor="top"`.** The grow-into-place scale runs from the
slab's centre, so its top edge drops by 3% of its height on arrival. That is
~30px on a homepage slab but ~200px on the twelve-product slab (~7000px
tall), which opened a wide cream band above it. `anchor="top"` scales from
the top edge. Opt-in; only the /building product slab uses it. **Any future
very tall slab wants it.**

**Headline size measured, not estimated.** "Twelve products," is 7.27x its
font size at the 7rem cap, 6.88x at phone sizes. `min(12vw, 26svh)` fits the
column at every width; the arithmetic is in the comment above the `<h1>`. If
the headline copy changes, re-measure.

**Sticky index with twelve rows:** names down to `text-xl`, rows `py-2.5`.
Measured 625px tall -- fits under `top-28` on a 768px-tall screen with ~30px
to spare. A thirteenth product would need the rows tighter still, or the index
to scroll.

**Verified:** `vite build` clean; overflow probe clean at all eleven widths
(320-2560); screenshots at 375, 1024 and 1512 of hero, strip, both groups and
the index; homepage product grid re-shot at 1512 and still six cards.

**Needs the client:** (1) confirm the six added products are "Planned" -- if
any is being built, flip its `stage` and `building`; (2) the four trait lines
and the six new summaries are written from the legacy lists and claim nothing
beyond them, but want a read before launch.

### Step 4.2 — `/building` responsive pass

Client report: on their MacBook Pro the page was "not centered and not proper".
Reproduced at that machine's own viewport, 1512px (a 3024x1964 Retina panel at
2x), in headless Chromium. Then checked at eleven widths -- 320, 375, 390, 768,
1024, 1280, 1440, 1512, 1728, 1920, 2560 -- with a horizontal-overflow probe at
each. **No element overflows the viewport at any of them.**

**What was wrong, and the fix:**

- **The hero hugged the left half.** The homepage hero can sit left because
  its video holds the right half. `/building` has no video, so at 1512 the
  headline, lede and buttons sat on the left with the right half empty, and a
  dead band opened above the forest slab. The hero is now **centred** at every
  width and takes the first screen the way the homepage hero does
  (`min-h-[calc(100svh-5rem)]`, content centred in it), so the slab starts at
  the fold.
- **Slab heads centred** (`className="mx-auto text-center"` on SectionHead),
  as the homepage's Products and Advantages heads are.
- **Centred headings broke inside their accent** -- "Every product, and where /
  it stands.", "Questions about the / products". SectionHead's words are flex
  items, so `text-balance` cannot reach them; the fix is length. Now "Where
  each *one stands.*" and "Four plain *answers.*", one line from ~768px up.
  **Any future centred SectionHead: keep it under ~22 characters or it will
  wrap mid-phrase at desktop.**
- **Scope list cramped at 1024.** With the "Being built to do" label beside
  the list inside a card that shares the row with the index, "Inventory
  management" broke onto two lines. The label now sits beside the list only
  from `xl`, above it below that.
- **Statement orphaned a word on phones.** "We build software for / clients,"
  left "clients," alone at 375. Now "We build for clients, / and these six for
  ourselves."

**Homepage:** screenshotted at 1512 too, and it is centred and balanced there
-- the hero video holds the right half. Nothing was changed on it. If the
client's "not centered" report was about a specific homepage section, it needs
a screenshot or a name; nothing off-centre was found.

**How to reproduce, for future sessions:** Playwright's Chromium is cached at
`~/Library/Caches/ms-playwright/chromium-1243/`. Install `playwright-core`
into the scratchpad (never the project), launch it with that `executablePath`,
and screenshot the running dev server (`localhost:5173`) at any viewport. This
works when the Chrome extension is not connected. Scroll with
`window.scrollTo` and wait ~1.8s before each shot so slabs finish growing and
reveals finish running. Step 4.1's "headline size is estimated, not measured"
note is now resolved: measured at all eleven widths, it fits at every one.

**The other six products -- answered, and deliberately not built.** The
legacy scrape (`_legacy_content/pages/products.md`) does list twelve: LMS,
Helpdesk, Attendance, Project Management, Books and E-commerce on top of the
six on the site. Dropping them was a content decision taken with the client in
Step 3 ("Twelve products became six" -- see below): CLAUDE.md says to list
only products actively being built and drop the ones still ideas. The legacy
data for all six is still in that file (a one-line description and four
features each) if the client says any of them IS being built -- add it to
`src/content/products.js` with a glyph and every page picks it up.

### Step 4.1 — `/building`, the six products at length

Built only from the homepage's own parts -- same tokens, slabs, SectionHead
reveals, Rising letters, RollText buttons, the one EASE curve. Nothing in the
design system was added to; the page differs from the homepage in content only.

**Order, and why:** cream hero -> forest -> sand -> cocoa -> cream, the
homepage's alternation of light and dark. Forest because that is where the
products already live on the homepage. The last two sections are the homepage's
own `QuoteBand` and `FinalCta` (Booking included) saying this page's words.

| Section | File | Shape |
|---|---|---|
| Hero | `building/PageHero.jsx` | Home hero's type half: dotted row (the six names, each jumps to its entry), headline standing up once on load, "*in the making.*" in clay italic, lede + compact button pair |
| The six | `building/ProductIndex.jsx` | Forest slab. Sticky numbered index (lg+) marks the entry being read; entries are the homepage product card at full length, with glyph, stage tag, summary and a "Being built to do" scope list |
| Questions | `building/ProductQuestions.jsx` | Sand slab. Four questions, always open, question left / answer right. Not an accordion -- the answers are the evidence |
| Statement | `sections/QuoteBand.jsx` | "We build software for clients, / and these six for ourselves." lit letter by letter; CTA to /work |
| Close | `sections/FinalCta.jsx` | "Want One Before *It Ships?*" + Booking |

**Shared components gained props, and the homepage is unchanged by them.**
`QuoteBand` takes `lines`, `cta`, `videoUrl`; `FinalCta` takes `eyebrow`,
`title`, `accent`, `copy`, `primary`, `secondary`. Every default is exactly what
the homepage rendered before -- confirmed by server-rendering `/` and finding
its copy intact.

**`Slab` gained an opt-in `clip` prop, and it is load-bearing.** The slab's two
clipping layers are `overflow-hidden`, which makes them scroll containers, and a
`position: sticky` child inside one sticks to a box that never scrolls -- so
never sticks. `clip` swaps both for `overflow-clip`, which looks identical and
does not become a scroller. Only `/building` passes it. Any future sticky
element inside a slab needs it.

**In-page jumps go through `src/lib/useScrollToId.js`.** It routes the scroll
through Lenis so it eases like every other scroll, and measures the target with
`offsetTop` rather than `getBoundingClientRect`: the latter reads after the
slab's scale transform, and a card six down a slab still growing at 0.97 reads
~45px out. The anchors keep real `href`s, so without script they still work.

**Content added.** `src/content/building.js` holds the page's copy.
`products.js` gained `summary` and `scope` per product, plus `productSlug` and
`productShort` helpers. `scope` is the legacy products page's feature list,
shown only under "Being built to do" -- never as features that work. The
summaries are written from those same lists and claim nothing beyond them.
**Both want the client's eye before launch**, and so does the open question in
the next point.

**Still open with the client:** CLAUDE.md says to list only products actively
being built and drop the ones that are still ideas. All six are marked
"Coming soon" and `products.js` says they are specified and being built, but
this page puts each one under a spotlight. If any of the six is still an idea,
it should come out of `products.js` -- every page reads from there.

**Headline size** is `min(15vw, 26svh)` capped at 7rem. Estimated here;
measured and confirmed in Step 4.2.

**Verified:** `vite build` clean; server-rendered `/` and `/building` through
`MemoryRouter` with no errors; every new arbitrary class
(`overflow-clip`, `pl-13`, `md:mt-18`, the `nth-child(2)` variant) confirmed in
the emitted CSS. Visual checks followed in Step 4.2: sticky index and
its reading band confirmed working at 1024, 1512 and 1920.

### Step 3t — The Ecosystem accordion is click-only

Two client changes to `Ecosystem.jsx`, both desktop-facing.

**Hover no longer opens a row.** `onMouseEnter` is gone; `onClick` is the only
driver left. This reverses the decision Step 3i recorded, and it is the second
driver this section has lost -- scroll went first, hover now. Read 3i for the
scroll history, which still stands, but not for its hover rationale.

Why it had to go: crossing the list on the way down the page threw all four rows
open and shut behind the cursor, and a row that opens without being asked pushes
everything below it while it is still being read. Click also makes the desktop
behaviour the phone's -- there was never a hover there, so the two only agree
once hover is gone.

Confirmed with a real pointer at 1280: hovering row 02 leaves all four at
`aria-expanded="false"`; clicking opens it and the panel animates to 258px.

**The row gained `cursor-pointer`, and it is not cosmetic.** Preflight in
Tailwind v4.3 leaves a `button` on the default arrow -- confirmed, there is no
`cursor: pointer` rule in `preflight.css`. While hover expanded the row, the
expansion was its own affordance. Without it, the faint `hover:bg-ink/[0.03]`
and the cursor are the whole of it, and 3% ink alone is not enough.

**The plus is 28px, up from 14px** -- `text-[1.75rem] leading-none` in place of
`text-ui`. It carries more weight now that it is the only mark of an openable
row. The row height does not move: it is set by the title block at ~109px and a
28px glyph on a pinned line box is 28px, well under it. Measured 109px per row
before and after.

`leading-none` is doing real work there and should stay -- `text-ui` carried a
1.5 line box from the type scale, and 28px on that inherited 1.5 would have been
42px, still under the row but close enough that it is worth pinning rather than
leaving to whatever the scale does next.

One thing to know if the plus is ever read in code: `rotate-45` compiles to the
CSS `rotate` property, not `transform`, and `transition-transform` in v4
covers `transform, translate, scale, rotate`. So a mid-animation read shows
`transform: none` and an interpolated `rotate`. It is not broken; read
`getComputedStyle(el).rotate` after the 500ms, where it is `45deg`.

### Step 3s — Full-width CTA pairs, bigger menu items (revised after 3t)

Two more mobile-only asks from the client. Desktop is untouched: the CTA pair
still measures 188.3 / 232.7px at 1280, the same numbers Step 3r recorded.

**Both button pairs now fill their column instead of hugging their labels.**
The hero's Get Started / Explore Products and the final CTA's Get Started Today
/ Book a Free Consultation each carry `flex-auto justify-center ...
sm:flex-none`. Measured at a 375px viewport, both rows run 20 -> 340px, edge to
edge inside the 20px gutter, with no horizontal overflow.

**`flex-auto`, not `flex-1`, and the difference is the whole ask.** It was
built with `flex-1` first and the client rejected it on sight: `flex-1` sets
the flex basis to 0, so the row's whole width is free space and it is offered
equally, which lands the two controls on near-identical halves no matter what
their labels say. Measured, that was 151.5 / 160.5 in the hero -- a 16-character
label and an 11-character one in the same box, which is what made it look wrong.
The two are not meant to match; the pair should read as two different labels.

`flex-auto` starts each button at its own label width and shares out only what
is left over, so the natural proportion survives. Measured at 375: 137.7 / 174.3
in the hero and 138 / 174 in the final CTA, both 44 / 56 of the button width
with the 8px gap taking the rest. That ratio is not set anywhere -- it is
whatever the words come to, so it will move if the labels are ever rewritten,
and that is correct.

Growth-only either way: nothing is squeezed below the width its label needs, so
the row fills exactly and never overflows. A `grid-cols-2` was the other option
and is the wrong one twice over -- it forces the 50/50 the client rejected AND
pushes the longer label out of its column.

**The two knobs, for future asks.** Button *size* on mobile is `SIZES.snug` and
`SIZES.compact` in `src/components/ui/Button.jsx` -- `pad` and `text`, each
already `sm:`-reset to the default measurements. Button *width* is the
`flex-auto` at the four call sites. They are separate on purpose: the sizes
exist because both labels plus their chrome have to fit on one 335px line, and
that constraint did not change when the row started filling.

**The mobile menu items are 28px, up from 22px.** `text-h3` was shared with
headings on the page, so the sheet's links carry `text-[1.75rem]
leading-[1.25]` spelled out instead -- it only ever renders below `lg`, so
there is no desktop case to guard.

Row padding came down to `py-4` with it. At `py-5` the taller type put the
Book a Consultation button below the fold on a 568px phone; at `py-4` a row is
67.7px, which is what it was at 22px/`py-5`, so the sheet ends at 531px on a
667px screen and the type grew for free. The sheet is also `overflow-y-auto`
now, so raising the size further cannot clip the CTA -- `py` is the second knob
if it is raised much past this.

### Step 3r — The mobile pass

Six changes from the client, all mobile-only. Everything at `md` and above is
untouched; the desktop CTA pair still measures 188.3 / 232.7px, exactly what it
did before.

**The page's mobile gutter is now 20px, not 40px.** `Container` was `px-10` at
every width, which spent 21% of a 375px screen before anything was drawn. It is
`px-5 md:px-10`. This is the change three of the six asks are paid for out of --
the booking card, the hero's capability row and the CTA pair are all width
problems and there was no width. The alternative was widening the booking card
alone, which would have left it out of line with the heading above it. If the
20px is ever revisited, those three sizings are what have to move with it.

**Nothing about the nav contracts below `lg` any more.** `wide` was `!past`;
it is `!past || !roomy`, where `roomy` is the new `useMediaQuery` hook at
`(min-width: 1024px)` -- the same line the inline links appear on. The pill
holds `w-full` and the wordmark holds full opacity at any scroll depth.
Confirmed at scrollY 3012.

`useMediaQuery` reads its first value in the state initialiser rather than in an
effect, deliberately. Read after mount, a page restored mid-scroll would render
the desktop answer for one frame, contract the pill and expand it again. That
frame is visible. `Hero`'s own `useIsDesktop` still exists and was left alone;
the hero is signed off and its hook defaults the other way for a reason.

**The Menu trigger has a hamburger, and it becomes an X.** Three bars in a 10px
box, one element each, animating to +/-45 degrees with the middle one fading.
The design rules ban decorative icons; this is the control's own state drawn,
the word stays beside it, and it was asked for directly. It lives in `Nav.jsx`
rather than `brand/Icons.jsx`, whose four icons exist to label the four kinds of
work.

**Three things now hold one line that could not before.** All three were sized
against measured text, not estimated:

| what | measured cost | what it got |
|---|---|---|
| "The Akronix Ecosystem" | 11.33x the font size | `text-[7.5vw] sm:text-h1`, 28px at 375 |
| The two CTA buttons | 21.75x the font size + 68px of chrome | `size="compact"`, 11.3px at 375 |

Both breakpoint handovers are placed where the two sizes meet rather than at a
convenient width: 7.5vw is within 1.1px of `text-h1` at 640, and the capability
row's cap is `text-ui`'s own 0.875rem, so only the dots and gaps change at `md`.
Neither steps visibly.

**Two components gained a prop rather than an override.** `SectionHead` takes
`titleClass` (replacing `flex-wrap text-h1`) and `Button` takes `size`. Both
*replace* rather than add, because `cx` is a plain `join` -- two competing
paddings in one class list are settled by stylesheet order, not by which was
written last. An override that looks right in the source silently loses.

**The booking card is 335px wide, up from 295.** Its own padding drops to
`px-5` below `sm` on top of the gutter change, so the date grid gets 295px
instead of 239. Date tiles are 94px and hold a whole label on one line -- they
had been wrapping to two lines on every phone, which nobody had seen because
nothing had rendered this page below 1280. The tile is 13px below `sm`: the
widest label the helper can ever emit is "Wed - 28 May" at 83px, and at
`text-ui` it did not fit 94px. Card height across the three steps is
618.7 / 620 / 620 -- the same sub-pixel spread it has at 1280.

#### Then the hero, revised on sight

The client saw the capability row at 8.3px and cut it. Three changes followed,
all mobile-only, all still in Step 3r:

**The four capabilities are not rendered below `md`.** Fitting them on one line
needed 8.3px, which was the arithmetic ceiling and read as too small the moment
it was on a screen -- 66 characters cannot share a 335px line at any larger
size. So the row is `hidden md:block` on its wrapper, and the row itself is
back to exactly the classes it had before the fluid treatment. The four
capabilities are not lost with it; the Ecosystem section is the same four at
length. The wrapper carries the hiding, not the `<ul>`, so the row leaves no
flex gap behind it and the `caps` ref it holds is still measurable on the
desktop, where the video's ceiling depends on it.

**The hero's two buttons sit on one line.** They were overflowing by 4.8px --
327.8 of button against 335 of column -- so the give is small: a third `Button`
size, `snug`, that takes 8px of padding a side and drops the label to
`min(3.6vw,0.875rem)`, which is 13.5px at 375 and full size from 389px up.
`compact` would have worked and would have set the first controls on the page
at 11.25px, which is why it is a third size and not a reuse.

**The headline is 24vw, not 19vw.** 19vw was set when the column was 295px
wide. "Connect." is the widest of the three lines at 3.3567x the font size,
measured, so a 335px column carries 99.8px of type; 24vw asks for 90px at 375
and leaves the rest as margin for a desktop window at this width, where a
scrollbar takes 15px off the column but not off the vw. Desktop is untouched --
every viewport from 480px up is at the 7rem cap the client set, as before.

#### A Tailwind trap this file set for itself

**Class names written in STATUS.md were being compiled and shipped.** Tailwind
v4 scans every file in the project it is not told to skip, markdown included, so
documenting `text-[min(2.2vw,0.875rem)]` in the table above kept emitting that
rule long after the code stopped using it. `src/styles/index.css` now carries
`@source not "../../*.md";`, which took 1.68kB of prose-harvested CSS out of the
bundle. Notes can name classes freely again -- but if a utility ever appears in
the CSS that nothing in `src/` uses, this is where it came from.

#### Verified, and how

Measured at real viewports in an `<iframe>`, then re-measured at 320, 360, 375,
390, 414, 480, 600, 639, 640, 700, 767, 768, 900, 1023, 1280. At every one of
them: no horizontal overflow, the Ecosystem heading on one line, both button
pairs side by side, and the headline inside its column -- headroom runs 7.2px at
320 up to 20.8px at 390, all of it measured with a scrollbar taking 15px that a
real handset does not take. The capability row is absent below 768 and present
from 768. All seven routes render.

When walking widths this way, assert `iframe.contentWindow.innerWidth` actually
equals the width you set before believing a measurement. Setting the attribute
and reloading races the resize, and the rows that come back are a mix of two
viewports -- which looks like a responsive bug and is not one.

Two traps in measuring it, both hit:

- **Synthetic `WheelEvent`s do not drive Lenis.** Scroll stayed at 0 through 60
  dispatched events. Use the real input the browser tool sends; that works.
- **rAF is throttled in an unfocused tab, so a Motion animation freezes
  mid-flight and stays there.** The hamburger measured a stable 38.5 degrees --
  exactly 85.5% of every target value, including the opacity -- and looked like
  a bowtie in the screenshot. It is not a bug: one real hover restored the frame
  loop and it settled on 45. Count rAF ticks before believing a frozen
  transform.

### Step 3q — Rolling stragglers, 375px, favicon

**Two links had been missed by the roll.** "View All Products" and the 404's
"Back to the homepage" are hand-rolled `<Link>`s rather than `<Button>`, so
neither picked it up. Both wired. The client spotted the first; the second came
out of sweeping every clickable element in live code afterwards rather than
patching only what was reported. Only `Button` gets the roll for free.

**The site was rendered below 1280px for the first time** — see the
"Responsive" section below for how, and for the two things it caught. Short
version: the hero headline was 112px on a 375px screen and "Connect." was
breaking mid-word.

**The favicon is the figure alone, in white.** `public/logo/favicon-mark.svg`
embeds the artwork, crops to the figure and forces it white with a
`feColorMatrix` that zeroes the colour channels and passes alpha through, so
the wordmark is out of frame and nothing of the red I survives as a tint. The
viewBox is measured, not guessed: scanning the artwork's alpha per row puts the
figure at x 149-384, y 21-287 of 555x407 with the wordmark starting below row
288. Regenerate it if the artwork changes.

Two traps in that file. XML forbids a double hyphen inside a comment, and a
malformed SVG fails silently -- the browser never loads it and the tab shows an
empty slot rather than an error. The first attempt did exactly that. And being
white on transparency it disappears against a light tab strip; the client asked
for white knowing that, and a dark rounded plate behind the figure is the fix if
it is ever wanted.

### Step 3p — Partnership glyph redrawn

`Handshake` in `brand/Glyphs.jsx` is gone, replaced by `Partnership`: two
interlocking rings. The handshake was four overlapping strokes in a 24-unit box
and collapsed into an unreadable squiggle at the ~20px it is actually used at --
a hand is not drawable at that size on a 1.6 stroke. Rings read as two parties
joined at any size, which is the entire informational job. `content/home.js`
points the Long-Term Partnership advantage at the new name.

### Step 3o — No mono face, stepped booking, smoother wordmark

**1. The monospace face is gone from the site.** Client's call. The
`@fontsource/ibm-plex-mono` import and the `--font-mono` token are both out of
`index.css`, and every `font-mono` in the source is now `font-sans`. The small
caps labels keep their uppercase-and-tracked treatment, which is what gave them
their character; only the typewriter texture goes. Confirmed at runtime: zero
elements on the homepage compute to a monospace family.

Do not reintroduce it, and do not use the `font-mono` utility. With no token
behind it, it now falls through to the browser's default mono and looks like an
accident rather than a choice. The npm dependency is still in `package.json`
but nothing imports it.

**2. The nav wordmark animates in one pass.** It used to mount and unmount
inside an `AnimatePresence` animating its own `width` to `auto` over 0.45s while
the pill ran a `layout` animation over 0.7s. Those fight: a layout animation
scales everything inside the pill and scale-corrects only children that are
themselves layout-animated, so the wordmark arrived in a jerk on the way back to
the top. It now stays mounted, carries `layout` with the pill's own transition,
and toggles `w-auto`/`w-0` plus opacity. Measured on the way up: width ramps
0 -> 6 -> 46 -> 59 -> 63 -> 65 with opacity easing alongside, continuous, no
jump.

**3. Booking is a three-step flow.** `src/components/home/Booking.jsx`, rebuilt.
Date, then Time, then Details, one thing on screen at a time, with an animated
rail across the top -- the filled line is a single element scaled on X, so the
travel between steps is continuous rather than three segments lighting in turn.
The card opens with what it is for -- "Schedule a meeting", and a line saying
to pick a date and a time slot and that nothing is confirmed until Akronix
replies. That second sentence is the honest half and stays: there is no calendar
integration behind this, so a chosen slot is a request. Each step then carries
its own smaller title -- "Select date", "Select time", "Your details" -- stepped
down to `text-lede` so the card title stays the larger of the two. Back appears from step 2. The forward button is always
present and disabled until the step is satisfied, rather than appearing on
selection: predictable beats fewer pixels, and the footer does not jump. Both
buttons run the shared `RollText` on their labels like every other control on
the site, both carry an arrow pointing the way they go, and both sit at
`px-4 py-2` -- the panel is a compact card and the
site-wide `Button` padding was too heavy inside it. The date and time tiles are
deliberately NOT rolled: they are options being chosen from, not actions.
Then a closing screen.

Dates and times are the same kind of choice, so they are the same object -- one
`pill` class serves both grids, and a date reads as a single line
("Wed - 2 Sep") rather than a stacked two-line tile. The label comes from one
`dayLabel` helper, so it carries through to the pills, the line above the time
slots, the details step and the email subject and body alike. The time step's
own separator became a middot when the hyphen went in, because two dashes doing
different jobs in one line read as a typo.

*The card does not resize between steps,* and keeping it that way needs two
things. The `min-h` floor is on the border box, so it has to clear the tallest
step's content PLUS the 4rem of padding -- the first attempt at 13.5rem looked
generous and did nothing, because most of it was padding. And it has to be set
per breakpoint, because the date grid is three columns narrow and four wide, so
which step is tallest changes with the column count. Measured across all three
steps at 1280: 584 / 585 / 585px, the 1px being sub-pixel rounding.

**Where a submitted booking actually goes -- read before touching the wording.**
`site.bookingEndpoint` is null. With an endpoint set, submit POSTs
`{ date, iso, time, timezone, email }` and the closing screen says the meeting is
scheduled. With no endpoint there is nothing on the other end to schedule
anything, so it falls back to handing the filled-in request to the visitor's own
mail client -- which does genuinely deliver it -- and the closing screen says
only that: the request is on its way, and Akronix will reply with the link.

The scheduled wording must not appear on the fallback path. Telling a visitor a
meeting is booked when nothing received it is the exact class of fiction this
rebuild exists to remove. Two things are still needed for the client's literal
ask, and both are theirs to supply: a service to POST to, and a real Meet link
(`site.meetLink` is still null), since whatever receives the booking is what has
to issue one.

### Step 3n — Real logo, self-inverting nav, rolling links

Four things, all client-requested.

**1. The supplied logo replaces the drawn mark.** `src/components/brand/Logo.jsx`
renders `/logo/logo-new.webp` (555x407, alpha channel confirmed, so it sits
straight on the cream page with no plate). It is a stacked lockup -- figure over
the AKRONIX wordmark with the I in vermilion -- so nowhere that uses it sets the
studio name in type beside it; that read as the name twice, and the nav and
footer both lost their `{site.name}` span.

Two variants exist for reasons the artwork forces:
- `mono` flattens it to white for dark grounds via `brightness-0 invert`. The
  `brightness-0` first is what stops the red I inverting to cyan. The accent is
  lost in that state, which is the normal trade for a one-colour lockup.
- `mark` crops to the figure alone, for the nav. At a nav-bar height the stacked
  wordmark renders about 8px tall and reads as a smudge -- it was built that way
  first and it looked broken. The crop is a square window with the artwork at
  142% and top-aligned, which shows the top ~70% of the image; change the
  artwork and those two numbers have to be re-derived.

The old `brand/Mark.jsx` is untouched but no longer used by anything live. Only
`components/home/Opening.jsx` still imports it, and nothing imports that.
`index.html` now points its icon at the webp.

**2. The nav expands only in the hero.** Scroll position is the only thing that
drives the width -- hover used to expand it too, so the bar moved whenever the
pointer crossed it. Wide, the name is set beside the mark; contracted, the mark
stands alone. That pairing is only possible because the nav uses the cropped
`mark` variant, which has no wordmark of its own to clash with.

**3. The nav inverts against whatever is behind it.** The pill has no fill, the
whole bar is drawn white, and the outer sticky wrapper carries
`mix-blend-difference`. Each pixel becomes the inverse of the page beneath it,
so a section edge crossing the bar inverts the letters it is halfway through
rather than flipping the whole bar at once -- and it handles the hero's
part-width video panel, where the left of the bar is over cream and the middle
over coal at the same time. A per-section state toggle cannot do that.

*The blend has to be on the outer wrapper.* An element blends with its backdrop
only as far as the nearest ancestor forming a stacking context, and the wrapper
forms one the moment it is `sticky z-50`. The first build put the blend on the
type inside, so the group being blended was the bar itself -- transparent -- and
the links rendered pale white on the cream page. Everything inside is therefore
authored as its own inverse: the CTA is a white pill with black type, which
difference turns into the near-black pill with cream type it is meant to be.
`backdrop-blur` came off the pill; a blurred backdrop under an inverting bar
muddied both.

*Every piece of type in the bar is FULL white, never a dimmed white.* Under
difference, dimming the source dims the inversion with it: a `text-white/65`
link only half-inverts and lands muddy grey on light and dark grounds alike,
which reads as type that is not responding to the page at all -- which is
exactly how the client read it. The current page is marked with a rule under it
instead of with weight.

**Known artifact, client's call.** Difference against a saturated ground gives
the complement, not a neutral. Over `forest` the bar lands pink and over `cocoa`
pale blue; over `paper`, `mist`, `coal` and `night` it is neutral. The filled
CTA is the loudest of it. There is no way to threshold instead of invert in a
blend mode, and desaturating the backdrop first paints a visible grey band
across the section. The alternatives are: accept the tint, outline the CTA
instead of filling it so the largest tinted shape goes away, or drop to a
per-section colour switch and lose the per-pixel edge.

**4. Every clickable label rolls on hover.** `src/components/ui/RollText.jsx`.
The visible copy climbs out of its box while an identical copy climbs in from
under, one letter behind the next. Wired into `Button` (so every variant gets
it), the nav links, CTA, menu button and mobile sheet, all the footer links,
contact lines and social buttons, and the Ecosystem pillar CTAs.

Two hand-rolled links were missed on the first pass and are now covered:
Products' "View All Products" and the 404's "Back to the homepage", neither of
which goes through `Button`. If another bespoke link is ever added, it needs
wiring by hand -- only `Button` gets this for free.

Three things are deliberately NOT rolled: the booking date and time pills, and
the Ecosystem accordion row headers. The pills are options being chosen from
rather than actions, and the accordion header already animates on hover by
opening its row -- a second hover animation on the same target fights it.

The trigger is a **named** group -- `group/roll` goes on the anchor, button or
Link, never on the text -- so it fires from anywhere on the control including
its padding. The stagger is a ladder of 26 static `delay-[Nms]` classes rather
than a computed inline style, because Tailwind only emits utilities it can see
spelled out and CLAUDE.md rules out inline CSS. Labels longer than 26 characters
hold the last rung. A non-string child passes straight through untouched, so a
Button holding an element still renders, and the label is carried once in an
`sr-only` span with the doubled letters hidden from a reader.

**5. The Ecosystem accordion opens nothing by default.** `useState(-1)`. The
section now arrives with all four rows closed and waits to be pointed at.

Verified at 1280x724: nav wide with the name beside the mark in the hero,
contracting on scroll and staying contracted under the pointer; dark over the
cream page and over Advantages, fully light over the coal video frame, the
forest slab and the footer; "Products" caught mid-roll with the stagger visible
across letters; the white lockup reading correctly in the footer; all four
accordion rows closed on arrival.

### Step 3m — The hero headline stands up on load

"Build. Connect. Scale." gets the same per-letter hinge as the two scrolled
headings, but **played once on page load and never again** — the hero is the
first thing on the page, so there is no scroll to scrub it with, and re-running
it on every pass up would be noise.

The letter moved out to `src/components/motion/RisingLetters.jsx`, which
`SectionHead` and `Hero` both import, so the two cannot drift apart. It takes a
plain 0-1 MotionValue: `SectionHead` hands it a `useScroll` progress, `Hero`
hands it one walked 0 to 1 over `INTRO` (1.5s) by `animate()` in an effect,
linear, because the easing is per letter inside the component.

**A trap worth the space.** The first attempt drove the hero letters with
`initial={{ scaleY: 0 }} / animate={{ scaleY: 1 }}` props. The props reached the
component — confirmed by reading the fiber's `memoizedProps` — and Motion still
rendered every span at `transform: none` and never ran the animation, even with
the delay pushed to 60s. Reduced motion was off and there is no `MotionConfig`
in the tree. The MotionValue form works, so that is what both now use. If a
future session "simplifies" this back to `initial`/`animate` props, this is why
it silently stops animating.

Verified by stretching `INTRO` to 30s and loading: "Buil" standing, "d" partway,
the full stop flat, "Connect." and "Scale." still lying down — the wave crossing
the headline exactly as it does on the scrolled headings. Restored to 1.5s
after. The three line boxes measure 112px each, unchanged by the split, and the
`sr-only` line reads "Build. Connect. Scale.".

Note for anyone verifying animation in the automation browser: a tab that is not
being painted throttles rAF, so scrubbing through Motion values by polling can
show an animation frozen part-way. Take a screenshot to bring it forward, or
stretch the duration, before concluding anything is broken.

### Step 3l — Two headings stand up letter by letter

`src/components/sections/SectionHead.jsx` gained a `reveal` prop.
`reveal="words"` is the default and is the animation every other heading still
uses. `reveal="letters"` is the new one, passed by `Advantages` ("Why Businesses
Choose Akronix") and `FinalCta` ("Ready to Talk About Your Project?") and by
nothing else.

Every letter is hinged at its own baseline and lifts from lying flat to
standing, the way a body pushes its upper half up off the ground: the top of
the letter travels furthest, the middle less, the foot not at all. That is
`scaleY` about `origin-bottom`. Scrubbed by scroll, not played by
`whileInView`, so it also runs backwards on the way up.

**It does not translate, and that is the whole point.** The first build slid
each letter up out of an `overflow-hidden` mask and was rejected: the letters
arrived from below their line instead of standing up from it. The brief was
"the letters should not move away from their original position at all" — they
rise in the exact place they already occupy. Do not reintroduce a translate
here. A transform also costs no layout, so the heading never reflows mid-run.

**The range is the specified part.** `useScroll` on the `h2` with
`['start end', 'start 0.3']`: the run starts as the heading's top edge crosses
the bottom of the screen and is finished when that edge is 30% of the way down
it. It was 50% first (the client asked for "between 40% and 50%", and 50% was
the reading that held across the whole band) and was then moved to 30% on
request.

The letters overlap — `LETTER_SPAN` is 0.34, so each takes a third of the run
and they are spread across the remaining two thirds. That is what makes it read
as a wave crossing the line rather than 26 separate pop-ins. Easing is an
`easeOut` cubic applied inside the transform rather than a Motion `ease` option,
which keeps it independent of what the version exports.

The letter itself now lives in `src/components/motion/RisingLetters.jsx` and is
shared with the hero headline — see Step 3m.

Split into letters, a heading must not be read out one letter at a time: the
real line is carried in an `sr-only` span and every visual word is
`aria-hidden`. The word-level default never needed this, so do not assume the
pattern is optional if a third heading is converted.

Verified at 1280x591: no letter carries a translate at any point, the transform
origin sits on the box's bottom edge, and with the 30% range "Why Businesses
Choose Akronix" is still mid-run at 57% down the screen and flat 1.0 for all 26
letters by 22.9%. Caught mid-run the wave sits inside a word,
with the trailing letters still lying along the baseline. The sr-only line
reads back in full.

Worth knowing: `Advantages` is inside a slab that scales 0.94 to 1, and a scaled
ancestor shifts the `h2`'s measured rect, which is why its completion lands a
little before the nominal 50% rather than on it. It stays inside the band, and
`FinalCta` is no longer a slab so it is unaffected.

### Step 3k — Two sections lose their slab

Client request, and deliberately nothing more than that. The block came off two
sections; every other thing about them is untouched.

**`ToolStrip`** — "Tools & platforms we work with". It never used the `Slab`
component; it hand-rolled the same shape with `px-3 md:px-5` and a
`rounded-slab bg-mist` div. That div is gone and its vertical padding
(`py-12 md:py-14`) moved onto the `<section>`, so the strip sits straight on the
cream page. The outer `px-3 md:px-5` went with it — it existed only to inset the
block — which lets the marquee run the full width. The marquee itself, its
`akx-marquee` animation, the edge mask and the per-name hover are all as they
were.

**`FinalCta`** — "Ready to Talk About Your Project?". `<Slab tone="sand"
id="book">` became `<section id="book" className="py-12">`, keeping the slab's
own vertical padding. The `#book` anchor and the `#slots` scroll target are
intact, as are all the `whileInView` reveals and `Booking` inside it. `Booking`
is `bg-panel` on a `ring-rule` outline, so it still separates from the page now
that the ground under it is cream rather than mist.

Verified: four slabs remain (Ecosystem, Products, Advantages, QuoteBand), the
strip's section paints no background, `#book` is a plain section at 0 radius
with its 48px padding and seven motion elements still inside, and the marquee is
still running `akx-marquee 38s`.

### Step 3j — The quote lights letter by letter

`src/components/motion/ScrollHighlight.jsx`. The cocoa slab's pull quote was
lighting a word at a time; it now lights a letter at a time. Same single scroll
target, same continuous index, same `['start 0.85', 'start 0.18']` range — only
the unit changed, from 11 words to 66 letters. Spaces are not lit and so get no
slice of the scroll.

Two things the markup has to get right, both easy to undo by accident:
- Words stay whole in the DOM and carry `whitespace-nowrap`. The letters inside
  them are inline-blocks, and inline-blocks are free to wrap, so without it a
  word can break across lines mid-word.
- The visible layer is `aria-hidden` and the sentence is carried once in an
  `sr-only` span. A screen reader must not be handed this one letter at a time,
  which is what the previous word-level markup happened to avoid for free.

The risk with splitting a 64px serif into per-character spans is losing the
kerning, since browsers only kern within a single text run. Measured against the
same strings rendered as one run: every word is within 2%, and the split
versions come out slightly *narrower* rather than looser (`relationships,` is
348.6px against 355.3px). Newsreader kerns lightly at display size, so it holds.
All 66 letters reach full opacity by the end of the range.

### Step 3i — The Ecosystem accordion, and why it is on hover

**Superseded on the hover point by Step 3t**, which removed `onMouseEnter` at
the client's request. The scroll-driver history below is still current and still
worth reading; the case for hover is not.

It is a hover accordion: one pillar open at a time, `onMouseEnter` opens the row
you point at, click toggles, row 01 open by default. Straightforward — but the
history matters, because it was briefly something else.

For one revision it was **scroll-driven**: a row opened as it reached the middle
of the screen and closed as the next took over. That was built, verified, and
then dropped at the client's request — the reader sets the pace in this section,
not the page. Do not reinstate it as an improvement.

If it is ever genuinely wanted again, the one hard-won thing to carry over is
that the driver must measure the **list's** top edge and never a row's. A row's
position depends on whether the rows above it are open, so triggering on a row
feeds the layout back into the thing deciding the layout and it oscillates:
opening a row pushes the next one down out of its trigger, which closes it,
which pulls the row back in. The list's top edge cannot move, so it is the one
safe thing to measure — and because only closed rows ever sit above the open
one, the open row's header then lands exactly on the trigger line every time.

Unrelated to the driver and still true: the rows are full bleed inside the slab.
They were inside `Container` (max-w-7xl, px-10), which left a 40px strip of slab
either side. The head stays in the 1280 measure; the list sits outside
`Container` and runs to the slab's own edges, with `px-6 md:px-10 lg:px-14` on
each row to keep text off the edge.

Open point: the rows keep `rounded-[1.5rem]`, so an open row's tint shows a
small corner arc against the slab edge. `rounded-none` makes it a true
edge-to-edge band.

Noted but not changed: on the sand slab, `moss-tint` and `clay-tint` are close
enough to the slab's own `mist` that rows 02 and 03 read as open less clearly
than 01 and 04 do.

### Step 3h — Slabs grow into place as they are scrolled

From `MISTAKES.md`, then revised three times by the client. Two changes.

**1. A slab scales up as it rises — `src/components/ui/Slab.jsx`.**
A slab arrives on screen at `scale(0.94)`, cream showing on every side, and
grows to full size as it rises. The trigger is one event: its own **top edge
meeting the top of the screen**. At that instant it is at scale 1, the cream is
gone and the radius has run out with it, so the block fills the top of the
viewport with square corners. Scroll on and it holds; scroll back and it reopens
through the same range.

`useScroll` on the slab's frame with `['start end', 'start start']` — 0 when the
slab's top is at the bottom of the screen, 1 when it has risen to the top. The
transition spans exactly one viewport height of scroll whatever the slab's own
height, so a short slab and a tall one behave identically.

One change in `Slab`, so it covers every slab at once — Ecosystem, Products,
Advantages, QuoteBand. Advantages is cream-on-cream, so only its shape reads.
ToolStrip and FinalCta had slabs and no longer do; see Step 3k.

**The route here matters, because three earlier versions were rejected.**
- Closing on a *fraction of the slab's own traversal* (45%, then 65%) made the
  closing point depend on how tall the slab happened to be. Rejected. Do not
  reintroduce a percentage.
- Closing the side gap with `clip-path` while the content stayed put looked like
  the background growing out from behind fixed text, not like a gap closing.
  Rejected.
- Keeping the width fixed and closing the gap is geometrically impossible — the
  screen is a fixed width, so the 80px of cream has to be taken over by
  something. Put to the client as a choice; they confirmed the block should
  widen.

Scaling is what resolved it: width, height, padding and type all move together,
so it reads as one block coming forward rather than sides being pulled apart.
`SHRINK` is 6%, which is ~38px of cream either side at 1280 — the `px-10` the
margin used to be fixed at — and stays proportional at other widths.

*The transform goes on an inner element, never on the one `useScroll` measures.*
A scaled element's `getBoundingClientRect()` includes its own transform, so
measuring it would feed the scale back into the thing computing the scale. The
outer div is untransformed and is the scroll target; the `motion.div` inside
carries `scale` and the animated `borderRadius`.

Reduced motion falls back to a static `px-10` + `rounded-slab`, no scroll
listener, no transform.

Checked for softness, since scaling a slab full of large serif type is the
obvious risk: at `scale(0.975)` the Newsreader heading rasterises clean under
magnification. If it ever does go soft, the fallback is a 4-sided `clip-path`
inset, which shrinks the block without touching the text — but it brings back
the "background growing behind fixed text" look that was already rejected once.

**2. The Ecosystem accordion is full bleed inside its slab — `Ecosystem.jsx`.**
The rows were inside `Container` (max-w-7xl, px-10), leaving a 40px strip of
slab either side. The head stays in the 1280 measure; the list moved outside
`Container` and runs to the slab's own edges. Row padding is
`px-6 md:px-10 lg:px-14` to keep text off the edge.

Verified at 1280x591: `scale(0.94)` on arrival putting the block at 1189px
inside a 1265px page — 38px of cream either side — running to full width and
zero radius exactly as the top edge lands, with the junction between a flush
slab and the shrunken one below it reading cleanly.

Known and harmless: the accordion driver reads `getBoundingClientRect().top` on
a list that lives *inside* the scaled element, while its pitch comes from
`offsetHeight`, which transforms do not touch. So while a slab is mid-scale the
derived index can sit up to ~0.2 of a step out. It resolves to exact at scale 1,
and at 1280x591 the accordion sequence does not begin until the slab is already
flush.

Open points, each a one-line change:
- The accordion rows keep their `rounded-[1.5rem]`, so an open row's tint shows
  a small corner arc against the slab edge. `rounded-none` makes it a true
  edge-to-edge band.
- `ToolStrip` never used `Slab` — it hand-rolled the shape. Settled in Step 3k:
  its block is gone, so there is nothing left to reconcile.

### Step 3g — Client fix list, after reading nuraform.com

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

9. **The nav is one liquid-glass pill** (superseded the hairline bar long ago; this
   entry rewritten in Step 4.8). Sticky, full width across the hero, contracting to
   its contents past 260px on desktop. Glass: 2px frost + rim, with a true SVG
   lens bend at the rim in Chromium only and a harder-frosted rim band standing in
   for it in Safari/Firefox. Every piece in it -- mark, AKRONIX wordmark (from the
   artwork, red I), links, CTA, Menu -- is solid and toned black or white by what
   `useBackdropTone` finds painted under it. Nothing is blended. No active-link
   underline, no logo plate, no hover tilt: all three were removed or rejected by
   the client. Read the comment at the top of `Nav.jsx` before changing it; Steps
   4.4-4.8 record why each piece is the way it is.

10. **Page transitions are asymmetric on purpose:** 500ms in, 200ms out. Symmetric
    600ms made navigation feel laggy. The plan's 600ms still governs scroll reveals.

11. **Motion API gotcha:** per-state timing goes *inside* the target object —
    `exit={{ opacity: 0, transition: {...} }}`. `transition={{ exit: {...} }}` is
    silently ignored. Cost a bug during this step.

12. **The specimen lives at `/specimen`, dev-only.** Guarded by `import.meta.env.DEV`,
    so it never reaches production. Keep it as the token reference.

13. **The Chrome extension WAS connected on 2 Sep 2026** and the whole of Step 3r
    was measured in it -- do not assume it is unavailable, try it. Load the site
    into an `<iframe width="390">` served from `public/` (same origin, so
    `contentDocument` is readable, and media queries answer to the iframe's own
    box). Setting `iframe.width` and reloading walks a whole range of viewports
    in one pass. Delete the harness file afterwards. A `canvas` 2d context
    measuring text in the page's own computed font is what turns "make it fit on
    one line" into a size you can solve for. If the extension is ever not
    connected, routes can still be verified by server-rendering them: write a temporary `src/__smoke.jsx` that renders each path
    through `MemoryRouter`, `npx vite build --ssr src/__smoke.jsx --outDir .smoke`,
    run it, then delete both. The output dir must sit **inside** the project or Node
    cannot resolve `node_modules`. This catches import errors, hook misuse and render
    crashes.

14. **Verify where the client looks: Safari on a MacBook Pro, 1512x860.** The
    Chrome extension has not been connected since Step 3r. What works instead:
    Playwright's Chromium and WebKit are cached in `~/Library/Caches/ms-playwright/`;
    install `playwright-core` into the session scratchpad (never the project),
    point it at the running dev server, and screenshot any viewport. WebKit lays
    out like Safari but does **not** paint `backdrop-filter` in screenshots; to see
    Safari's glass, render in Chromium with `navigator.userAgentData` hidden by an
    init script -- that serves exactly the markup Safari gets. The overflow probe
    used since Step 4.2 walks eleven widths, 320 to 2560.

15. **Centred `SectionHead` titles stay under ~22 characters.** Its words are flex
    items, so `text-balance` cannot reach them, and a longer centred title wraps
    inside its accent at desktop. Broke three times (Steps 4.2, 4.5).

16. **Shared sections take props, with the homepage as the default.** `QuoteBand`,
    `FinalCta` and `Advantages` render the homepage exactly when given nothing,
    and another page's words when given props. `Container wide` (1600 measure),
    `Slab clip` (sticky children) and `Slab anchor="top"` (very tall slabs) are
    opt-in. Build new pages from these rather than copying them.

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

`Hero.jsx`, the `clamp()` on the `<h1>`. Below `lg`: `clamp(2.5rem, min(24vw,
30svh), 7rem)`. From `lg` (Step 4.5/4.6): sized to fill the first screen --
`clamp(4rem, min(column / 3.5, (100svh - 18rem) / 3.1), 12rem)`, the column
being 46% of the `Container wide` box. 185px at 1512x860. The derivation is in
the comment above the heading; re-derive it if the words or the column change.

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

### Responsive — checked at 375px, and how

**Superseded in part by Step 3r**, which re-measured all of this at thirteen
viewports from 320 to 1280 and changed the mobile gutter. The 2.5rem slab inset
noted at the end of this section is the one thing here still standing.


The browser here will not resize its width, which is why this went unchecked for
so long. The way round it: load the site into an `<iframe width="390">` on a
page and read `contentDocument`. Media queries inside an iframe answer to the
iframe's own box, so it is a real 375px viewport, not a zoom. Use that trick
rather than assuming again.

What holds at 375px:
- No horizontal overflow anywhere. The only element wider than the viewport is
  the tools marquee at 2439px, which is `w-max` inside an `overflow-hidden`
  track and is meant to be.
- The nav contracts to mark plus Menu, and the mobile sheet is there.
- Ecosystem, Advantages, FinalCta and the footer all reflow; the booking card
  sits at 295px wide and its fixed height holds across all three steps.

Two things were broken and are fixed:
- The hero headline rendered at **112px on a 375px screen** — `min(29vw, ...)`
  in the clamp — and "Connect." could not fit the measure. It is 19vw now. Any
  viewport at or above ~589px hits the 7rem cap either way, so desktop is
  untouched; it is 74px at 375px.
- Worse, the headline lines had no `whitespace-nowrap`, and the letters inside
  them are inline-blocks, so "Connect." **broke mid-word** into "Conne / ct."
  `SectionHead` had the guard and `Hero` did not. Any future per-letter split
  needs it.

Still not looked at: anything between 376px and 1279px, and no real device has
been used. The fixed `2.5rem` slab inset is 80px of a 375px screen, which is a
lot of the width; the client asked for a fixed value, so it stays until they
say otherwise.

---

## Next

Step 5 — the remaining pages, in this order. `/building` is done (Steps
4.1-4.8). Build the rest from the same parts -- see decision 16 -- and verify
at 1512x860 and 375 before calling anything finished (decision 14).

1. `/work` — services and pricing on one page. Reads `src/content/services.js`.
   Pricing is settled: the ₹999 / ₹2,499 / ₹4,999 tiers ship with their current
   contents. Raised twice and reaffirmed; do not re-litigate.
2. `/studio` — the thesis and working method, long-form. No people, no timeline,
   no mission/vision/values.
3. `/contact` — the four-step flow from contact.md is usable; the form belongs
   here rather than on the homepage.
4. `/policies` — legal utility. Note it is dated 22 March 2026, a future date,
   and uses `admin@akronix.org` while contact.md uses the Gmail address.

Then SEO metadata, OG images, 404 polish. The favicon is done; see Step 3q.

The client has been following the live site's page structure closely (Step
4.4 rebuilt /building to it). Before proposing a page, read its legacy file in
`_legacy_content/pages/` and ask whether to follow that structure.

## Waiting on the client

Items 1-3 are built and idle until someone supplies the missing half; 4-6 want
the client's eye:

1. **A booking endpoint.** `site.bookingEndpoint` is null, so submitting the
   booking form falls back to the visitor's own mail client and the closing
   screen says only that. Set it to a form/email service URL and the panel
   POSTs instead and switches to the scheduled wording.
2. **A real Google Meet room.** `site.meetLink` is null. Whatever receives the
   booking is also what has to issue the link.
3. **The hero demo video.** `hero.videoUrl` and `hero.videoPoster` are null and
   the frame shows a plainly labelled placeholder. Drop an `.mp4` into
   `/public` and set the two values; the choreography needs no other change.

4. **Stage of the six added products.** Attendance, Project Management, Books,
   E-commerce, LMS and Helpdesk show "Planned" (Step 4.3). If any is being
   built, flip its `stage` and `building` in `src/content/products.js`.
5. **A read of the product copy.** The twelve summaries and scope lists
   (`products.js`) and the four boxes (`content/building.js`) are written from
   the legacy lists and claim nothing beyond them, but nobody at Akronix has
   signed them off.
6. **One look at the nav glass in real Safari.** Every Safari-path check so far
   was the Safari markup rendered in Chromium (decision 14).

The old open question -- the nav tinting pink and pale blue over the forest and
cocoa slabs -- is **closed**: the client chose black-or-white links in Step 4.7.

Run with `npm run dev`.
