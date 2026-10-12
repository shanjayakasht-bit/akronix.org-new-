// STEP 2 of 2 -- trace the figure in the Akronix artwork into smooth SVG paths.
// Reads alpha.json (see extract-alpha.mjs); writes the module the site imports:
//
//   node trace.mjs ../../src/components/brand/figure.js
//
// No dependencies. The approach is documented in the module it writes.
// marching squares on the alpha channel (level 0.5, linear interpolation along
// edges) -> closed loops -> Douglas-Peucker -> Catmull-Rom beziers, keeping
// sharp corners sharp.
import fs from 'fs'

const { w, h, alpha } = JSON.parse(fs.readFileSync('alpha.json', 'utf8'))

// The figure sits in x 149-384, y 21-287 (STATUS Step 3q); take a margin.
const X0 = 130, X1 = 405, Y0 = 8, Y1 = 300
const W = X1 - X0, H = Y1 - Y0
// field with 1px zero padding so every contour closes
const PW = W + 2, PH = H + 2
const f = new Float64Array(PW * PH)
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) f[(y + 1) * PW + (x + 1)] = alpha[(y + Y0) * w + (x + X0)] / 255

const LEVEL = 0.5
const val = (x, y) => f[y * PW + x]

// edge ids: horizontal edge (x,y)-(x+1,y) => `h${x},${y}`; vertical (x,y)-(x,y+1) => `v${x},${y}`
const pts = new Map() // id -> [x, y]
const adj = new Map() // id -> [id, id]
const link = (a, b) => {
  if (!adj.has(a)) adj.set(a, [])
  if (!adj.has(b)) adj.set(b, [])
  adj.get(a).push(b)
  adj.get(b).push(a)
}
const lerp = (a, b) => (LEVEL - a) / (b - a)
const ptH = (x, y) => {
  const id = `h${x},${y}`
  if (!pts.has(id)) pts.set(id, [x + lerp(val(x, y), val(x + 1, y)), y])
  return id
}
const ptV = (x, y) => {
  const id = `v${x},${y}`
  if (!pts.has(id)) pts.set(id, [x, y + lerp(val(x, y), val(x, y + 1))])
  return id
}

for (let y = 0; y < PH - 1; y++) {
  for (let x = 0; x < PW - 1; x++) {
    const a = val(x, y) >= LEVEL ? 1 : 0 // tl
    const b = val(x + 1, y) >= LEVEL ? 1 : 0 // tr
    const c = val(x + 1, y + 1) >= LEVEL ? 1 : 0 // br
    const d = val(x, y + 1) >= LEVEL ? 1 : 0 // bl
    const code = a * 8 + b * 4 + c * 2 + d
    const top = () => ptH(x, y)
    const bottom = () => ptH(x, y + 1)
    const left = () => ptV(x, y)
    const right = () => ptV(x + 1, y)
    switch (code) {
      case 1: case 14: link(left(), bottom()); break
      case 2: case 13: link(bottom(), right()); break
      case 3: case 12: link(left(), right()); break
      case 4: case 11: link(top(), right()); break
      case 6: case 9: link(top(), bottom()); break
      case 7: case 8: link(left(), top()); break
      case 5: { // saddle: tr and bl inside
        const mid = (val(x, y) + val(x + 1, y) + val(x + 1, y + 1) + val(x, y + 1)) / 4
        if (mid >= LEVEL) { link(left(), top()); link(bottom(), right()) } else { link(left(), bottom()); link(top(), right()) }
        break
      }
      case 10: {
        const mid = (val(x, y) + val(x + 1, y) + val(x + 1, y + 1) + val(x, y + 1)) / 4
        if (mid >= LEVEL) { link(top(), right()); link(left(), bottom()) } else { link(left(), top()); link(bottom(), right()) }
        break
      }
      default: break
    }
  }
}

// walk loops
const seen = new Set()
const loops = []
for (const start of adj.keys()) {
  if (seen.has(start)) continue
  const loop = []
  let prev = null, cur = start
  while (cur && !seen.has(cur)) {
    seen.add(cur)
    loop.push(pts.get(cur))
    const nb = adj.get(cur)
    const next = nb.find((n) => n !== prev && !seen.has(n)) ?? nb.find((n) => n !== prev)
    prev = cur
    cur = next && !seen.has(next) ? next : null
  }
  if (loop.length > 12) loops.push(loop)
}


const area = (L) => { let s = 0; for (let i = 0; i < L.length; i++) { const [x1, y1] = L[i], [x2, y2] = L[(i + 1) % L.length]; s += x1 * y2 - x2 * y1 } return s / 2 }

// ---- resample a closed loop to uniform spacing --------------------------
function resample(L, step) {
  const n = L.length
  const seg = []
  let total = 0
  for (let i = 0; i < n; i++) { const a = L[i], b = L[(i + 1) % n]; const d = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push(d); total += d }
  const count = Math.max(8, Math.round(total / step))
  const out = []
  let i = 0, acc = 0
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total
    while (acc + seg[i] < target) { acc += seg[i]; i = (i + 1) % n }
    const t = seg[i] ? (target - acc) / seg[i] : 0
    const a = L[i], b = L[(i + 1) % n]
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

// ---- corners: turning angle over a window --------------------------------
function findCorners(P, k, deg) {
  const n = P.length
  const turn = P.map((_, i) => {
    const a = P[(i - k + n) % n], c = P[i], b = P[(i + k) % n]
    const a1 = Math.atan2(c[1] - a[1], c[0] - a[0]), a2 = Math.atan2(b[1] - c[1], b[0] - c[0])
    let d = Math.abs(a2 - a1); if (d > Math.PI) d = 2 * Math.PI - d
    return (d * 180) / Math.PI
  })
  const corners = []
  for (let i = 0; i < n; i++) {
    if (turn[i] < deg) continue
    let isMax = true
    for (let j = -k; j <= k; j++) if (turn[(i + j + n) % n] > turn[i] || (turn[(i + j + n) % n] === turn[i] && j < 0)) { isMax = false; break }
    if (isMax) corners.push(i)
  }
  return corners
}

// ---- gaussian smooth, corners held fixed ---------------------------------
function gaussKernel(sigma) {
  const r = Math.ceil(sigma * 3)
  const k = []
  let sum = 0
  for (let i = -r; i <= r; i++) { const v = Math.exp(-(i * i) / (2 * sigma * sigma)); k.push(v); sum += v }
  return k.map((v) => v / sum)
}
function smoothOpen(S, sigma) {
  // S: open polyline whose two endpoints are fixed; reflect at ends
  const K = gaussKernel(sigma), r = (K.length - 1) / 2, m = S.length
  const at = (i) => {
    if (i < 0) return [2 * S[0][0] - S[Math.min(m - 1, -i)][0], 2 * S[0][1] - S[Math.min(m - 1, -i)][1]]
    if (i > m - 1) { const j = Math.max(0, 2 * (m - 1) - i); return [2 * S[m - 1][0] - S[j][0], 2 * S[m - 1][1] - S[j][1]] }
    return S[i]
  }
  return S.map((_, i) => {
    if (i === 0 || i === m - 1) return S[i]
    let x = 0, y = 0
    for (let j = -r; j <= r; j++) { const p = at(i + j); x += p[0] * K[j + r]; y += p[1] * K[j + r] }
    return [x, y]
  })
}
function smoothClosed(P, sigma) {
  const K = gaussKernel(sigma), r = (K.length - 1) / 2, n = P.length
  return P.map((_, i) => {
    let x = 0, y = 0
    for (let j = -r; j <= r; j++) { const p = P[(i + j + n * 4) % n]; x += p[0] * K[j + r]; y += p[1] * K[j + r] }
    return [x, y]
  })
}

const f2 = (v) => (Math.round(v * 100) / 100).toString()

// Catmull-Rom through an open run of points; end tangents are one-sided.
function runToBezier(Pts, step) {
  // subsample every `step` points, always keeping the last
  const idx = []
  for (let i = 0; i < Pts.length - 1; i += step) idx.push(i)
  idx.push(Pts.length - 1)
  const Q = idx.map((i) => Pts[i])
  const n = Q.length
  let d = ''
  for (let i = 0; i < n - 1; i++) {
    const p0 = Q[Math.max(0, i - 1)], p1 = Q[i], p2 = Q[i + 1], p3 = Q[Math.min(n - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${f2(c1[0])} ${f2(c1[1])} ${f2(c2[0])} ${f2(c2[1])} ${f2(p2[0])} ${f2(p2[1])}`
  }
  return d
}

function buildPath(L) {
  const P = resample(L, 1)
  const corners = findCorners(P, 7, 34)
  const n = P.length
  if (corners.length === 0) {
    const S = smoothClosed(P, 3.2)
    // closed catmull-rom
    const stepN = 7
    const Q = []
    for (let i = 0; i < n; i += stepN) Q.push(S[i])
    const m = Q.length
    let d = `M${f2(Q[0][0])} ${f2(Q[0][1])}`
    for (let i = 0; i < m; i++) {
      const p0 = Q[(i - 1 + m) % m], p1 = Q[i], p2 = Q[(i + 1) % m], p3 = Q[(i + 2) % m]
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
      d += `C${f2(c1[0])} ${f2(c1[1])} ${f2(c2[0])} ${f2(c2[1])} ${f2(p2[0])} ${f2(p2[1])}`
    }
    return { d: d + 'Z', corners: 0 }
  }
  // split into runs between consecutive corners
  let d = ''
  for (let c = 0; c < corners.length; c++) {
    const a = corners[c], b = corners[(c + 1) % corners.length]
    const run = []
    for (let i = a; ; i = (i + 1) % n) { run.push(P[i]); if (i === b) break; if (run.length > n + 1) break }
    const S = smoothOpen(run, 2.6)
    if (c === 0) d += `M${f2(S[0][0])} ${f2(S[0][1])}`
    d += runToBezier(S, 6)
  }
  return { d: d + 'Z', corners: corners.length }
}

const built = loops
  .map((L) => ({ L, a: area(L) }))
  .sort((p, q) => Math.abs(q.a) - Math.abs(p.a))
  .map(({ L, a }) => { const r = buildPath(L); return { area: Math.round(a), pts: L.length, corners: r.corners, d: r.d } })

let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9
for (const L of loops) for (const [x, y] of L) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y) }
const pad = 2
const vb = [Math.floor(minX - pad), Math.floor(minY - pad), Math.ceil(maxX - minX + pad * 2), Math.ceil(maxY - minY + pad * 2)]
console.log('loops', built.map((o) => ({ area: o.area, pts: o.pts, corners: o.corners, len: o.d.length })))
console.log('viewBox', vb.join(' '))

// built is sorted by area: body, leg, head.
const [body, leg, head] = built.map((o) => o.d)
const mod = `/* The Akronix figure, as vector.
 *
 * Traced from the supplied artwork (public/logo/logo-new.webp, the figure only:
 * marching squares on the alpha channel at the 0.5 level, resampled to even
 * spacing, corners found by turning angle and held fixed, the runs between them
 * Gaussian-smoothed and re-fitted as cubic Beziers). The raster is 555px wide;
 * this is what lets the figure be drawn at 700px, outlined, and stroke-animated
 * without going soft.
 *
 * Three closed shapes: the body (the sweeping "A"), the leg, and the head. The
 * head is the one piece the hero fills in red -- the same red as the I in the
 * wordmark.
 *
 * Generated, not hand-edited: scripts/figure/ (see its two files). If the
 * artwork changes, trace it again. */
export const FIGURE = {
  viewBox: '${vb.join(' ')}',
  width: ${vb[2]},
  height: ${vb[3]},
  body: '${body}',
  leg: '${leg}',
  head: '${head}',
}
`
const out = process.argv[2] ?? 'figure.js'
fs.writeFileSync(out, mod)
console.log('wrote', out)
