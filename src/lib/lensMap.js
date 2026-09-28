/* A displacement map for a pill of clear glass: flat in the middle, bending
 * only in a band along the rim -- the iOS camera-mode pill the client pointed
 * at, where the text is untouched until it reaches the edge and then wraps.
 *
 * Returned as a PNG data URL, drawn at the pill's own size in CSS pixels, for
 * an `<feImage>` feeding `<feDisplacementMap>`. Red carries x, green carries y,
 * 128 is "no shift". Near the rim every pixel is told to sample from further
 * IN along the edge's normal, so what sits just inside the edge is pulled out
 * across the band -- that is the bend. The shift eases in with the square of
 * how deep into the band the pixel is, so it starts from nothing and is
 * strongest at the very edge.
 *
 * The pill is a stadium: a rectangle with semicircular ends, radius h/2, so
 * the normal at any point is the direction from the nearest point on the
 * centre line. */
export function lensMap(w, h, band) {
  const W = Math.max(1, Math.round(w))
  const H = Math.max(1, Math.round(h))
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const r = H / 2

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const cx = Math.min(Math.max(px, r), W - r)
      const vx = px - cx
      const vy = py - r
      const dist = Math.hypot(vx, vy) || 1
      const depth = r - dist /* distance in from the rim */
      const t = depth < 0 ? 0 : Math.max(0, 1 - depth / band)
      const m = t * t
      const i = (y * W + x) * 4
      img.data[i] = 128 - (vx / dist) * m * 127
      img.data[i + 1] = 128 - (vy / dist) * m * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  return { url: canvas.toDataURL('image/png'), w: W, h: H }
}
