import { BlockRenderer } from "../index"

/**
 * RepeaterBlock - Iterates over an array and renders blocks for each item
 *
 * Example:
 * {
 *   type: "repeater",
 *   props: {
 *     arrayPath: "items",
 *     itemBlocks: [
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
    itemBlocks: any[] // Blocks rendered for each item
    separator?: any // Optional separator between items
  }
  data: any // Event data (used to retrieve the array)
}) {
  // Retrieve array from data
  const array = props.itemBlocks

  return <BlockRenderer blocks={array} data={data} />
}
