import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import { RollText } from '../ui/RollText'
import { Arrow } from '../ui/Arrow'
import { Chevron } from '../brand/Glyphs'
import { site } from '../../content/site'
import { products, productShort, productSlug } from '../../content/products'
import { serviceGroups, planOptions } from '../../content/contact'
import { cx } from '../../lib/cx'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* The enquiry form.
 *
 * Every link on the site that names a product, a service or a plan arrives
 * here with it in the address -- `?product=crm`, `?service=ai`, `?plan=growth`
 * -- and the form opens with that choice already made. A product choice
 * becomes an "Early access" request, and the card at the top says plainly that
 * the product is in development: nothing here lets a visitor believe a product
 * can be bought.
 *
 * WHERE THE MESSAGE GOES -- read before changing the wording. `site.contactEndpoint`
 * is null, so there is nothing to receive a POST. With no endpoint the form
 * opens the visitor's own mail client with the message written out, and the
 * closing screen says exactly that. It must not say the message was sent or
 * received on that path. With an endpoint set it POSTs and says it was
 * received. */
const options = [
  ...serviceGroups,
  {
    label: 'Early access to a product (none has shipped)',
    options: products.map((p) => ({ value: `product:${productSlug(p)}`, label: `${p.name} · ${p.stage}` })),
  },
]
const labelOf = (value) => options.flatMap((g) => g.options).find((o) => o.value === value)?.label ?? ''

/* Filled, square fields with a rule along the foot, as enterprise forms are set:
   a light grey ground, a dark bottom edge, and on focus the ground clears to
   white and the whole field takes a 1px ink frame. */
const field =
  'mt-2 w-full border-0 border-b border-ink/40 bg-mist px-4 py-3.5 font-sans text-ui text-ink outline-none transition-all duration-300 placeholder:text-ink-3 focus:border-ink focus:bg-white focus:ring-1 focus:ring-ink'

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-mark font-medium uppercase text-ink-2">
        {label}
      </label>
      {children}
      <p className={cx('mt-1.5 min-h-[1.25rem] font-sans text-[0.8125rem]', error ? 'text-brand' : 'text-ink-3')}>
        {error || hint || ''}
      </p>
    </div>
  )
}

export default function ContactForm() {
  const reduced = usePrefersReducedMotion()
  const [params] = useSearchParams()

  const initialTopic = useMemo(() => {
    const product = params.get('product')
    const service = params.get('service')
    if (product && products.some((p) => productSlug(p) === product)) return `product:${product}`
    if (service && labelOf(service)) return service
    return ''
  }, [params])
  const initialPlan = planOptions.some((p) => p.value === params.get('plan')) ? params.get('plan') : ''

  const [v, setV] = useState({ first: '', last: '', email: '', company: '', topic: initialTopic, plan: initialPlan, message: '' })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [route, setRoute] = useState('mail')
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }))
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const errors = {
    first: !v.first.trim() && 'Your first name, please.',
    last: !v.last.trim() && 'And your last name.',
    email: !EMAIL.test(v.email.trim()) && 'That does not look like an email address yet.',
    topic: !v.topic && 'Choose what this is about.',
    message: v.message.trim().length < 10 && 'A sentence or two is enough.',
  }
  const valid = !Object.values(errors).some(Boolean)
  const show = (k) => touched[k] && errors[k]

  const product = v.topic.startsWith('product:')
    ? products.find((p) => productSlug(p) === v.topic.slice(8))
    : null

  const submit = async (e) => {
    e.preventDefault()
    setTouched({ first: true, last: true, email: true, topic: true, message: true })
    if (!valid) return
    const topic = labelOf(v.topic)
    const plan = planOptions.find((p) => p.value === v.plan)?.label
    const name = `${v.first.trim()} ${v.last.trim()}`

    if (!site.contactEndpoint) {
      const body = [
        `Name: ${name}`,
        `Email: ${v.email.trim()}`,
        v.company.trim() && `Company: ${v.company.trim()}`,
        `About: ${topic}`,
        plan && `Plan: ${plan}`,
        '',
        v.message.trim(),
      ]
        .filter((l) => l !== false && l !== '')
        .join('\n')
      const subject = product ? `Early access request: ${product.name}` : `Enquiry: ${topic}`
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setRoute('mail')
      setStatus('done')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: v.email.trim(), company: v.company.trim(), topic, plan: plan ?? '', message: v.message.trim() }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setRoute('endpoint')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-ink/15 bg-white p-8 md:p-12">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="py-6 text-center"
        >
          <svg viewBox="0 0 48 48" className="mx-auto h-14 w-14 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <motion.circle cx="24" cy="24" r="21" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE }} />
            <motion.path d="m15 25 6 6 12-13" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.5 }} />
          </svg>
          <h3 className="mt-7 font-display text-h2 text-ink">
            {route === 'endpoint' ? 'Message received.' : 'Your message is ready to send.'}
          </h3>
          <p className="mx-auto mt-4 max-w-[44ch] font-sans text-body leading-relaxed text-ink-2">
            {route === 'endpoint'
              ? `Thank you, ${v.first.trim()}. We will reply to ${v.email.trim()} within a day.`
              : `We have opened it in your email app, written out for you. Send it from there and we will reply to ${v.email.trim()} within a day. If nothing opened, write to ${site.email} directly.`}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="border border-ink/15 bg-white p-6 sm:p-8 md:p-10">
      <AnimatePresence initial={false}>
        {product ? (
          <motion.div
            key="product"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mb-8 flex items-start gap-4 border-l-[3px] border-brand bg-mist p-5">
              <span className={cx('mt-0.5 inline-flex size-11 shrink-0 items-center justify-center font-sans text-mark font-medium', product.accent.chip)}>
                {product.code}
              </span>
              <div>
                <p className="font-sans text-mark font-medium uppercase text-ink-3">Early access request</p>
                <p className="mt-1 font-display text-h3 text-ink">{product.name}</p>
                <p className="mt-1.5 font-sans text-ui leading-relaxed text-ink-2">
                  {productShort(product)} is {product.stage === 'Planned' ? 'planned and not started' : 'in development'}. It has not shipped
                  and cannot be bought yet. Leave your details and we will tell you when early access opens and what it will cover.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id="cf-first" label="First name" error={show('first')}>
          <input id="cf-first" autoComplete="given-name" value={v.first} onChange={set('first')} onBlur={blur('first')} className={field} />
        </Field>
        <Field id="cf-last" label="Last name" error={show('last')}>
          <input id="cf-last" autoComplete="family-name" value={v.last} onChange={set('last')} onBlur={blur('last')} className={field} />
        </Field>
      </div>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id="cf-email" label="Email address" error={show('email')}>
          <input id="cf-email" type="email" inputMode="email" autoComplete="email" value={v.email} onChange={set('email')} onBlur={blur('email')} placeholder="you@company.com" className={field} />
        </Field>
        <Field id="cf-company" label="Company (optional)">
          <input id="cf-company" autoComplete="organization" value={v.company} onChange={set('company')} className={field} />
        </Field>
      </div>

      <Field id="cf-topic" label="What is this about?" error={show('topic')}>
        <div className="relative">
          <select id="cf-topic" value={v.topic} onChange={set('topic')} onBlur={blur('topic')} className={cx(field, 'appearance-none pr-12')}>
            <option value="">Select a service or product…</option>
            {options.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <Chevron className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-ink" />
        </div>
      </Field>

      {initialPlan || v.plan ? (
        <Field id="cf-plan" label="Plan">
          <div className="relative">
            <select id="cf-plan" value={v.plan} onChange={set('plan')} className={cx(field, 'appearance-none pr-12')}>
              <option value="">No plan yet</option>
              {planOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <Chevron className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-ink" />
          </div>
        </Field>
      ) : null}

      <Field id="cf-message" label="How can we help?" error={show('message')}>
        <textarea id="cf-message" rows={5} value={v.message} onChange={set('message')} onBlur={blur('message')} placeholder="What you are building or trying to fix, and anything you already know about it." className={cx(field, 'resize-none')} />
      </Field>

      {status === 'error' ? (
        <p className="mb-4 font-sans text-ui text-brand">That did not go through. Try again, or email {site.email} directly.</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="max-w-[34ch] font-sans text-[0.8125rem] leading-relaxed text-ink-3">
          By sending this you agree to our privacy policy. We will not share your details.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group/roll group relative isolate inline-flex items-center gap-3 overflow-hidden border border-ink bg-ink px-7 py-3.5 font-sans text-ui font-medium text-white transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-brand before:transition-transform before:duration-[550ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-brand hover:before:scale-x-100 disabled:opacity-60"
        >
          <RollText>{status === 'sending' ? 'Sending' : 'Send message'}</RollText>
          <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}
