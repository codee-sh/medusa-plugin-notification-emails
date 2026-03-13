import { Heading } from "@medusajs/ui"
import { resolveBlockDefinition } from "../../utils/block-ui-resolver"

export function BlockItemWrapper(props) {
  const { index, blocks, field } = props
  const definition = resolveBlockDefinition(
    blocks,
    field.type
  )

  return (
    <>
      <Heading level="h2" className="mb-2">Block title: {definition?.label || field.type} <span className="text-ui-fg-subtle text-xs">(position: {index})</span></Heading>
      
      {props.children}
    </>
  )
}
