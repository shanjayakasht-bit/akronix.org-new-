import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { SectionIntro } from '../sections/SectionHead'
import { site } from '../../content/site'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/* Where the studio is, and whether it is open (Step 7).
 *
 * Two cards side by side. The left is a radar over Chennai: three rings, a sweep
 * that turns once every nine seconds, a pin at the centre that sends out a ring
 * now and then, and the city's coordinates. The right is the studio's clock --
 * Indian Standard Time whatever the visitor's own zone is -- with the seconds
 * running, an "Open now" or "Closed" line worked out from the published hours
 * (Monday to Saturday, 9 AM to 7 PM IST), and the week as seven cells with today
 * lit and Sunday marked closed.
 *
 * Everything on it is true and checkable: where the studio is, its hours, and
 * what time it is there. It is this page's answer to "demonstrate, don't
 * describe" when there are no numbers to show -- a live fact in place of a
 * claim. There are no dots on the radar standing for anything: a blip would be a
 * made-up client. The pointer pinging it (with sound on) is the only response. */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function ist(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value ?? ''
  const hh = Number(get('hour')) % 24
  const mm = Number(get('minute'))
  const ss = Number(get('second'))
  const wd = get('weekday').slice(0, 3)
  return { hh, mm, ss, wd, open: wd !== 'Sun' && hh >= 9 && hh < 19 }
}

function useIst() {
  const [now, setNow] = useState(() => ist())
  useEffect(() => {
    const id = setInterval(() => setNow(ist()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const two = (n) => String(n).padStart(2, '0')

function Radar({ reduced }) {
  return (
    <motion.div
      data-sound="ping"
      className="relative isolate flex min-h-[30rem] items-center justify-center overflow-hidden bg-coal text-white lg:col-span-7"
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div aria-hidden="true" className="relative aspect-square w-[88%] max-w-[26rem]">
        {/* the rings */}
        <span className="absolute inset-0 rounded-full border border-white/20" />
        <span className="absolute inset-[17%] rounded-full border border-white/15" />
        <span className="absolute inset-[34%] rounded-full border border-white/15" />
        {/* the cross-hairs */}
        <span className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        {/* the sweep */}
        <span className="akx-radar absolute inset-0 rounded-full" />
        {/* the pin, and the ring it sends out */}
        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-soft" />
        {!reduced ? <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-brand-soft/60" /> : null}
      </div>

      <p className="absolute left-6 top-6 font-sans text-mark font-medium uppercase text-white/60">Studio</p>
      <p aria-hidden="true" className="absolute right-6 top-6 font-sans text-mark font-medium uppercase text-white/40">N</p>
      <div className="absolute bottom-6 left-6">
        <p className="font-display text-h3 text-white">Chennai</p>
        <p className="tnum mt-1 font-sans text-ui text-white/60">13.08&deg; N &middot; 80.27&deg; E</p>
      </div>
      <p className="absolute bottom-6 right-6 max-w-[14ch] text-right font-sans text-ui text-white/50">{site.location.replace('Chennai, ', '')}</p>
    </motion.div>
  )
}

/* The day as a bar: midnight to midnight in IST, the open hours filled in ink
   (drawn as a dashed outline on a Sunday, when there are none) and a red mark
   where the studio's clock is now. */
function Day({ t }) {
  const at = ((t.hh * 60 + t.mm) / 1440) * 100
  const sunday = t.wd === 'Sun'
  return (
    <div>
      <div className="relative h-2 bg-mist">
        <span
          className={cx(
            'absolute inset-y-0 left-[37.5%] w-[41.6667%]',
            sunday ? 'border border-dashed border-ink/40' : 'bg-ink',
          )}
        />
        <motion.span
          aria-hidden="true"
          className="absolute -top-1.5 h-5 w-[2px] bg-brand"
          initial={false}
          animate={{ left: `${at}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>
      <p aria-hidden="true" className="tnum mt-2 flex justify-between font-sans text-[0.6875rem] text-ink-3">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </p>
    </div>
  )
}

function Clock({ reduced }) {
  const t = useIst()
  return (
    <motion.div
      className="flex min-h-[30rem] flex-col justify-between border border-rule bg-white p-8 md:p-10 lg:col-span-5"
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1, ease: EASE, delay: 0.12 }}
    >
      <div>
        <p className="font-sans text-mark font-medium uppercase text-ink-3">Time in Chennai &middot; IST</p>
        <p
          className="tnum mt-6 font-display text-[clamp(3.5rem,2rem+5vw,6.25rem)] font-light leading-none tracking-[-0.05em] text-ink"
          role="timer"
          aria-label={`${two(t.hh)}:${two(t.mm)} in Chennai`}
        >
          {two(t.hh)}
          <span aria-hidden="true" className="akx-blink">:</span>
          {two(t.mm)}
          <span aria-hidden="true" className="ml-3 text-[0.32em] tracking-normal text-ink-3">{two(t.ss)}</span>
        </p>

        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-ui font-medium text-ink">
          <span className="relative inline-flex size-2.5 shrink-0">
            {t.open && !reduced ? <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60" /> : null}
            <span aria-hidden="true" className={cx('relative size-2.5 rounded-full', t.open ? 'bg-brand' : 'border border-ink/50')} />
          </span>
          {t.open ? 'Open now' : 'Closed right now'}
          <span className="font-normal text-ink-3">{t.open ? 'calls and video welcome' : 'email any time, we reply within a day'}</span>
        </p>
      </div>

      <div className="mt-10">
        <Day t={t} />
        <ul className="mt-8 grid grid-cols-7 gap-1.5">
          {DAYS.map((d) => {
            const today = d === t.wd
            const closed = d === 'Sun'
            return (
              <li
                key={d}
                data-sound="tick"
                className={cx(
                  'flex h-14 flex-col items-center justify-center font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] transition-colors duration-500',
                  today ? 'bg-ink text-white' : closed ? 'border border-dashed border-ink/30 text-ink-3' : 'bg-mist text-ink-2 hover:bg-fog',
                )}
              >
                {d}
                <span className={cx('mt-1 text-[0.5625rem] normal-case tracking-normal', today ? 'text-white/60' : 'text-ink-3')}>{closed ? 'closed' : '9 to 7'}</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 font-sans text-ui text-ink-3">{site.hours}. In person in Chennai, or fully remote.</p>
      </div>
    </motion.div>
  )
}

export default function Studio() {
  const reduced = usePrefersReducedMotion()
  return (
    <Band tone="light">
      <Container wide>
        <SectionIntro
          eyebrow="Where we are"
          index="02"
          title="A studio in"
          accent="Chennai."
          sub="We work from Chennai, and with clients across a table or entirely over video. The hours are the hours; the clock below is the studio's own."
        />
        <div className="mt-16 grid gap-4 lg:grid-cols-12">
          <Radar reduced={reduced} />
          <Clock reduced={reduced} />
        </div>
      </Container>
    </Band>
  )
}
