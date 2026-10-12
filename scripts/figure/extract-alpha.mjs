// STEP 1 of 2 -- read the alpha channel of the logo artwork.
//
// The figure in the hero and the footer is traced from public/logo/logo-new.webp
// (555x407, alpha channel). Chromium's canvas is the decoder, so no image library
// is needed. Run the dev server, then, from a scratch directory (NOT the project:
// playwright-core is deliberately not a dependency) with playwright-core installed:
//
//   CHROMIUM=/path/to/chromium SITE=http://localhost:5173/ node extract-alpha.mjs
//
// It writes alpha.json beside where you run it; trace.mjs reads that.
// Pull the alpha channel of the logo artwork out of Chromium's canvas.
import { chromium } from 'playwright-core'
import fs from 'fs'
const b = await chromium.launch({ executablePath: process.env.CHROMIUM }) // path to a Chromium binary
const p = await b.newPage()
await p.goto(process.env.SITE ?? 'http://localhost:5173/')
const data = await p.evaluate(async () => {
  const img = new Image(); img.src = '/logo/logo-new.webp'; await img.decode()
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0)
  const d = ctx.getImageData(0, 0, c.width, c.height).data
  const alpha = new Array(c.width * c.height)
  for (let i = 0; i < alpha.length; i++) alpha[i] = d[i * 4 + 3]
  return { w: c.width, h: c.height, alpha }
})
fs.writeFileSync('alpha.json', JSON.stringify(data))
console.log(data.w, data.h)
await b.close()
