import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { RollText } from '../ui/RollText'
import { Arrow } from '../ui/Arrow'
import { Headline } from '../sections/SectionHead'
import { useScrollToId } from '../../lib/useScrollToId'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { site } from '../../content/site'
import { documents, updated } from '../../content/policies'

const EASE = [0.16, 1, 0.3, 1]
const LINK = 'text-ink underline decoration-brand decoration-2 underline-offset-4 transition-colors duration-300 hover:text-brand'
const IDS = documents.map((d) => d.id)
const two = (n) => String(n).padStart(2, '0')

/* The panel's motion: the sheet fades in, then its parts rise one after another
 * and each clause's rule draws itself across from the left, as if the document
 * were being typeset. Swapping to another document runs the exit first (a short
 * lift and fade), then the new one begins. */
const sheet = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.2, ease: 'easeIn' } },
}
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}
const draw = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: EASE } },
}

/* Plain strings, the site's email, the site's phone numbers. */
function Rich({ parts }) {
  return parts.map((p, i) => {
    if (typeof p === 'string') return <Fragment key={i}>{p}</Fragment>
    if (p.mail)
      return (
        <a key={i} href={`mailto:${site.email}`} className={LINK}>
          {site.email}
        </a>
      )
    if (p.phones)
      return site.phones.map((ph, j) => (
        <Fragment key={`${i}-${j}`}>
          {j ? ' or ' : ''}
          <a href={ph.href} className={LINK}>
            {ph.display}
          </a>
        </Fragment>
      ))
    return null
  })
}

function Step({ dir, doc, onClick }) {
  const prev = dir === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/roll group inline-flex items-center gap-4 border border-ink px-5 py-3.5 text-left font-sans text-ui font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
    >
      {prev ? <Arrow className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" /> : null}
      <span>
        <span className="block font-sans text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-ink-3 transition-colors duration-300 group-hover:text-white/60">
          {prev ? 'Previous' : 'Next'}
        </span>
        <RollText>{doc.label}</RollText>
      </span>
      {!prev ? <Arrow className="transition-transform duration-300 group-hover:translate-x-1" /> : null}
    </button>
  )
}

function Panel({ doc, index, reduced, seen, select }) {
  const R = (v) => (reduced ? undefined : v)
  const prev = documents[index - 1]
  const next = documents[index + 1]

  return (
    <motion.article
      key={doc.id}
      id={`panel-${doc.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${doc.id}`}
      className="min-h-[34rem] border border-rule bg-mist p-7 sm:p-10 md:p-14"
      variants={R(sheet)}
      initial={reduced ? false : 'hidden'}
      animate={reduced ? undefined : seen ? 'show' : 'hidden'}
      exit={reduced ? undefined : 'exit'}
    >
      <motion.p
        variants={R(rise)}
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-sans text-mark font-medium uppercase text-ink-3"
      >
        <span className="inline-flex items-center gap-3 text-ink-2">
          <span aria-hidden="true" className="h-[0.95em] w-[3px] bg-brand" />
          Document <span className="tnum">{two(index + 1)}</span> of <span className="tnum">{two(documents.length)}</span>
        </span>
        <span>Last updated {updated}</span>
      </motion.p>

      <Headline title={doc.title} accent={doc.accent} size="text-h2" className="mt-8 max-w-[20ch]" />

      <div className="mt-8 max-w-[58ch] space-y-5">
        {doc.intro.map((p) => (
          <motion.p key={p} variants={R(rise)} className="font-sans text-lede text-ink-2">
            {p}
          </motion.p>
        ))}
      </div>

      {doc.status ? (
        <motion.p variants={R(rise)} className="mt-9 flex max-w-[62ch] flex-col gap-2 border-l-[3px] border-brand bg-white p-5 font-sans text-ui text-ink-2 sm:flex-row sm:gap-5">
          <span className="shrink-0 font-sans text-mark font-medium uppercase text-ink">Status</span>
          <span>{doc.status}</span>
        </motion.p>
      ) : null}

      {doc.clausesTitle ? (
        <motion.p variants={R(rise)} className="mt-14 font-sans text-mark font-medium uppercase text-ink-3">
          {doc.clausesTitle}
        </motion.p>
      ) : null}

      <ol className={cx(doc.clausesTitle ? 'mt-5' : 'mt-12')}>
        {doc.clauses.map((c, i) => (
          <motion.li key={c.name} variants={R(rise)} className="group relative grid gap-x-8 gap-y-3 py-8 md:grid-cols-12 md:py-9">
            <motion.span aria-hidden="true" variants={R(draw)} className="absolute inset-x-0 top-0 h-px origin-left bg-ink/25" />
            <span aria-hidden="true" className="absolute inset-y-6 left-0 w-[3px] origin-top scale-y-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 md:inset-y-7" />
            <div className="flex items-baseline gap-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:col-span-4">
              <span className="tnum w-6 shrink-0 font-sans text-mark text-ink-3 transition-colors duration-300 group-hover:text-brand">{two(i + 1)}</span>
              <h3 className="font-display text-h3 text-ink">{c.name}</h3>
            </div>
            <div className="space-y-4 md:col-span-8">
              {c.body.map((p) => (
                <p key={p} className="font-sans text-body text-ink-2">
                  {p}
                </p>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>

      <motion.div variants={R(rise)} className="border-t border-ink/25 pt-8">
        <p className="max-w-[62ch] font-sans text-body text-ink-2">
          <Rich parts={doc.closing} />
        </p>
      </motion.div>

      {prev || next ? (
        <motion.div variants={R(rise)} className="mt-10 flex flex-wrap gap-3">
          {prev ? <Step dir="prev" doc={prev} onClick={() => select(prev.id)} /> : null}
          {next ? <Step dir="next" doc={next} onClick={() => select(next.id)} /> : null}
        </motion.div>
      ) : null}
    </motion.article>
  )
}

/* The four documents (Step 7).
 *
 * The live page lists them in a sidebar and swaps the right-hand panel when one is
 * chosen. That behaviour is kept, and the way it is dressed is not: the sidebar is
 * a numbered index with a red bar that slides to whichever is open (a shared
 * layout element), the panel is a sheet of paper set in clauses, and nothing is a
 * glowing dark card. On a phone the index is a two-by-two grid above the sheet.
 *
 * It is a proper tab set -- tablist, tabs, tabpanel, arrow keys, Home and End --
 * and the open document is in the URL (`/policies#referral`), so the footer's
 * "Privacy Policy" and "Terms & Conditions" can land on the right one and a
 * document can be linked to. The block holding the index and the sheet carries the
 * open document's id (`referral`, `execution`...), which is what lets the site's
 * hash-scroll bring the whole block -- index included, which on a phone sits above
 * the sheet -- to the top of the screen on arrival. Choosing a tab writes the hash
 * with `replaceState`, not a navigation, so it does not scroll the page back to
 * the top or fill the back button. If the reader is already below the top of the
 * block when they choose, it is brought back into view. */
export default function PolicyDocs() {
  const reduced = usePrefersReducedMotion()
  const scrollTo = useScrollToId()
  const { hash, key } = useLocation()
  const fromHash = (h) => {
    try {
      const id = decodeURIComponent((h || '').slice(1))
      return IDS.includes(id) ? id : null
    } catch {
      return null
    }
  }
  const [active, setActive] = useState(() => fromHash(hash) ?? IDS[0])
  const tabs = useRef([])
  const wrap = useRef(null)
  const seen = useInView(wrap, { once: true, margin: '0px 0px -12% 0px' })

  /* A link that arrives with a hash -- from the footer, or the same one pressed
     twice (a new `key`, an unchanged hash) -- opens that document. */
  useEffect(() => {
    const id = fromHash(hash)
    if (id) setActive(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, key])

  const select = (id, focus = false) => {
    setActive(id)
    try {
      window.history.replaceState(window.history.state, '', `#${id}`)
    } catch {
      /* a sandboxed frame: the tab still changes */
    }
    if (focus) tabs.current[IDS.indexOf(id)]?.focus()
    const box = wrap.current
    if (box && box.getBoundingClientRect().top < 0) scrollTo(null, box.id)
  }

  const onKey = (e) => {
    const i = IDS.indexOf(active)
    const to = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: IDS.length - 1 }[e.key]
    if (to === undefined) return
    e.preventDefault()
    select(IDS[(to + IDS.length) % IDS.length], true)
  }

  const index = IDS.indexOf(active)
  const doc = documents[index]

  return (
    <Band tone="light" pad="md">
      <Container wide>
        <div id={active} ref={wrap} className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:col-span-4">
            <div role="tablist" aria-label="Policy documents" className="grid grid-cols-2 gap-2 lg:block">
              {documents.map((d, i) => {
                const on = d.id === active
                return (
                  <button
                    key={d.id}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${d.id}`}
                    aria-selected={on}
                    aria-controls={`panel-${d.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(d.id)}
                    onKeyDown={onKey}
                    className={cx(
                      'group/roll group relative flex w-full items-baseline gap-3 border px-4 py-3.5 text-left transition-[padding,background-color,border-color] duration-500 lg:gap-5 lg:border-0 lg:border-t lg:border-ink/15 lg:px-0 lg:py-6 lg:last:border-b',
                      on ? 'border-ink bg-mist lg:bg-transparent lg:pl-6' : 'border-ink/15 bg-white lg:bg-transparent lg:hover:pl-6',
                    )}
                  >
                    {on ? (
                      <motion.span
                        layoutId="policy-bar"
                        aria-hidden="true"
                        transition={{ duration: 0.6, ease: EASE }}
                        className="absolute inset-x-0 bottom-0 h-[3px] bg-brand lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[3px]"
                      />
                    ) : null}
                    <span className={cx('tnum font-sans text-mark transition-colors duration-300', on ? 'text-brand' : 'text-ink-3')}>{two(i + 1)}</span>
                    <span className="block">
                      <span className={cx('block font-display text-ui leading-snug transition-colors duration-300 lg:text-[1.5rem] lg:tracking-[-0.02em]', on ? 'text-ink' : 'text-ink-2 group-hover:text-ink')}>
                        <RollText>{d.label}</RollText>
                      </span>
                      <span className="mt-1 hidden font-sans text-ui text-ink-3 lg:block">{d.summary}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-8 hidden font-sans text-ui text-ink-3 lg:block">
              Last updated {updated}.<br />
              Questions:{' '}
              <a href={`mailto:${site.email}`} className={LINK}>
                {site.email}
              </a>
            </p>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <Panel key={doc.id} doc={doc} index={index} reduced={reduced} seen={seen} select={(id) => select(id)} />
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Band>
  )
}
