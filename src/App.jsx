import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from './components/shell/Nav'
import Footer from './components/shell/Footer'
import ScrollToTop from './components/shell/ScrollToTop'
import ScrollProgress from './components/motion/ScrollProgress'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'
import Home from './pages/Home'
import Building from './pages/Building'
import Work from './pages/Work'
import Studio from './pages/Studio'
import Contact from './pages/Contact'
import Policies from './pages/Policies'
import NotFound from './pages/NotFound'
import Specimen from './pages/Specimen'

const EASE = [0.16, 1, 0.3, 1]

export default function App() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <Nav />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="flex-1"
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
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/building" element={<Building />} />
            <Route path="/work" element={<Work />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<Policies />} />
            {/* Token reference. Never reaches production. */}
            {import.meta.env.DEV && <Route path="/specimen" element={<Specimen />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
