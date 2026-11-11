import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { SectionIntro } from '../sections/SectionHead'
import { cx } from '../../lib/cx'
import { everyPlan, plans, comparison, comparisonNote } from '../../content/pricing'

/* The plan comparison (Step 7.5: audited and rebuilt as a matte table).
 *
 * What was wrong, and where it was:
 *  - The nav overlap. The nav is a `sticky top-0 z-50` wrapper holding a glass pill
 *    (`shell/Nav.jsx`), so everything scrolls up underneath it by design. The table
 *    gave that nothing to rest on: its plan names and prices were in an ordinary
 *    header, so they slid under the glass and out of sight while the rows were
 *    being read, and the section heading ran straight behind it. The header is now
 *    sticky and sits under the pill (`md:top-[5.25rem]`: the pill's bottom edge is ~82px,
 *    plus 2px, so no row shows between them), with a solid ground so rows do not show through it, and the
 *    section has a `scroll-mt` so a link to `#compare` clears the pill. A sticky
 *    header cannot live inside an element with `overflow: hidden`, which is what the
 *    old `.gloss` wrapper was, nor inside a scroller: so from 768px up nothing here
 *    clips or scrolls, and only below it does the table scroll sideways.
 *  - The red lines were the `Seg` spans added in Step 7.4, two to a cell. Gone, with
 *    the rings, the ticks that drew themselves and every animation: an indicator is
 *    a plain tick, or a dash.
 *  - It was not matte. `.gloss` is a white-to-grey gradient over the whole panel, a
 *    dome pseudo-element and a drop shadow, and the rows were transparent over it, so
 *    a row at the bottom was visibly greyer than one at the top. Rows are now flat
 *    white on a 1px border, on a light-grey section, with no shadow.
 *  - It did not show the plans' differences. It listed the five lines that are on
 *    every plan, all ticked, and nothing else; what each plan adds was only on the
 *    cards above. Every line of every plan is a row now, grouped, with a tick where a
 *    plan has it and a dash where it does not. Which is computed from `plans` itself,
 *    not typed: see `comparison` in `content/pricing.js`.
 *  - Column alignment was not broken (measured: each indicator's centre equals its
 *    header's, to a tenth of a pixel). What guarantees it now is that the header
 *    cell and the body cells are in the same fixed-layout columns, all centred.
 *
 * Growth is set apart the way the plans already do it, by treatment alone (its
 * `feature` flag): a faint tint down its column and a rule over its name. There is
 * no "Most Popular" label, on purpose -- see `pricing.js`: nobody has bought a plan,
 * so nothing can be popular.
 *
 * Responsive: from 768px the columns fit and the page scrolls. The scroller is
 * `relative` for a reason (STATUS, decision 17): every cell carries an absolutely
 * positioned `sr-only` label, and without a positioned ancestor inside the scroller
 * those escape its clipping and widen the whole page -- 200px of sideways scroll on
 * a phone. Below it the table
 * keeps its columns, scrolls sideways inside a labelled, keyboard-focusable region,
 * and holds its first column in place so the line being read stays named. */
function Mark({ has }) {
  return has ? (
    <>
      <span className="sr-only">Included</span>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[1.125rem] text-ink">
        <path d="m4.5 10.5 3.5 3.5 7.5-8" />
      </svg>
    </>
  ) : (
    <>
      <span className="sr-only">Not included</span>
      <span aria-hidden="true" className="block h-px w-3.5 bg-ink/25" />
    </>
  )
}

/* One plan's column: its ground and its centring. Growth's tint is a solid colour,
   not a translucent one: the header is sticky and rows pass under it. */
const col = (p, extra = '') => cx('text-center align-middle', p.feature ? 'bg-[#f8f9fa]' : 'bg-white', extra)

export default function EveryPlan() {
  return (
    <Band tone="mist" pad="md" id="compare" className="scroll-mt-28">
      <Container wide>
        <SectionIntro eyebrow={everyPlan.eyebrow} index="02" title={everyPlan.title} accent={everyPlan.accent} />

        <div
          role="region"
          aria-label="Plan comparison. Scrolls sideways on small screens."
          tabIndex={0}
          className="relative mt-12 overflow-x-auto border border-rule bg-white outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink md:overflow-visible"
        >
          <table className="w-full min-w-[39rem] table-fixed border-separate border-spacing-0 text-left md:min-w-0">
            <caption className="sr-only">
              Plan comparison. A tick means the plan includes the line; a dash means it does not list it. Each plan includes everything in the plan before it.
            </caption>
            <colgroup>
              <col className="w-44 md:w-[34%]" />
              {plans.map((p) => (
                <col key={p.key} className="w-28 md:w-auto" />
              ))}
            </colgroup>

            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-30 border-b border-rule bg-white px-5 pb-5 pt-6 align-bottom font-sans text-mark font-medium uppercase text-ink-3 md:top-[5.25rem] md:px-6"
                >
                  Features
                </th>
                {plans.map((p) => (
                  <th
                    key={p.key}
                    scope="col"
                    className={cx(col(p, 'sticky top-0 z-20 border-b border-rule px-2 pb-5 font-normal md:top-[5.25rem] md:px-3'), p.feature ? 'border-t-2 border-t-ink pt-[1.375rem]' : 'pt-6')}
                  >
                    <span className="block font-sans text-mark font-medium uppercase text-ink">{p.name}</span>
                    <span className="mt-2.5 block font-display text-[1.5rem] font-light leading-none tracking-[-0.03em] text-ink lg:text-[1.75rem]">{p.price}</span>
                    <span className="mt-1.5 block font-sans text-[0.8125rem] text-ink-3">{p.per}</span>
                  </th>
                ))}
              </tr>
            </thead>

            {comparison.map((g) => (
              <tbody key={g.name}>
                <tr>
                  <th
                    scope="rowgroup"
                    className="sticky left-0 z-10 border-b border-rule bg-mist px-5 pb-2.5 pt-6 text-left font-sans text-mark font-medium uppercase text-ink-3 md:px-6"
                  >
                    {g.name}
                  </th>
                  {plans.map((p) => (
                    <td key={p.key} aria-hidden="true" className="border-b border-rule bg-mist" />
                  ))}
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label} className="group/row">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-rule bg-white px-5 py-3.5 text-left align-middle font-normal transition-colors duration-200 group-hover/row:bg-mist md:px-6"
                    >
                      <span className={cx('block font-sans text-ui text-ink', r.copy ? 'font-medium' : '')}>{r.label}</span>
                      {r.copy ? <span className="mt-1 block max-w-[44ch] font-sans text-[0.8125rem] leading-snug text-ink-2">{r.copy}</span> : null}
                    </th>
                    {plans.map((p, c) => (
                      <td key={p.key} className={col(p, 'border-b border-rule px-2 py-3.5 transition-colors duration-200 group-hover/row:bg-mist md:px-3')}>
                        <span className="flex h-[1.125rem] items-center justify-center">
                          <Mark has={r.has[c]} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <p className="mt-6 max-w-[72ch] font-sans text-ui text-ink-3">{comparisonNote}</p>
      </Container>
    </Band>
  )
}
