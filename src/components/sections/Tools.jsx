import { Band } from '../ui/Band'
import { Container } from '../primitives'
import { SectionIntro } from './SectionHead'
import { Reveal } from '../motion/Reveal'
import { tools } from '../../content/home'

/* "Technologies & Platforms We Work With" (Step 7.6: a grid, not a ticker).
 *
 * It was a marquee of the nine names at up to 5rem, drifting and speeding up with
 * the scroll. Names that large were cropped at both edges and uneven in width, and
 * a strip that moves is a poor way to read a list. It is a ruled grid now: nine
 * equal cells, one name each, in the page's own type at a size that suits the cell,
 * in dark grey that goes to ink on hover. The tenth cell, at the end of the second row
 * from `lg`, carries the sentence that matters: these are tools the studio uses, not
 * partners, and nothing here is an endorsement. (Below `lg` that sentence sits under
 * the grid instead.)
 *
 * The names are set as type, not as logos, on purpose. The project holds no vendor
 * logo assets, drawn look-alikes would be worse than none, and a logo row is exactly
 * what reads as a partnership. If properly licensed marks are supplied later, they
 * belong in these cells. The list is `tools` in `content/home.js`, unchanged.
 *
 * Nothing moves, so there is nothing to pause, clip or overflow; the one entrance is
 * the block rising once (`Reveal`, which is also still under reduced motion). */
const NOTE = 'Tools we use in our work. Named here for that reason only: not a partnership, and not an endorsement.'

export default function Tools() {
  return (
    <Band tone="light" pad="md" className="border-y border-rule">
      <Container wide>
        <SectionIntro eyebrow="Our toolkit" index="04" title="Technologies & Platforms" accent="We Work With" titleClass="text-h2" />

        <Reveal>
          <ul className="mt-12 grid grid-cols-2 border-l border-t border-rule bg-white sm:grid-cols-3 lg:grid-cols-5">
            {tools.map((t, i) => (
              <li
                key={t}
                className={`group flex min-h-24 items-center border-b border-r border-rule px-6 md:min-h-28 md:px-8 ${i === tools.length - 1 && tools.length % 2 === 1 ? 'max-sm:col-span-2' : ''}`}
              >
                <span className="relative font-display text-[1.375rem] font-light leading-none tracking-[-0.03em] text-ink-2 transition-colors duration-300 group-hover:text-ink md:text-[1.75rem]">
                  {t}
                  <span aria-hidden="true" className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </span>
              </li>
            ))}
            <li className="hidden items-center border-b border-r border-rule bg-mist px-6 py-4 font-sans text-ui text-ink-2 lg:flex md:px-8">{NOTE}</li>
          </ul>
        </Reveal>
        <p className="mt-6 font-sans text-ui text-ink-3 lg:hidden">{NOTE}</p>
      </Container>
    </Band>
  )
}
