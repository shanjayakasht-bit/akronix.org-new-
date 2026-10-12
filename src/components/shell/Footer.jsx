import { Link } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { Container } from '../primitives'
import { Label } from '../ui/Pill'
import { Arrow } from '../ui/Arrow'
import { RollText } from '../ui/RollText'
import { Logo } from '../brand/Logo'
import { FooterFigure } from '../brand/FooterFigure'
import { site, socials, footerColumns } from '../../content/site'

/* The footer, set the way a large company's is: the logo, one line of intent
 * and the way to reach us, the sitemap in four columns and a legal row. Black,
 * to close the page the way the announcement strip opened it.
 *
 * The sign-off is the figure from the hero, drawn once in outline at the foot
 * and bleeding off the corner. It is a vector (see `figure.js`) because the
 * wordmark artwork is a 555px raster: set across the full width of the footer
 * it was a 2.7x enlargement and went soft, and a blurred logo is worse than no
 * logo. */
export default function Footer() {
  const lenis = useLenis()
  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0 }))

  return (
    <footer className="relative isolate overflow-hidden bg-coal text-white">
      {/* the sign-off: the figure, large and faint, bleeding off the corner */}
      <FooterFigure className="pointer-events-none absolute -bottom-24 right-[-4%] -z-10 h-[34rem] w-auto opacity-100 lg:right-[2%] lg:h-[42rem]" />

      <Container wide>
        <div className="grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link to="/" aria-label={`${site.name} — home`} className="inline-block">
              <Logo light className="h-24 w-auto" />
            </Link>
            <div className="mt-12">
              <Label onDark>Get in touch</Label>
            </div>
            <p className="mt-8 max-w-[20ch] font-display text-h2 text-white">
              Software, marketing, networking and mentorship, under one roof.
            </p>

            <a
              href={`mailto:${site.email}`}
              className="group/roll mt-10 inline-flex items-center gap-3 border-b border-white/40 pb-2 font-display text-h3 text-white transition-colors duration-300 hover:border-brand-soft hover:text-brand-soft"
            >
              <RollText>{site.email}</RollText>
              <Arrow className="h-5 w-5 transition-transform duration-300 group-hover/roll:translate-x-1" />
            </a>

            <ul className="mt-8 space-y-2 font-sans text-ui text-white/60">
              {site.phones.map((ph) => (
                <li key={ph.href}>
                  <a href={ph.href} className="group/roll inline-block transition-colors duration-300 hover:text-white">
                    <RollText>{ph.display}</RollText>
                  </a>
                </li>
              ))}
              <li>{site.location}</li>
              <li>{site.hours}</li>
            </ul>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/roll inline-flex items-center gap-1.5 font-sans text-ui font-medium text-white/80 transition-colors duration-300 hover:text-white"
                  >
                    <RollText>{s.label}</RollText>
                    <span aria-hidden="true" className="text-white/40">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4 lg:gap-8">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-sans text-mark font-medium uppercase text-white/45">{col.title}</h2>
                <ul className="mt-6 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group/roll inline-block font-sans text-ui text-white/80 transition-colors duration-300 hover:text-white"
                      >
                        <RollText>{l.label}</RollText>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/15 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.8125rem] text-white/50">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            <span className="mx-3 text-white/25">/</span>
            <Link to="/policies" className="group/roll inline-block text-white/60 transition-colors duration-300 hover:text-white">
              <RollText>Privacy &amp; terms</RollText>
            </Link>
          </p>
          <button
            type="button"
            onClick={toTop}
            className="group/roll inline-flex items-center gap-3 self-start font-sans text-[0.8125rem] font-medium text-white/70 transition-colors duration-300 hover:text-white sm:self-auto"
          >
            <RollText>Back to top</RollText>
            <Arrow className="h-3.5 w-3.5 -rotate-90 transition-transform duration-300 group-hover/roll:-translate-y-1" />
          </button>
        </div>
      </Container>

    </footer>
  )
}
