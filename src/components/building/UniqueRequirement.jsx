import CtaBand from '../sections/CtaBand'
import { buildingUnique } from '../../content/building'

/* The live products page closes on "Have a Unique Requirement?", and so does
   this one, in the same place, straight before the footer. */
export default function UniqueRequirement() {
  return <CtaBand {...buildingUnique} />
}
