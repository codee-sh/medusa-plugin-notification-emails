import { Section } from "@react-email/components"
import { BlockRenderer } from "../index"

/**
 * GroupBlock - Container for other blocks with optional title and styles
 *
 */
export function GroupBlock({
  id,
  props,
  data,
}: {
  id?: string
  props: any
  data?: any
}) {
  return (
    <Section className="m-0 p-0">
      <BlockRenderer
        blocks={props.blocks || []}
        data={data}
      />
    </Section>
  )
}
