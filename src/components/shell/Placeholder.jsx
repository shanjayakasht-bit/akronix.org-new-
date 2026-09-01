import { Body, H1, Section, StageMark } from '../primitives'

/* Deliberately unmistakable. These stand in until each page is written section
   by section with copy approved -- they are not draft content. */
export default function Placeholder({ title, children }) {
  return (
    <Section>
      <StageMark>Not built yet</StageMark>
      <H1 className="mt-5">{title}</H1>
      <Body className="mt-6 text-ink-2">{children}</Body>
    </Section>
  )
}
