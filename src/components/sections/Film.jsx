import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Container } from '../primitives'
import { Band } from '../ui/Band'
import { Label } from '../ui/Pill'
import { RollText } from '../ui/RollText'
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion'
import { hero } from '../../content/home'

const EASE = [0.16, 1, 0.3, 1]

/* A film, if there is one.
 *
 * Renders nothing until `hero.videoUrl` in `content/home.js` is set to a real
 * file. It exists so that the day a real film (a walkthrough, a studio reel) is
 * supplied it has a place to go, built to the same grammar as everything else:
 * a full-bleed band, a poster with a plain Play control, the film in a frame
 * that opens out as it arrives. It is NOT a placeholder box -- an empty frame
 * labelled "demo video" was the old hero's weakest moment, and a mock-up of a
 * product screen is the thing this site will not show. No file, no band. */
export default function Film() {
  const reduced = usePrefersReducedMotion()
  const video = useRef(null)
  const [playing, setPlaying] = useState(false)
  if (!hero.videoUrl) return null

  const play = () => {
    setPlaying(true)
    video.current?.play()
  }

  return (
    <Band tone="dark" pad="md">
      <Container wide>
        <Label onDark index="00">Film</Label>
        <motion.div
          className="relative mt-8 aspect-video overflow-hidden bg-graphite"
          initial={reduced ? false : { clipPath: 'inset(8% 6% 8% 6%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <video
            ref={video}
            src={hero.videoUrl}
            poster={hero.videoPoster ?? undefined}
            controls={playing}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          {!playing ? (
            <button
              type="button"
              onClick={play}
              className="group/roll absolute bottom-6 left-6 inline-flex items-center gap-3 bg-white px-5 py-3 font-sans text-ui font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white"
            >
              <span aria-hidden="true" className="block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-current" />
              <RollText>Play film</RollText>
            </button>
          ) : null}
        </motion.div>
      </Container>
    </Band>
  )
}
