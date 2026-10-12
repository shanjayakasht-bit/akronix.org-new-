import { useSyncExternalStore } from 'react'

/* Interface sound, synthesised (Step 7: the client asked for sound effects on
 * the About page).
 *
 * There are no audio files. Every sound is a few oscillators or a burst of
 * filtered noise, shaped with a short envelope and played through a compressor
 * at a low level, so the page ships no assets and the sounds can be tuned in
 * code. They are meant to be felt more than heard: a tick, a soft thud, a paper
 * swipe, a two-note chime.
 *
 * Sound is OFF until the visitor turns it on. Browsers refuse to start audio
 * until the page has had a click or a key press, and a site that makes noise
 * unasked is rude; so the choice is theirs, it is made with a click (which is
 * also what unlocks the audio), and it is remembered (`localStorage`, in a
 * try/catch -- storage can be blocked). If the saved choice is "on" the first
 * click or key press anywhere on a later visit wakes the audio up. A hover alone
 * cannot: it is not a user gesture.
 *
 * Nothing here runs on the server or without Web Audio; every entry point checks. */
const KEY = 'akx-sound'

let ctx = null
let master = null
let enabled = false
const lastAt = {}
const listeners = new Set()

try {
  enabled = typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === 'on'
} catch {
  enabled = false
}

const emit = () => listeners.forEach((l) => l())
export const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
export const getEnabled = () => enabled

function ensure() {
  if (typeof window === 'undefined') return false
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return false
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.85
    const comp = ctx.createDynamicsCompressor()
    master.connect(comp)
    comp.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return true
}

if (typeof window !== 'undefined') {
  const wake = () => {
    if (enabled) ensure()
  }
  window.addEventListener('pointerdown', wake, { passive: true })
  window.addEventListener('keydown', wake, { passive: true })
}

/* One oscillator with an exponential attack and decay, optionally gliding. */
function tone({ f1, f2 = f1, dur = 0.08, type = 'sine', gain = 0.1, attack = 0.004, delay = 0 }) {
  const t0 = ctx.currentTime + delay
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(f1, t0)
  if (f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g)
  g.connect(master)
  o.start(t0)
  o.stop(t0 + dur + 0.03)
}

/* A burst of white noise through a band-pass whose centre sweeps. */
function swish({ dur = 0.22, from = 300, to = 2600, gain = 0.07, q = 1.1, delay = 0 }) {
  const t0 = ctx.currentTime + delay
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = q
  f.frequency.setValueAtTime(from, t0)
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + dur * 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(f)
  f.connect(g)
  g.connect(master)
  src.start(t0)
}

const SOUNDS = {
  /* a light tick, for hovering a control */
  tick: () => tone({ f1: 1500, f2: 1000, dur: 0.05, type: 'triangle', gain: 0.07 }),
  /* a soft low thud, for hovering a row of the page's table */
  soft: () => tone({ f1: 430, f2: 330, dur: 0.1, gain: 0.1 }),
  /* the steady pulse of something being built */
  pulse: () => {
    tone({ f1: 190, f2: 150, dur: 0.18, gain: 0.14 })
    tone({ f1: 190, f2: 150, dur: 0.16, gain: 0.09, delay: 0.17 })
  },
  /* a press */
  click: () => tone({ f1: 900, f2: 420, dur: 0.09, type: 'square', gain: 0.04 }),
  /* paper being drawn across paper, for a sheet sliding into place */
  slide: () => swish({ dur: 0.26, from: 320, to: 2400, gain: 0.07 }),
  /* sound switched on, and off */
  on: () => {
    tone({ f1: 523.25, dur: 0.18, gain: 0.09 })
    tone({ f1: 783.99, dur: 0.24, gain: 0.09, delay: 0.1 })
  },
  off: () => {
    tone({ f1: 783.99, dur: 0.16, gain: 0.08 })
    tone({ f1: 523.25, dur: 0.22, gain: 0.08, delay: 0.09 })
  },
  /* a sonar ping, for the studio radar: one clear note with a long tail and a
     faint octave above it */
  ping: () => {
    tone({ f1: 1174.66, dur: 0.95, gain: 0.07, attack: 0.008 })
    tone({ f1: 2349.32, dur: 0.5, gain: 0.015, attack: 0.008, delay: 0.01 })
  },
  chime: () => {
    ;[659.25, 880, 1318.5].forEach((f, i) => tone({ f1: f, dur: 0.5, gain: 0.07, attack: 0.01, delay: i * 0.09 }))
  },
}

/* A context that has not been unlocked yet (no click or key press on this visit)
   sits suspended with its clock stopped; anything scheduled on it would all fire
   at once the moment the first click woke it. So a sound is only scheduled on a
   running context, or -- if the context is being woken by the very gesture that
   asked for the sound -- right after it has woken, and then only if the ask is
   still fresh. */
function playRaw(name) {
  if (!ensure()) return
  if (ctx.state === 'running') {
    SOUNDS[name]?.()
    return
  }
  const asked = typeof performance !== 'undefined' ? performance.now() : 0
  ctx
    .resume()
    .then(() => {
      const fresh = (typeof performance !== 'undefined' ? performance.now() : 0) - asked < 250
      if (ctx.state === 'running' && fresh) SOUNDS[name]?.()
    })
    .catch(() => {})
}

/* Play a sound if sound is on. Hover sounds are throttled so a pointer crossing a
   row of controls does not machine-gun. */
export function play(name, throttle = 70) {
  if (!enabled) return
  const now = typeof performance !== 'undefined' ? performance.now() : 0
  if (now - (lastAt[name] ?? -1e9) < throttle) return
  lastAt[name] = now
  playRaw(name)
}

export function setEnabled(next) {
  if (next === enabled) return
  if (!next) playRaw('off') // goodbye, while it can still be heard
  enabled = next
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off')
  } catch {
    /* storage blocked: the choice lasts for this visit */
  }
  emit()
  if (next) playRaw('on')
}

export function useSound() {
  const on = useSyncExternalStore(subscribe, getEnabled, () => false)
  return { enabled: on, toggle: () => setEnabled(!getEnabled()), play }
}
