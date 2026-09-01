import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../../content/site'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* Slot picker.
 *
 * There is no calendar integration behind this, so it does NOT claim to know
 * what is free. No slot is shown as available and none as taken. The visitor
 * proposes a time and Akronix confirms by email -- a promise that can be kept
 * with no backend. If a real calendar is connected later (Cal.com, Calendly),
 * replace this component rather than bolting fake availability onto it.
 */
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const EASE = [0.16, 1, 0.3, 1]

function workingDays(count) {
  const out = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (out.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) out.push(new Date(d))
  }
  return out
}

function Step({ n, label, done }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cx(
          'inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-[0.625rem] transition-colors duration-500',
          done ? 'bg-clay text-paper' : 'bg-ink/[0.07] text-ink-3',
        )}
      >
        {n}
      </span>
      <span
        className={cx(
          'font-mono text-mark uppercase transition-colors duration-500',
          done ? 'text-ink' : 'text-ink-3',
        )}
      >
        {label}
      </span>
    </span>
  )
}

export default function Booking() {
  const reduced = usePrefersReducedMotion()
  const days = useMemo(() => workingDays(12), [])
  const [day, setDay] = useState(() => days[0])
  const [slot, setSlot] = useState(null)
  const [copied, setCopied] = useState(false)

  const chosen = Boolean(day && slot)
  const label = day ? `${DAY[day.getDay()]} ${day.getDate()} ${MONTH[day.getMonth()]}` : ''

  const subject = `Meeting request — ${label}, ${slot} IST`
  const body = [
    'Hello,',
    '',
    `I would like to book a call on ${label} at ${slot} IST.`,
    '',
    'What I need help with:',
    '',
    '',
    'Name:',
    'Company:',
    'Phone:',
  ].join('\n')

  const href = chosen
    ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : undefined

  async function copyMeet() {
    if (!site.meetLink) return
    try {
      await navigator.clipboard.writeText(site.meetLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-panel ring-1 ring-rule">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-rule px-7 py-5 md:px-9">
        <Step n="1" label="Day" done />
        <Step n="2" label="Time" done={Boolean(slot)} />
        <Step n="3" label="Confirm" done={chosen} />
      </div>

      <div className="px-7 py-7 md:px-9 md:py-8">
        <h3 className="font-serif text-h3 tracking-tight text-ink">Pick a time that suits you.</h3>
        <p className="mt-2.5 font-sans text-body leading-relaxed text-ink-2">
          Mon–Sat, 9AM–7PM IST. Choosing a time sends us a request — nothing is
          confirmed until we reply.
        </p>

        <p className="mt-8 font-mono text-mark uppercase text-ink-3">Day</p>
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
          {days.map((d) => {
            const active = day && d.toDateString() === day.toDateString()
            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => {
                  setDay(d)
                  setSlot(null)
                }}
                aria-pressed={active}
                className={cx(
                  'shrink-0 rounded-2xl border px-4 py-3 text-center transition-all duration-300',
                  active
                    ? 'border-clay bg-clay text-paper'
                    : 'border-rule text-ink-2 hover:border-clay hover:text-clay',
                )}
              >
                <span className="block font-mono text-[0.625rem] uppercase opacity-70">
                  {DAY[d.getDay()]}
                </span>
                <span className="mt-1 block font-sans text-ui">
                  {d.getDate()} {MONTH[d.getMonth()]}
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-8 font-mono text-mark uppercase text-ink-3">Time — IST</p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {SLOTS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSlot(t)}
              aria-pressed={slot === t}
              className={cx(
                'rounded-full border px-2 py-3 font-sans text-ui transition-all duration-300',
                slot === t
                  ? 'border-clay bg-clay text-paper'
                  : 'border-rule text-ink-2 hover:border-clay hover:text-clay',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {chosen ? (
            <motion.div
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-8 rounded-2xl bg-mist p-6">
                <p className="font-mono text-mark uppercase text-ink-3">Your slot</p>
                <p className="mt-2 font-serif text-h3 tracking-tight text-ink">
                  {label} · {slot} IST
                </p>

                <div className="mt-5 border-t border-rule pt-5">
                  <p className="font-mono text-mark uppercase text-ink-3">Google Meet</p>
                  {site.meetLink ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <code className="min-w-0 flex-1 truncate rounded-xl bg-panel px-4 py-3 font-mono text-[0.8125rem] text-ink-2 ring-1 ring-rule">
                        {site.meetLink}
                      </code>
                      <button
                        type="button"
                        onClick={copyMeet}
                        className="shrink-0 rounded-full border border-ink px-5 py-2.5 font-sans text-ui text-ink transition-colors duration-300 hover:border-clay hover:bg-clay hover:text-paper"
                      >
                        {copied ? 'Copied' : 'Copy link'}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 font-sans text-body leading-relaxed text-ink-2">
                      A Google Meet link arrives with your confirmation email.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule px-7 py-6 md:px-9">
        <p className="font-mono text-mark uppercase text-ink-3">
          {chosen ? 'Ready to send' : 'Choose a day and a time'}
        </p>
        <a
          href={href}
          aria-disabled={!chosen}
          onClick={(e) => {
            if (!chosen) e.preventDefault()
          }}
          className={cx(
            'group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-sans text-ui transition-all duration-300',
            chosen ? 'bg-ink text-paper hover:bg-clay' : 'cursor-not-allowed bg-ink/[0.07] text-ink-3',
          )}
        >
          Request this time
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </div>
  )
}
