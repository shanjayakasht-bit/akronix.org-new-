import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RollText } from '../ui/RollText'
import { site } from '../../content/site'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* Booking, as three steps and a result: pick a date, pick a time, leave an
 * email. One thing on screen at a time -- the date step shows dates and
 * nothing else, and the time slots do not exist until a date is behind them.
 *
 * There is still no calendar integration behind this, so it does NOT claim to
 * know what is free. No slot is shown as available and none as taken. The
 * visitor proposes a time and Akronix confirms.
 *
 * WHERE THE REQUEST ACTUALLY GOES -- read before changing the wording.
 * `site.bookingEndpoint` is null. With an endpoint set, `send` POSTs the
 * booking to it and the closing screen says the meeting is scheduled. With no
 * endpoint there is nothing on the other end to schedule anything, so it falls
 * back to handing the filled-in request to the visitor's own mail client, and
 * the closing screen says only what is true of that: the request is on its
 * way. Do not show the scheduled wording on the fallback path. Telling a
 * visitor a meeting is booked when nothing received it is the exact class of
 * fiction this rebuild exists to remove.
 *
 * The Meet link is the same story: `site.meetLink` is null, so whatever is
 * wired up here has to be what issues one.
 */
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const EASE = [0.16, 1, 0.3, 1]
const STEPS = ['Date', 'Time', 'Details']
const TITLES = ['Select date', 'Select time', 'Your details']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

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

const dayLabel = (d) => (d ? `${DAY[d.getDay()]} - ${d.getDate()} ${MONTH[d.getMonth()]}` : '')

/* The rail. The filled line is one element scaled along X, so the travel
   between steps is continuous rather than three separate segments lighting up
   in turn. */
function Rail({ step, reduced }) {
  return (
    <div className="relative flex items-center justify-between gap-2 px-1">
      <div aria-hidden="true" className="absolute inset-x-6 top-3.75 h-px bg-rule" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-6 top-3.75 h-px origin-left bg-clay"
        initial={false}
        animate={{ scaleX: step / (STEPS.length - 1) }}
        transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
      />

      {STEPS.map((label, i) => {
        const reached = i <= step
        return (
          <span key={label} className="relative flex flex-col items-center gap-2">
            <motion.span
              initial={false}
              animate={{ scale: i === step && !reduced ? 1.12 : 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              className={cx(
                'inline-flex h-7.5 w-7.5 items-center justify-center rounded-full font-sans text-[0.6875rem] ring-1 transition-colors duration-500',
                reached ? 'bg-clay text-paper ring-clay' : 'bg-panel text-ink-3 ring-rule',
              )}
            >
              {i + 1}
            </motion.span>
            <span
              className={cx(
                'font-sans text-mark uppercase transition-colors duration-500',
                reached ? 'text-ink' : 'text-ink-3',
              )}
            >
              {label}
            </span>
          </span>
        )
      })}
    </div>
  )
}

function Panel({ id, title, reduced, children }) {
  return (
    <motion.div
      key={id}
      initial={reduced ? false : { opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: -18 }}
      transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
    >
      <p className="font-serif text-lede tracking-tight text-ink">{title}</p>
      <div className="mt-5">{children}</div>
    </motion.div>
  )
}

export default function Booking() {
  const reduced = usePrefersReducedMotion()
  const days = useMemo(() => workingDays(12), [])

  const [step, setStep] = useState(0)
  const [day, setDay] = useState(null)
  const [slot, setSlot] = useState(null)
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('idle')
  const [route, setRoute] = useState(null)

  const label = dayLabel(day)
  const validEmail = EMAIL.test(email.trim())
  const canAdvance = [Boolean(day), Boolean(slot), validEmail][step]

  const mailHref = () => {
    const subject = `Meeting request — ${label}, ${slot} IST`
    const body = [
      'Hello,',
      '',
      `I would like to book a call on ${label} at ${slot} IST.`,
      `You can reach me at ${email.trim()}.`,
      '',
      'What I need help with:',
      '',
    ].join('\n')
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function send() {
    if (!canAdvance || status === 'sending') return
    setStatus('sending')

    if (!site.bookingEndpoint) {
      /* Nothing to POST to. Hand it to the visitor's mail client, which does
         genuinely deliver it, and say only that. */
      window.location.href = mailHref()
      setRoute('mail')
      setStatus('done')
      return
    }

    try {
      const res = await fetch(site.bookingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: label,
          iso: day.toISOString().slice(0, 10),
          time: slot,
          timezone: 'IST',
          email: email.trim(),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setRoute('endpoint')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  /* Dates and times are the same kind of choice, so they are the same object:
     one pill style, used by both grids.

     The tile has to hold a whole date on one line, and the widest the label
     can ever be is "Wed - 28 May" -- 83px at 13px, measured. Three columns of
     the widened card are 94px each, so 13px clears it; at `text-ui` it did
     not, which is why every date wrapped to two lines on a phone. The padding
     is nearly nothing below `sm` for the same reason: the label is centred, so
     the padding buys no space it can be seen in, and it is the wrap that
     matters. */
  const pill =
    'rounded-full border px-0.5 py-3 text-center font-sans text-[0.8125rem] transition-all duration-300 sm:px-2 sm:text-ui'
  const chosen = 'border-clay bg-clay text-paper'
  const unchosen = 'border-rule text-ink-2 hover:border-clay hover:text-clay'

  if (status === 'done') {
    return (
      <div className="overflow-hidden rounded-[1.75rem] bg-panel ring-1 ring-rule">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="px-5 py-12 text-center sm:px-7 md:px-9"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clay text-xl text-paper">
            &#10003;
          </span>
          <h3 className="mt-6 font-serif text-h3 tracking-tight text-ink">
            {route === 'endpoint'
              ? 'Your meeting is scheduled with us successfully!'
              : 'Your request is on its way.'}
          </h3>
          <p className="mx-auto mt-3 max-w-[42ch] font-sans text-body leading-relaxed text-ink-2">
            {route === 'endpoint'
              ? `A Google Meet link is on its way to ${email.trim()} for ${label} at ${slot} IST.`
              : `We have opened the request in your mail client for ${label} at ${slot} IST. Send it and we will reply to ${email.trim()} with a Google Meet link.`}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-panel ring-1 ring-rule">
      {/* What the panel is for, said once at the top. Without it the rail and
          the date grid are a control with no stated purpose. The second line
          is the honest part and stays: there is no calendar integration
          behind this, so a chosen slot is a request, not a confirmation. */}
      <div className="border-b border-rule px-5 pb-6 pt-7 sm:px-7 md:px-9">
        <h3 className="font-serif text-h3 tracking-tight text-ink">Schedule a meeting</h3>
        <p className="mt-2 max-w-[46ch] font-sans text-ui leading-relaxed text-ink-2">
          Pick a date and a time slot and we will set up a call. Nothing is
          confirmed until we reply.
        </p>
        <div className="mt-7">
          <Rail step={step} reduced={reduced} />
        </div>
      </div>

      {/* Fixed floor on the step area. Without it the card grew for the date
          grid and shrank again for the times, so the whole panel jumped size
          on every step.

          The floor is on the border box, so it has to clear the tallest step's
          content PLUS this padding -- 13.5rem looked like enough and was not,
          because 4rem of it was padding. It also has to be set per breakpoint:
          the date grid is three columns narrow and four wide, so which step is
          tallest changes with the column count. Only the rare submit-failed
          line can push past it. */}
      <div className="min-h-80 px-5 py-7 sm:min-h-70 sm:px-7 md:px-9 md:py-8">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <Panel id="date" title={TITLES[0]} reduced={reduced}>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {days.map((d) => {
                  const active = day && d.toDateString() === day.toDateString()
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setDay(d)}
                      aria-pressed={Boolean(active)}
                      className={cx(pill, active ? chosen : unchosen)}
                    >
                      {dayLabel(d)}
                    </button>
                  )
                })}
              </div>
            </Panel>
          ) : null}

          {step === 1 ? (
            <Panel id="time" title={TITLES[1]} reduced={reduced}>
              <p className="font-sans text-mark uppercase text-ink-3">{label} · IST</p>
              <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2">
                {SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSlot(t)}
                    aria-pressed={slot === t}
                    className={cx(pill, slot === t ? chosen : unchosen)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Panel>
          ) : null}

          {step === 2 ? (
            <Panel id="details" title={TITLES[2]} reduced={reduced}>
              <p className="font-sans text-mark uppercase text-ink-3">
                {label} · {slot} IST
              </p>
              <label htmlFor="booking-email" className="mt-5 block font-sans text-ui text-ink">
                Your email
              </label>
              <input
                id="booking-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@company.com"
                className="mt-2.5 w-full rounded-2xl border border-rule bg-paper px-4 py-3.5 font-sans text-ui text-ink outline-none transition-colors duration-300 placeholder:text-ink-3 focus:border-clay"
              />
              <p
                className={cx(
                  'mt-2.5 font-sans text-ui',
                  touched && !validEmail ? 'text-clay' : 'text-ink-3',
                )}
              >
                {touched && !validEmail
                  ? 'That does not look like an email address yet.'
                  : 'We send the Google Meet link here.'}
              </p>
              {status === 'error' ? (
                <p className="mt-3 font-sans text-ui text-clay">
                  That did not go through. Try again, or email {site.email} directly.
                </p>
              ) : null}
            </Panel>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-rule px-5 py-6 sm:px-7 md:px-9">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((v) => v - 1)}
            className="group/roll group inline-flex items-center gap-2 rounded-full border border-ink px-6 py-2 font-sans text-ui text-ink transition-colors duration-300 hover:border-clay hover:text-clay"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
              &larr;
            </span>
            <RollText>Back</RollText>
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => (step === STEPS.length - 1 ? send() : setStep((v) => v + 1))}
          disabled={!canAdvance || status === 'sending'}
          className={cx(
            'group/roll group inline-flex items-center gap-2 rounded-full px-6 py-2 font-sans text-ui transition-all duration-300',
            canAdvance && status !== 'sending'
              ? 'bg-ink text-paper hover:bg-clay'
              : 'cursor-not-allowed bg-ink/[0.07] text-ink-3',
          )}
        >
          <RollText>
            {step === STEPS.length - 1 ? (status === 'sending' ? 'Sending' : 'Submit') : 'Next'}
          </RollText>
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </button>
      </div>
    </div>
  )
}
