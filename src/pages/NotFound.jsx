import { Link } from 'react-router-dom'
import { Body, H1, Mark, Section } from '../components/primitives'
import { RollText } from '../components/ui/RollText'

export default function NotFound() {
  return (
    <Section>
      <Mark as="p">Error 404</Mark>
      <H1 className="mt-5">That page isn&rsquo;t here.</H1>
      <Body className="mt-6 text-ink-2">
        It may have been part of the old site.{' '}
        <Link
          to="/"
          className="group/roll inline-block underline decoration-signal decoration-2 underline-offset-4"
        >
          <RollText>Back to the homepage</RollText>
        </Link>
        .
      </Body>
    </Section>
  )
}
