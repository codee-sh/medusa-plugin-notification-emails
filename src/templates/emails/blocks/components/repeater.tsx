import { BlockRenderer } from "../index"

/**
 * RepeaterBlock - Iterates over an array and renders blocks for each item
 *
 * Example:
 * {
 *   type: "repeater",
 *   props: {
 *     arrayPath: "items",
 *     blocks: [
 *       { type: "text", props: { text: "{{label}}" } }
 *     ],
 *     separator: { type: "separator" } // optional
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
    blocks: any[] // Blocks rendered for each item
    separator?: any // Optional separator between items
  }
  data: any // Event data (used to retrieve the array)
}) {
  const array = props.blocks

  return <BlockRenderer blocks={array} data={data} />
}
