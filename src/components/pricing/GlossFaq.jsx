import { useEffect, useRef, useState } from 'react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { Headline } from '../sections/SectionHead'
import { RollText } from '../ui/RollText'
import { Reveal } from '../motion/Reveal'
import { GlossButton } from './GlossButton'
import { useScrollToId } from '../../lib/useScrollToId'
import { cx } from '../../lib/cx'

/* The questions, as an index beside long answers (Step 7.2).
 *
 * Still set out in the open, not behind a click: with no clients and nothing
 * shipped, a plain answer to a hard question is the only proof there is. What
 * changed is how they are read. The six used to be six equal cards in two
 * columns; now the questions are an index down the left, held in place while the
 * answers scroll past on the right, and the one being read is marked in red --
 * the same device as the sheets on /about and the rail on /solutions. Each answer
 * opens with its verdict in a line, so a reader who only wants "can I get a
 * refund?" has the answer before the paragraph. Clicking an index row glides to
 * its answer.
 *
 * `items` is `[{ q, tag, verdict, a: [paragraph] }]`. Below 1024px there is no
 * room for a side index, so the answers run on their own and the "not on the
 * list" card comes after them. */
const DELAY = ['delay-[0ms]', 'delay-[80ms]', 'delay-[0ms]', 'delay-[80ms]', 'delay-[0ms]', 'delay-[80ms]']

function Ask({ className }) {
  return (
    <div className={cx('gloss rounded-[1.75rem] p-7', className)}>
      <p className="font-display text-[1.375rem] leading-snug tracking-[-0.015em] text-ink">Not on the list?</p>
      <p className="mt-2 font-sans text-ui text-ink-2">Ask it in your own words. A person answers, within a day.</p>
      <GlossButton to="/contact" variant="dark" className="mt-6">
        Ask us
      </GlossButton>
    </div>
  )
}

export default function GlossFaq({ eyebrow, title, accent, items, index = '04' }) {
  const scrollTo = useScrollToId()
  const [active, setActive] = useState(0)
  const cards = useRef([])

  /* The answer crossing the middle of the screen is the one being read. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i))
        })
      },
      { rootMargin: '-38% 0px -57% 0px' },
    )
    cards.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [items.length])

  return (
    <Band tone="mist" pad="md">
      <Container wide>
        <div className="max-w-[40rem]">
          <Label index={index}>{eyebrow}</Label>
          <Headline title={title} accent={accent} size="text-h1" className="mt-6" />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <nav aria-label="Pricing questions">
                <ol className="border-t border-ink/12">
                  {items.map((it, i) => {
                    const on = active === i
                    return (
                      <li key={it.q} className="relative border-b border-ink/12">
                        <span
                          aria-hidden="true"
                          className={cx('absolute -left-4 inset-y-3 w-[3px] origin-top bg-brand transition-transform duration-500', on ? 'scale-y-100' : 'scale-y-0')}
                        />
                        <a
                          href={`#faq-${i}`}
                          onClick={(e) => scrollTo(e, `faq-${i}`)}
                          aria-current={on ? 'true' : undefined}
                          className={cx(
                            'group/roll flex items-baseline gap-4 py-4 pr-2 transition-colors duration-300',
                            on ? 'text-ink' : 'text-ink-3 hover:text-ink',
                          )}
                        >
                          <span className="tnum font-sans text-mark">{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-display text-[1.375rem] leading-tight tracking-[-0.015em]">
                            <RollText>{it.tag}</RollText>
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </nav>
              <Ask className="mt-10" />
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ul className="grid gap-5">
              {items.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.q}
                  id={`faq-${i}`}
                  data-i={i}
                  innerRef={(el) => {
                    cards.current[i] = el
                  }}
                  delay={DELAY[i]}
                  className="gloss scroll-mt-28 rounded-[2rem] p-8 md:p-11"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2.5 font-sans text-mark font-medium uppercase text-ink-2">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                      {item.tag}
                    </span>
                    <span className="tnum font-sans text-mark text-ink-3">
                      {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-h3 text-ink">{item.q}</h3>
                  <p className="mt-5 border-l-[3px] border-ink pl-4 font-display text-[1.375rem] leading-snug tracking-[-0.015em] text-ink md:text-[1.5rem]">
                    {item.verdict}
                  </p>
                  <div className="mt-5 space-y-3">
                    {item.a.map((p) => (
                      <p key={p} className="max-w-[62ch] font-sans text-ui leading-relaxed text-ink-2">
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </ul>
            <Ask className="mt-8 lg:hidden" />
          </div>
        </div>
      </Container>
    </Band>
  )
}
