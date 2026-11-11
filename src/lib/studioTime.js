import { useEffect, useState } from 'react'

/* The time in Chennai, and whether the studio is open: Monday to Saturday, 9 AM
 * to 7 PM Indian Standard Time, whatever zone the visitor is in. Shared by the
 * About page's clock and the home hero's, so the two cannot disagree. */
export function ist(date = new Date()) {
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

export function useIst() {
  const [now, setNow] = useState(() => ist())
  useEffect(() => {
    const id = setInterval(() => setNow(ist()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export const two = (n) => String(n).padStart(2, '0')
