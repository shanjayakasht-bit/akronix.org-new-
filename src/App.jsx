import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from './components/shell/Nav'
import Footer from './components/shell/Footer'
import ScrollToTop from './components/shell/ScrollToTop'
import ScrollProgress from './components/motion/ScrollProgress'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'
import Home from './pages/Home'

/* The homepage is in the first bundle; every other page loads when it is first
   visited, and the rest are fetched quietly a few seconds after the homepage
   has settled, so the first click is usually already waiting. Splitting by
   route took the entry script back under the 500kB warning. */
const loaders = {
  building: () => import('./pages/Building'),
  solutions: () => import('./pages/Solutions'),
  pricing: () => import('./pages/Pricing'),
  about: () => import('./pages/About'),
  contact: () => import('./pages/Contact'),
  policies: () => import('./pages/Policies'),
  notFound: () => import('./pages/NotFound'),
}
const Building = lazy(loaders.building)
const Solutions = lazy(loaders.solutions)
const Pricing = lazy(loaders.pricing)
const About = lazy(loaders.about)
const Contact = lazy(loaders.contact)
const Policies = lazy(loaders.policies)
const NotFound = lazy(loaders.notFound)

const EASE = [0.16, 1, 0.3, 1]

export default function App() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => Object.values(loaders).forEach((load) => load()), 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <Nav />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          id="main"
          tabIndex={-1}
          className="flex-1 outline-none"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          /* Leaving is quicker than arriving, so navigation doesn't feel laggy.
             Per-state timing belongs inside the target, not the transition prop. */
          exit={
            reduced
              ? { opacity: 1 }
              : { opacity: 0, transition: { duration: 0.2, ease: EASE } }
          }
          transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
        >
          <Suspense fallback={<div className="min-h-[70svh]" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/building" element={<Building />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            {/* The first sitemap's names, kept alive for any link already out there. */}
            <Route path="/work" element={<Navigate to="/solutions" replace />} />
            <Route path="/studio" element={<Navigate to="/about" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
