import { BlockRenderer } from "../index"

/**
 * RepeaterBlock - Renders the blocks a repeater expanded to during interpolation
 *
 * Interpolation replaces `itemBlocks` with every item block for every item of the array at
 * `arrayPath`, or with `emptyBlocks` (none when not given) for an empty or missing array, so this
 * component only renders what it is given.
 *
 * Example:
 * {
 *   type: "repeater",
 *   props: {
 *     arrayPath: "items",
 *     itemBlocks: [
 *       { type: "text", props: { value: "{{data.items.label}}" } }
 *     ],
 *     emptyBlocks: [
 *       { type: "text", props: { value: "No items" } }
 *     ]
 *   }
 * }
 */
export function RepeaterBlock({
  id,
  props,
  data,
}: {
  id?: string
  props: {
    arrayPath: string // Path to array in data (e.g., "items", "order.items")
    itemBlocks?: any[] // Expanded blocks after interpolation
    emptyBlocks?: any[] // Blocks rendered for an empty array
  }
  data: any
}) {
  return (
    <BlockRenderer
      blocks={props.itemBlocks || []}
      data={data}
    />
  )
}
