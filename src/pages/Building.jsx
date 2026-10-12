import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Seo from '../components/shell/Seo'
import PageIntro from '../components/sections/PageIntro'
import Spectrum from '../components/building/Spectrum'
import Portfolio, { matches } from '../components/building/Portfolio'
import UniqueRequirement from '../components/building/UniqueRequirement'
import Advantages from '../components/sections/Advantages'
import QuoteBand from '../components/sections/QuoteBand'
import { useScrollToId } from '../lib/useScrollToId'
import { buildingHero, buildingQuote, buildingTraits } from '../content/building'
import { products, productSlug } from '../content/products'

/* /building, rebuilt (Step 6.1).
 *
 * The first version was a black page with twelve long panels stacked one under
 * the next, and a sticky index beside them. The client did not like it: it was
 * long, every panel was the same, and the only motion was a fade. This is the
 * live products page's own shape -- a hero, a filterable grid of products, the
 * four benefit blocks, "Have a Unique Requirement?" -- built as a product
 * portfolio:
 *
 *   hero      white, with the twelve products as a strip of twelve colours
 *   portfolio category and stage filters, and twelve cards that re-flow
 *   in every  the four boxes
 *   statement the studio model, lit as it is scrolled
 *   close     "Have a Unique Requirement?"
 *
 * The filters and the strip are one control, so their state lives here: choosing
 * a block in the strip clears the filters and takes you to that product's card,
 * and a link from anywhere else to `/building#crm` lands on the card and makes it
 * flash. */
export default function Building() {
  const [cat, setCat] = useState('All')
  const [stage, setStage] = useState('all')
  const [flash, setFlash] = useState(null)
  const scrollTo = useScrollToId()
  const location = useLocation()

  const visible = useMemo(
    () => new Set(products.filter((p) => matches(p, cat, stage)).map((p) => p.name)),
    [cat, stage],
  )

  const ping = useCallback((slug) => {
    setFlash(slug)
    const t = setTimeout(() => setFlash(null), 2600)
    return () => clearTimeout(t)
  }, [])

  /* From the strip: show everything (the card may be filtered out), wait for the
     grid to settle, go there, flash it. */
  const jump = useCallback(
    (slug) => {
      const filtered = cat !== 'All' || stage !== 'all'
      setCat('All')
      setStage('all')
      setTimeout(() => {
        scrollTo(null, slug)
        ping(slug)
      }, filtered ? 620 : 0)
    },
    [cat, stage, scrollTo, ping],
  )

  /* Arriving by a link such as /building#pos: the scroll is ScrollToTop's; the
     flash is ours. */
  useEffect(() => {
    const slug = decodeURIComponent(location.hash.slice(1))
    if (!slug || !products.some((p) => productSlug(p) === slug)) return undefined
    const t = setTimeout(() => ping(slug), 700)
    return () => clearTimeout(t)
  }, [location.hash, ping])

  return (
    <div>
      <Seo
        title="Products"
        description="Twelve white-label SaaS products from Akronix: CRM, HRMS, ERP, Inventory, POS, AI Assistant and six more. Six are in development, none has shipped. Request early access."
      />
      <PageIntro hero={buildingHero}>
        <Spectrum visible={visible} onSelect={jump} />
      </PageIntro>
      <Portfolio cat={cat} setCat={setCat} stage={stage} setStage={setStage} flash={flash} />
      <Advantages {...buildingTraits} four index="02" tone="mist" />
      <QuoteBand lines={buildingQuote.lines} cta={buildingQuote.cta} label="The studio model" index="03" />
      <UniqueRequirement />
    </div>
  )
}
