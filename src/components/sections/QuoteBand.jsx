import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Container } from '../primitives'
import { Slab } from '../ui/Slab'
import { Button } from '../ui/Button'
import ScrollHighlight from '../motion/ScrollHighlight'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { quote } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* The quote lights up word by word as it is scrolled through, so the reader
 * sets the pace. The Watch Video button renders only when `quote.videoUrl` is
 * set -- it is null, because there is no video. */
export default function QuoteBand() {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const markY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%'])

  return (
    <Slab tone="cocoa" ref={ref}>
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { y: markY }}
        className="pointer-events-none absolute -right-24 top-1/2 select-none font-serif text-[24rem] leading-none text-paper/[0.035]"
      >
        &rdquo;
      </motion.span>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <span aria-hidden="true" className="font-serif text-[4rem] leading-[0.6] text-clay lg:col-span-1">
            &ldquo;
          </span>

          <blockquote className="lg:col-span-10">
            <ScrollHighlight
              lines={quote.text}
              className="font-serif text-h1 leading-[1.14] tracking-[-0.025em]"
              dim="text-paper/12"
              lit="text-paper"
            />

            <motion.div
              className="mt-12 flex flex-wrap gap-4"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              <Button to="/contact" variant="onDark">Get in Touch</Button>
              {quote.videoUrl ? (
                <Button as="a" href={quote.videoUrl} variant="onDarkGhost">Watch Video</Button>
              ) : null}
            </motion.div>
          </blockquote>
        </div>
      </Container>
    </Slab>
  )
}
