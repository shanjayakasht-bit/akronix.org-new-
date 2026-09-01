# Akronix — Status

Rebuild of akronix.org from scratch. Direction agreed and approved; see the plan at
`~/.claude/plans/read-claude-md-in-full-enchanted-brooks.md` for the full sitemap,
content audit, design system and homepage structure.

---

## Done

### Step 3q — Rolling stragglers, 375px, favicon (current)

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

### Responsive — checked at 375px, and how

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

Then SEO metadata, OG images, 404 polish. The favicon is done; see Step 3q.

## Waiting on the client

Three things are built and idle until someone supplies the missing half:

1. **A booking endpoint.** `site.bookingEndpoint` is null, so submitting the
   booking form falls back to the visitor's own mail client and the closing
   screen says only that. Set it to a form/email service URL and the panel
   POSTs instead and switches to the scheduled wording.
2. **A real Google Meet room.** `site.meetLink` is null. Whatever receives the
   booking is also what has to issue the link.
3. **The hero demo video.** `hero.videoUrl` and `hero.videoPoster` are null and
   the frame shows a plainly labelled placeholder. Drop an `.mp4` into
   `/public` and set the two values; the choreography needs no other change.

And one open design question: over the `forest` and `cocoa` slabs the inverting
nav lands tinted (pink and pale blue respectively), because inverting a
saturated colour gives its complement. Raised twice; the client has not picked
between accepting it, outlining the CTA so the largest tinted shape goes, or
dropping to a per-section colour flip.

Run with `npm run dev`.
