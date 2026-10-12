# Akronix — Project Standards

## What this project is

Akronix is a new studio building its own SaaS products and taking on client
work in software development, digital marketing, business networking, and
mentorship.

We are rebuilding the website at https://akronix.org **from scratch**.

**Why:** the client feels the current site looks AI-generated and inauthentic.
Avoiding that outcome is the single most important goal of this rebuild. A
technically correct site that still looks generic is a failed rebuild.

---

## Company reality — read this before anything else

Two facts govern every decision on this site:

1. **Akronix has zero clients.**
2. **The six SaaS products are in development. None have shipped.**

The current site does not reflect this. It shows $250,000 in revenue, 1,420
clients, a partner logo wall, a testimonials page promising stories that don't
exist, and six products presented as purchasable. This — not the visual design —
is the most likely reason it reads as fake. Visitors sense the mismatch even
when they can't name it.

Redesigning while keeping the invented proof produces a prettier site with the
same problem.

**A new company can look completely legitimate. It cannot look established.**
Chasing the second is what forces the fabrication. Aim for the first.

### Never include

- Client counts, revenue figures, project counts, or any invented metric
- Testimonials or case studies
- Partner or client logo walls — the current logos (Microsoft, AWS, Google,
  etc.) are tools we use, not partnerships, and presenting them as endorsements
  is a core part of what reads as fake
- Fake product dashboards showing made-up data
- "Trusted by", "Join hundreds of businesses", or similar framing

### Lean on what is real

- The actual team — real names, roles, backgrounds. A small real team is more
  convincing than a large fake number.
- Real screenshots of real progress on the products. An unfinished real UI
  beats a polished mockup of nothing.
- Transparent pricing. Most agencies hide it; showing it reads as confidence.
- A clear, specific point of view on how we work.
- Founders' prior experience, described honestly as prior experience.

### Products

- Never present the SaaS products as available, purchasable, or in use.
- State the actual stage: in development, early access, waitlist.
- List every product the client names, each with its true stage. The client
  chose to show all twelve from the live site (STATUS Step 4.3): the six being
  built read "Coming soon", the six not yet started read "Planned". The stage
  label is what keeps this honest -- never drop it, never soften it.
- Replace "View All Products" and buy-now framing with follow-along framing:
  waitlist, early access, build updates.
- Building in public is a positioning, not an admission. "We're a studio
  building our own products and taking client work" is a real, well-regarded
  model. Tell that story.

**When a section has no real substance behind it, remove the section. Do not
fill it.**

---

## Tech stack

- ReactJS + Vite
- TailwindCSS
- Framer Motion
- Lenis (smooth scrolling, site-wide)
- JavaScript — **no TypeScript**

---

## Legacy content

The `_legacy_content/` folder holds the scraped content of the current live
site. It is reference material only — none of it is production code.

| Path | What it is |
|---|---|
| `pages/` | 19 markdown files, one per page of the current site |
| `pages_final.json` | The full scrape as a single JSON blob; `pages/` was generated from this |
| `pages_final.backup.json` | Backup copy of the above |

Page files in `pages/` are named after their URL path: `home.md`, `about.md`,
`services_saas-development.md`, and so on.

**Known issues in the scraped text:**
- Some headings have missing spaces where the original had styled spans
  (e.g. `Focused onImpact.`, `takeour wordfor it`). Fix these when reusing copy.
- Image URLs point at the live site and will break if it goes down.
- `pricing/testimonials` is a placeholder — there are no real testimonials.

Treat legacy copy as a record of what the old site said, not as a spec. Much of
it is generic marketing filler, and some of it is not true. Rewrite; do not port.

---

## Site structure

The current site's 19 pages include seven near-identical service pages, all
within 100 bytes of each other in length. That structure exists to look large,
not because there is enough distinct content to fill it.

Target a focused site of roughly 5–6 pages. A smaller site done properly reads
as more credible than a padded one. Consolidate the service pages unless a page
has genuinely distinct content to justify itself.

Propose the sitemap before building it.

---

## Design rules

**Hard rules:**
- No inline CSS. Use Tailwind utility classes. (Framer Motion `animate` and
  `initial` props are fine — that is animation state, not styling.)
- No `font-bold` or `font-semibold` except on main headings.
- Minimal rounded corners. Sharp edges are the default; use radius sparingly
  and deliberately.
- White / bone white is the primary color.
- Do not use font style as "mono".

**Direction:**
The site should feel premium, considered, and editorial — not like a template.
Design decisions beyond the rules above are yours to make, but they must be
deliberate and consistent, and you should be able to explain each one.

**Avoid these, which are what "AI-made" usually means in practice:**
- Purple-to-blue gradients, glowing cards, generic 3D blobs
- Symmetrical three-column feature grids with an icon above each heading
- Stock icon sets used decoratively with no informational purpose
- Fake dashboard mockups showing invented metrics
- Filler copy like "empowering businesses to achieve more"
- Every section following the same heading → subheading → grid rhythm
- Every clickable button should have roll up animation. If you do not have any idea about roll up animation, refer the buttons in the home page, hover over any link in navbar to experience that animation!

---

## Reference sites

- https://wisprflow.ai and https://wisprflow.ai/notetaker
- https://www.withjuno.com
- https://www.nuraform.com

**What to take from them — the method, not the layout:**

1. **Demonstrate, don't describe.** Wispr shows messy speech transforming into
   clean text, side by side. It shows 45 wpm against 220 wpm with both texts
   rendering live. Find the Akronix equivalent using things that actually exist.
2. **Every claim carries evidence.** If we can't evidence it, cut the claim.
3. **Sections have different shapes.** Their feature blocks, comparison, and
   FAQ are all structurally different. Do not repeat one section rhythm.
4. **Typography does the work.** Wispr mixes roman and italic within single
   headings as a signature device. Pick one such device and use it consistently.
   (Step 6: ours is a heading in ink with its second half in grey, and a single
   red full stop on the hero headline. Not italic.)
5. **Long-form where it earns attention.** Their FAQ answers are essays, not
   one-liners, because the questions are real.

**Critical caveat:**
Wispr has one shipped product with a visible transformation to demo. Akronix has
neither yet. Do **not** copy their demo modules and fill them with invented
content — that is precisely how the current site's fake dashboard came to exist.
Where we lack real proof, the section should be simpler and quieter, not faked.

---

## Content principles

- Rewrite legacy copy rather than reusing it verbatim.
- Prefer specific claims over abstract ones. Name the actual product, the actual
  outcome, the actual capability.
- Do not invent testimonials, client logos, metrics, or case studies.
- "Build. Connect. Scale." could be any company. The homepage's first screen
  should say something only Akronix could say.

---

## Client decisions that override this file

The client has overruled parts of this file on purpose. These stand until they
say otherwise; the reasons and the history are in `STATUS.md`.

- **The look is corporate, not editorial (Step 6, 10 Oct 2026).** The client
  said the cream-and-terracotta site "looks AI generated" and asked for the
  look of a high-end multinational's website. That **supersedes** the cream
  palette, the rounded section slabs, the pill buttons and the roman/italic
  accent device (Steps 3c-5.1): sharp edges are the default again, white is the
  ground, black and the logo's red are the only neutrals and accent. Details
  and the rules that follow from it are in STATUS Step 6. Do not bring back
  rounded section blocks, pill buttons, cream, an italic accent word in a
  heading, or a centred eyebrow-heading-subtext stack: they are what read as a
  template.
- **The nav is the liquid-glass pill** (Steps 4.4-4.8), **restored in Step 6.1**
  after the client rejected the corporate full-width header that replaced it.
  Round, floating, with a solid black-or-white logo, wordmark, links and
  button, **the word "Home" first** (not an icon, Step 7), and cards under
  Products and Solutions that list **only the core items** -- the six products
  in development, the four main lines of work -- with a "See all" row for the
  rest (Step 7). It is the one rounded thing left in the system apart from the
  pricing page (below), on purpose. Read the comment at the top of
  `src/components/shell/Nav.jsx` before touching it.
- **The first screen is white, and the nav blends into it** (Step 7). The client
  said a company profile should not open black and that the nav sat on a
  separate strip. Every opening block takes `NAV_PULL` (`src/lib/navPull.js`) so
  it runs up behind the pill. Do not put a black hero or a strip above the page
  back.
- **The pricing page is glossy and curved** (Step 7, the client's request):
  `.gloss` / `.gloss-dark` and large radii, on that page only. It is a deliberate,
  page-limited exception to "sharp edges by default"; the rest of the site stays
  flat and square.
- **The About page has interface sound** (Step 7, the client's request):
  synthesised, off until the visitor turns it on, About-only, opt-in, remembered
  in `localStorage`. Keep it off by default and never play a sound without an
  unlocked, running audio context (STATUS, decision 18).
- **The policies page is the live site's four-document page, ported** (Step 7);
  the live site has no separate privacy or terms pages, so the footer's "Privacy
  Policy" and "Terms & Conditions" deep-link to its Overview and Startup
  Execution documents. Text was reworded to claim nothing untrue -- see the
  header of `src/content/policies.js`.
- **Two phone numbers, as given** (Step 7): `site.phones`. The second is nine
  digits; it is published exactly as supplied until the client says otherwise.
- **Twelve products, not six** (Step 4.3) -- see Products above.
- **`/building` follows the live products page's structure and headline**
  ("Our Products, Built to Power Your Business") (Step 4.4). The lede under it
  carries the true stage.
- **One typeface: IBM Plex Sans** (Step 6; Schibsted Grotesk in 5.1, a serif
  pairing before that). Headings are regular or light weight, never bold; there
  is no italic and no monospace anywhere.
- **Every product has its own colour** (Step 5.1), taken from the live
  products page. Colour marks the product; the stage is always written as a
  word, and solid-versus-pale repeats it as a second cue (Step 6.1) -- never the
  only one.
- **The nav has no active-link underline** (Step 4.4).
- **`/building` is a filterable portfolio of twelve cards** (or a ruled list --
  the page has a Cards / List switch, Step 7) with a spectrum of twelve colours
  above it (Step 6.1), not a stack of long panels; the client rejected that.
  Every card still opens the contact form with the product chosen, as a request
  for early access. The home page's products section is a colour showcase
  (`Showcase.jsx`, Step 7) that links the same way.

Declined requests stay declined: no "Demo" button and nothing that presents a
product as shipped (STATUS, "Standing refusal").

## Verification

The client reviews in **Safari on a MacBook Pro, at a 1512x860 viewport**.
Check every change there and at 375 before calling it done. How to do that
without a connected browser extension is in `STATUS.md` ("Decisions future
sessions need", no. 14).

## Workflow

**Before touching the project:**
Read `STATUS.md` and `TODO.md` first. They tell you what is done and where the
project currently stands.

**While working:**
Maintain `TODO.md` as the task list for the feature or section currently being
built. Keep it granular enough to be useful.

Update `STATUS.md` as you go -- after each meaningful change or finding, not
only at the end. Anything found but deferred goes into `STATUS.md` before you
move on. (Client instruction.)

**On completing a feature:**
1. Clear `TODO.md` completely.
2. Update `STATUS.md` with what was built and any decisions made that future
   sessions need to know about.

**Planning:**
For any new section or feature, propose the approach before writing code. Do not
scaffold large amounts of the site in one pass.

**If a requested section would require inventing proof, say so and propose an
honest alternative instead of building it.**