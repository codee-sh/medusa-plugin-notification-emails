import { Heading } from "@medusajs/ui"
import { resolveBlockDefinition } from "../../utils/block-ui-resolver"

export function BlockItemWrapper(props) {
  const { index, blocks, field } = props
  const definition = resolveBlockDefinition(
    blocks,
    field.type
  )

  return (
    <div className="w-full rounded-md border border-ui-border-base bg-ui-bg-subtle">
      <div className="flex items-center justify-between border-b border-ui-border-base px-3 py-2 bg-ui-bg-base">
        <Heading level="h2" className="text-sm">
          {definition?.label || field.type}
        </Heading>
        <span className="text-ui-fg-subtle text-xs">
          #{index + 1}
        </span>
      </div>
      <div className="px-3 py-3">{props.children}</div>
    </div>
  )
}
