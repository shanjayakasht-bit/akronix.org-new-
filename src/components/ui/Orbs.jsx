import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'

/* Soft colour fields behind a section. Blurred radial washes, not the hard
   3D blobs of a template -- they drift slowly and never sit still enough to
   read as a shape. Purely atmospheric, so aria-hidden throughout. */
export function Orbs({ tone = 'warm' }) {
  const reduced = usePrefersReducedMotion()
  const sets = {
    warm: [
      { c: 'bg-ember/25', s: 'h-[26rem] w-[26rem]', p: '-top-32 -left-24', d: 0 },
      { c: 'bg-ember-2/25', s: 'h-[22rem] w-[22rem]', p: 'top-24 right-[-6rem]', d: 2 },
      { c: 'bg-plum/15', s: 'h-[18rem] w-[18rem]', p: 'bottom-[-6rem] left-1/3', d: 4 },
    ],
    cool: [
      { c: 'bg-teal/25', s: 'h-[24rem] w-[24rem]', p: '-top-24 right-[-4rem]', d: 0 },
      { c: 'bg-sage/20', s: 'h-[20rem] w-[20rem]', p: 'bottom-[-5rem] -left-16', d: 3 },
    ],
  }
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {sets[tone].map((o, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${o.c} ${o.s} ${o.p}`}
          animate={reduced ? undefined : { y: [0, -26, 0], x: [0, 18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 16 + i * 4, repeat: Infinity, ease: 'easeInOut', delay: o.d }}
        />
      ))}
    </div>
  )
}
