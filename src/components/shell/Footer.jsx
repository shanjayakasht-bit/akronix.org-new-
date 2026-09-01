import { Link } from 'react-router-dom'
import { Container } from '../primitives'
import { Mark } from '../brand/Mark'
import { site, socials, footerColumns } from '../../content/site'

export default function Footer() {
  return (
    <footer className="bg-night text-white/70">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <Mark className="h-8 w-8" />
              <span className="font-sans text-xl font-bold tracking-tight">{site.name}</span>
            </Link>
            <p className="mt-5 max-w-[38ch] font-sans text-body leading-relaxed text-white/60">
              Your complete business growth ecosystem — software, marketing,
              networking and mentorship under one roof.
            </p>

            <ul className="mt-7 space-y-2.5 font-sans text-ui">
              <li>
                <a href={`mailto:${site.email}`} className="text-white/70 transition-colors hover:text-clay">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="text-white/70 transition-colors hover:text-clay">
                  {site.phone}
                </a>
              </li>
              <li className="text-white/60">{site.location}</li>
            </ul>

            <ul className="mt-7 flex gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-10 items-center justify-center border border-white/20 px-4 font-sans text-[0.75rem] text-white/70 transition-colors duration-300 hover:border-white/60 hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                  {col.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="font-sans text-ui text-white/70 transition-colors duration-300 hover:text-clay"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.75rem] text-white/45">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-sans text-[0.75rem] text-white/45">
            Built in {site.location.split(',')[0]}.
          </p>
        </div>
      </Container>
    </footer>
  )
}
