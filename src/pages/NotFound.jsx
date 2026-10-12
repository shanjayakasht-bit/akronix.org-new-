import Seo from '../components/shell/Seo'
import { Container } from '../components/primitives'
import { Band } from '../components/ui/Band'
import { Button } from '../components/ui/Button'
import { Label } from '../components/ui/Pill'

export default function NotFound() {
  return (
    <Band tone="light" className="min-h-[60svh]">
      <Seo title="Page not found" />
      <Container wide>
        <Label index="404">Not found</Label>
        <h1 className="mt-8 font-light text-[clamp(3rem,1.5rem+7vw,8rem)] leading-[0.95] tracking-[-0.045em] text-ink">
          That page isn&rsquo;t here<span className="text-brand">.</span>
        </h1>
        <p className="mt-8 max-w-[44ch] font-sans text-lede text-ink-2">
          It may have been part of the old site, or the address may have a typo. The pages that do exist are in the menu above.
        </p>
        <div className="mt-10">
          <Button to="/">Back to the homepage</Button>
        </div>
      </Container>
    </Band>
  )
}
