# ALL THE MISTAKES IN THE UI

## HERO SECTION
- I didn't like the center design! Make it left aligned and make it reveal from bottom to top once page loads.
- Do not use the font which you have used for the text "Software, marketing & networking for growing businesses". Also do not use the font which you have used for the text "We help startups and growing companies build reliable software, run practical marketing, and connect with the right people — software development, digital marketing, business networking and mentorship, from one team." Change both the fonts!
- Remove the content "We help startups and growing companies build reliable software, run practical marketing, and connect with the right people — software development, digital marketing, business networking and mentorship, from one team." from hero section.
- Give the navbar a glass effect! Apply Glass morphism.
- Make the Hero section look premium.
- Right side add the demo video!
- Make the navbar as a pill shape which takes the entire width but as the user scrolls from hero section to next section reduce the width of the navbar by removing the company name and just keeping their logo on the left end which takes the perfect curve of the pill's curve and the rest of the navbar should contain the remaining links, if user hover over the navbar, expand it and bring it back to how it was at the start of the page.
- either 2 options, make the text very giagantic "Build. Connect. Scale." each taking a whole line from end to end OR do it as I said before! (left align the text in normal size and add the demo video on the right side)! I would say go with 1 first if it looks good then fine else go with 2!
- Now as user scrolls! The video should also move along with user and scale up in size! As the first section comes to an end, the video should be at the center, it should take the full screen! The corners should go from rounded corners to sharp pointed corners taking the end of the screen and filling it! As user scrolls more the pointed corners should come back to its rounded corners and it should scroll to next section! Got it?

---

# RESOLUTION — HERO SECTION

**Every error listed above has been solved,** with one item that is built and
working but needs a file from you (noted at the bottom).

| # | Item | What was done |
|---|---|---|
| 1 | Centred → left aligned, reveal bottom-to-top on load | Hero is left aligned. Each word rises out of its own mask on page load, staggered 0.12s apart. |
| 2 | Change both fonts | Eyebrow was IBM Plex Mono → now Instrument Sans, uppercase, 0.22em tracked. The second paragraph's font is moot — the paragraph is deleted (item 3). |
| 3 | Remove the "We help startups…" paragraph | Deleted from `src/content/home.js`. Verified absent from the whole `src/` tree. |
| 4 | Glassmorphism navbar | Translucent ground (`bg-paper/55`), heavy blur, 1.6× saturation lift, bright top edge (`border-white/45`) and a soft drop shadow so it floats over the cream page and the dark slabs alike. |
| 5 | Make the hero premium | Gigantic Newsreader display, generous vertical rhythm, the third word in true italic clay, and the full-bleed video moment below. |
| 6 | Demo video | Frame, scroll behaviour and player are built. **Needs your file — see below.** |
| 7 | Pill navbar: full width → shrinks past the hero, logo seated in the left curve, hover to expand | Full width across the hero; past 260px the wordmark collapses to zero width and the pill contracts to 660px, leaving the mark in the left curve. Hovering the bar restores full width. Verified in the browser. |
| 8 | Option 1 (gigantic type) or option 2 (normal + video right) — try 1 first | **Now on option 2, at your request.** Type left at normal display size, video in the right column. |
| 9 | Video scales with scroll → full screen, sharp corners → back to rounded | Sticky video on a 260vh track. Inset + 28px radius → full-bleed + 0px radius at the midpoint → back to rounded before the next section. Verified full-bleed in the browser. |

### Follow-ups after the first pass

**Switched to option 2.** Type left at normal display size, demo video in the
right column. The video still does the full scroll move from item 9: it leaves
its column, fills the viewport with corners squaring off, holds, then returns
to a rounded frame. The type column fades out as the video takes over.

**Navbar CTA overflowed the pill — fixed.** Contracted, the pill was animating
to a fixed 660px, which is narrower than the links plus the "Book a
Consultation" button, so the button hung outside the rounded edge. The pill is
now sized to its own contents when contracted (`w-fit`) and full width when
expanded, with motion's `layout` animating between the two intrinsic widths.
The button can no longer overflow at any width. Verified in the browser.

`src/components/ui/FitText.jsx` is kept but currently unused — it is what made
option 1's edge-to-edge words work (a `vw` font size cannot, since it knows the
viewport but not the typeface's metrics). Left in place in case you want option
1 back; delete it if you are sure you do not.

### The one open item — item 6, the video file

There is no video, so the frame currently shows a **plainly labelled
placeholder**: the Akronix mark over a dark ground with the caption "Demo
video". It is deliberately *not* a mocked-up product screen — nothing has
shipped, and a fabricated product demo is the exact thing this rebuild exists
to remove.

To switch it on, drop an `.mp4` into `/public` and set two values in
`src/content/home.js`:

```js
videoUrl: '/demo.mp4',
videoPoster: '/demo-poster.jpg',
```

The scroll behaviour, sizing and corner animation already work and need no
further changes — the real video will inherit all of it.

### Verified

Build clean. All 7 routes server-render. Hero reveal, navbar shrink/expand and
the video's full-bleed transition all confirmed in the browser at 1280px.

Not yet checked below 1280px — the browser here will not go narrower.

---

# RESOLUTION — HERO SECTION, ROUND 2

**Every error mentioned in this round has been solved.** I got both wrong on the
first attempt; this note describes what is actually in the code now, checked in
the browser against your dev server.

| # | Item | What was done |
|---|---|---|
| 1 | The video must start beside the hero text, then get its own section below and keep zooming | The hero is split in two: type on the left, video on the right. The video is pinned there, so the headline scrolls up and away from underneath it while the video holds its place. Only once the hero has completely left the screen does the video start to grow — out to full-bleed with square corners on a screen of its own, then back to a rounded frame before the tools strip. |
| 2 | The top row should not be in boxes — just moved to the top | The hairline-divided cells are gone. The four capabilities are plain text on one line at the top, each with its clay dot, exactly as they read before — only their position changed. |

### What I got wrong the first time, and why

**Attempt 1** put the zoom inside the hero's own pinned viewport, so the video
grew *over* the headline. **Attempt 2** over-corrected: I removed the video from
the hero entirely and gave it a standalone section, which lost the thing you
wanted at the start — the video sitting beside the type.

The version now in the code does both, and the reason it can is worth recording
for a future session: **the hero and the video's screen share one scroll
track.** They have to. The video is a single element travelling between them, so
one scroll position has to drive both. The hero is 100svh of a ~360svh track, so
it is gone by progress 0.385 — and nothing moves before 0.40. That gap is what
keeps the zoom off the headline, and it is the number to change if the timing
ever needs adjusting. `src/components/sections/Showreel.jsx` from attempt 2 has
been deleted; it is all in `Hero.jsx`.

### One thing I changed that you did not ask for

The dead band above the hero is gone. The nav pill is sticky *in flow*, so it
already occupies its own ~5rem at the top of the page — the hero was then adding
another 128px of its own on top of that, which is where the gap you flagged in
an earlier round came from. The hero now adds only breathing room and measures
itself as `calc(100svh - 5rem)`, so it fills exactly one screen.

### Verified in the browser

Hero at rest: type left, video right, capabilities plain across the top. Pinned
hold while the headline scrolls away, growth to full-bleed edge to edge with
square corners, and the return to a rounded frame — all four stages confirmed by
screenshot. Build clean.

### Still open — the video file itself

Unchanged: `hero.videoUrl` is `null`, so the frame shows the plainly labelled
placeholder rather than a mocked-up product screen. Drop an `.mp4` into
`/public` and set `videoUrl` in `src/content/home.js` — the real video inherits
every stage of the movement with no further changes.

---

# RESOLUTION — HERO SECTION, ROUND 3 (the video's path)

**Every error mentioned in this round has been solved.**

### Where the path lives

`src/components/sections/Hero.jsx`, line 26 (`STEPS`) and the five
`useTransform` lines below it. `STEPS` is the list of scroll positions; each
transform says what the video's box looks like at each of them. Read them as
columns — one scroll stop per position:

| progress | width | height | right | top | radius |
|---|---|---|---|---|---|
| 0 | 44% | 42vh | 4% | 30vh | 26 |
| 0.385 | 48% | 44vh | 16% | 46vh | 26 |
| 0.68 | 94% | 93vh | 2% | 4vh | 26 |
| 0.72 | 100% | 100vh | 0% | 0vh | 0 |
| 0.86 | 100% | 100vh | 0% | 0vh | 0 |
| 0.90 | 94% | 93vh | 2% | 4vh | 26 |
| 1 | 76% | 62vh | 12% | 19vh | 26 |

`right` growing is what carries the frame left. `top` growing is what carries it
down. **The two rising together over 0 → 0.385 is the diagonal.**

### What was wrong and what changed

| # | Item | What was done |
|---|---|---|
| 1 | The video moved straight down instead of diagonally | Rows `0` and `0.40` used to be identical — the frame was frozen for the first 40% of the track, and a frozen sticky element is exactly what reads as travelling straight down the page. It now drifts from the first scroll: `right 4% → 16%` and `top 30vh → 46vh` move together, so it goes down and left at once. |
| 2 | It should keep growing as it travels | It does, but in two stages, per your answer: it drifts at roughly its hero size until the headline has gone (0.385), then grows out to full-bleed. That is what keeps it off your type. |
| 3 | Rounded corners must not square off during the growth | `radius` used to run `26 → 0` across the *same* window as the growth, so the corners squared off the whole way. It now holds at 26 through the stop at 0.68 — the point the frame reaches the screen edges — and squares off only over the sliver from 0.68 to 0.72. Stop 0.90 is its mirror: the corners round again the moment the frame leaves the edges on the way out. |

### One fix that was not in your list but was breaking the diagonal

The pinned layer used to start *below* the nav pill, so the frame spent the
first 78px of scroll settling upward before it pinned — and that upward settle
cancelled the start of the downward drift, which is part of why the movement did
not read as diagonal. The layer now reaches `4.875rem` above the track, the
exact height the nav occupies in flow, so the frame is pinned from the first
pixel.

### Verified in the browser

Rest, drift (down and left together), growth with corners still round, full
bleed with corners square. Each stage confirmed by screenshot. Build clean.

### If the timing needs tuning later

`0.385` is where the growth starts — raise it to keep the frame small for
longer. `0.68` is where the corners begin to square — raise it to hold them
round even closer to the edges.

---

# RESOLUTION — HERO SECTION, ROUND 4 (route D, plus three fixes)

**Every error mentioned in this round has been solved.**

You picked **D — slide, then fill**, with the growing running from the first
scroll rather than after the slide. That is what is built.

### The path

`src/components/sections/Hero.jsx`. The stops are named constants near the top:

| phase | range | what happens |
|---|---|---|
| `TRAVEL_END` | 0 → 0.45 | The frame's centre moves from beside the headline to the centre of the screen. |
| `GROW_END` | 0 → 0.72 | Growth, running *underneath* the travel. Both begin on the first scroll — no frozen stretch, no pause. |
| `HOLD_END` | 0.72 → 0.86 | Full bleed. |
| — | 0.86 → 1 | Shrinks back to a rounded frame and releases. |

Growth is eased, so it is slow early. That is deliberate: by the time the frame
is wide enough to reach the type, the hero has already scrolled off. It is how
the video can start growing immediately without covering the headline.

**The corners are not on a schedule at all any more.** The radius is derived from
how close the frame is to the screen edges, so it holds round the whole way out
and squares off only once the frame is actually touching them — and the exit is
symmetrical for free, with no extra stops to keep in sync.

### The three fixes

| # | Item | What was done |
|---|---|---|
| 1 | The video shrank in the hero | It was shrunk to clear the capability row. It is back at full size — half the content column wide — and it is the row that is protected now, by a ceiling the frame cannot cross. On a short screen the frame gets shorter rather than covering it. |
| 2 | Big gap above "Build. Connect. Scale." | The headline was being pushed to the bottom of the hero, which opened a dead band under the capability row. Spare height now splits evenly above and below instead of piling on top. |
| 3 | Nothing lined up | The headline, capability row and nav are positioned against the page's content column; the video was positioned against the screen edge. Three different rulers. The frame is now **measured off the type column itself** — right edge on the content column's right edge, bottom edge on the same line as the bottom of the buttons. |

### Why the geometry is measured instead of written in vw

A percentage of the viewport cannot land on the content column, because the
column is a centred `max-w-[1280px]` box with its own padding — the two only
agree at exactly one window width. The rest frame is measured from the DOM and
re-measured on resize, so the alignment holds at every width.

One consequence worth recording: the full-bleed size is measured from the pinned
layer, **not** from `document.documentElement.clientWidth`. Read at mount,
`clientWidth` can still report 1280 while the vertical scrollbar is settling —
the frame then overflows by the scrollbar's width and the page grows a
horizontal scrollbar at full bleed. Measuring the layer makes it self-correcting.

### Verified in the browser

Rest (aligned), travel with simultaneous growth, full bleed with square corners,
exit, and the hand-off to the tools strip. No horizontal scrollbar at any point.
Build clean.

### The four routes

The options page is at
<https://claude.ai/code/artifact/ebe1e495-8fcd-47fe-a6e7-35e5a284f671> — D is
marked as built and its animation now matches the code, so it stays usable as a
record of what was on the table.

### Still open — the video file itself

Unchanged: `hero.videoUrl` is `null`, so the frame shows the plainly labelled
placeholder. Drop an `.mp4` into `/public` and set `videoUrl` in
`src/content/home.js`.
