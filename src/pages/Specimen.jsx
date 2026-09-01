import {
  Body,
  Container,
  Display,
  Grid,
  H1,
  H2,
  H3,
  Lede,
  Mark,
  Qualifier,
  Rule,
  Section,
  StageMark,
  UI,
} from '../components/primitives'

const SWATCHES = [
  ['paper', 'bg-paper', '#F6F4EF', 'Page ground'],
  ['panel', 'bg-panel', '#FFFFFF', 'Panels only'],
  ['ink', 'bg-ink', '#141414', 'Primary text'],
  ['ink-2', 'bg-ink-2', '#5C5A55', 'Secondary text'],
  ['ink-3', 'bg-ink-3', '#8A867E', 'Captions'],
  ['rule', 'bg-rule', '#DEDAD1', 'Hairlines'],
  ['signal', 'bg-signal', '#BF3B12', 'Under 1% of pixels'],
  ['night', 'bg-night', '#151412', 'One section site-wide'],
]

/* Class names must be literals -- Tailwind scans source statically and cannot
   resolve an interpolated `text-${token}`. */
const SCALE = [
  ['display', 'text-display', '88 / 0.95 / -0.03em'],
  ['h1', 'text-h1', '64 / 1.00 / -0.025em'],
  ['h2', 'text-h2', '40 / 1.10 / -0.02em'],
  ['h3', 'text-h3', '26 / 1.25 / -0.01em'],
  ['lede', 'text-lede', '21 / 1.55'],
  ['body', 'text-body', '17 / 1.65'],
  ['ui', 'font-sans text-ui', '14 / 1.50'],
  ['mark', 'font-mono text-mark uppercase', '11 / 1.20 / +0.12em'],
]

export default function Specimen() {
  return (
    <main>
      <Section>
        <Mark as="p">Foundation specimen</Mark>
        <Display className="mt-5">
          A studio in Chennai building business software{' '}
          <Qualifier>for clients, and for ourselves.</Qualifier>
        </Display>
        <Lede className="mt-6">
          Not site copy. This page exists to check the tokens, the scale and the
          signature device at 1440, 768 and 390 before any section is built.
        </Lede>
      </Section>

      <Rule />

      <Section>
        <Grid>
          <div className="col-span-4 md:col-span-5">
            <Mark as="p">Type scale</Mark>
            <H2 className="mt-5">Size and space carry the hierarchy.</H2>
            <Body className="mt-6 text-ink-2">
              Everything sits at weight 400. 14&ndash;17&ndash;21&ndash;26 runs at
              about 1.23, then breaks deliberately to 40 so no mid-weight heading
              competes for rank.
            </Body>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <dl>
              {SCALE.map(([token, cls, spec]) => (
                <div key={token} className="border-t border-rule py-4">
                  <dt className={`${cls} font-normal`}>{token}</dt>
                  <dd className="mt-2">
                    <Mark>{spec}</Mark>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Grid>
      </Section>

      <Rule />

      <Section>
        <Mark as="p">Palette</Mark>
        <H2 className="mt-5">Bone ground, white as a material.</H2>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {SWATCHES.map(([name, bg, hex, use]) => (
            <div key={name}>
              <div className={`${bg} h-24 border border-rule`} />
              <UI as="p" className="mt-3 text-ink">
                {name}
              </UI>
              <Mark as="p" className="mt-1">
                {hex}
              </Mark>
              <UI as="p" className="mt-1 text-ink-3">
                {use}
              </UI>
            </div>
          ))}
        </div>
      </Section>

      <Rule />

      <Section>
        <Grid>
          <div className="col-span-4 md:col-span-6">
            <Mark as="p">Stage markers</Mark>
            <H3 className="mt-5">Mono states what a thing actually is.</H3>
            <div className="mt-8 flex flex-col gap-4">
              <StageMark active>In development</StageMark>
              <StageMark>Spec complete</StageMark>
              <StageMark>Launching</StageMark>
            </div>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-8">
            <Mark as="p">Controls</Mark>
            <H3 className="mt-5">Sharp by default.</H3>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="rounded-control bg-ink px-5 py-3 font-sans text-ui text-paper">
                Primary action
              </button>
              <button className="rounded-control border border-ink px-5 py-3 font-sans text-ui text-ink">
                Secondary
              </button>
            </div>
            <input
              className="rounded-control mt-4 w-full border border-rule bg-panel px-4 py-3 font-sans text-ui"
              placeholder="Form field"
              aria-label="Specimen form field"
            />
          </div>
        </Grid>
      </Section>

      <Section tone="night" className="text-paper">
        <Mark as="p" className="text-ink-3">
          The one dark section
        </Mark>
        <H1 className="mt-5">
          Six products in development. <Qualifier>None of them finished.</Qualifier>
        </H1>
        <Body className="mt-6 text-rule">
          Used once site-wide, at most twice. It is a change of ground, not a
          decorative band.
        </Body>
      </Section>

      <Section bare>
        <Container>
          <Mark as="p">End of specimen</Mark>
        </Container>
      </Section>
    </main>
  )
}
