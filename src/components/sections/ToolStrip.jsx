import { tools } from '../../content/home'

/* One logo strip, one framing. The live site shows the same names twice, the
 * second time under "Our Trusted Partners" -- these are tools the studio works
 * with, not partnerships, so that second row is gone.
 *
 * A marquee rather than a static grid: it reads as a passing list of tools
 * rather than a wall of endorsements.
 *
 * No slab behind it, by request -- it sits straight on the cream page. */
export default function ToolStrip() {
  const run = [...tools, ...tools]

  return (
    <section className="pb-12 md:pb-14">
      <p className="text-center font-sans text-mark uppercase tracking-[0.16em] text-ink-3">
        Tools &amp; platforms we work with
      </p>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="akx-marquee flex w-max items-center gap-16 pr-16">
          {run.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="whitespace-nowrap font-serif text-2xl text-ink-3 transition-colors duration-300 hover:text-clay"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
