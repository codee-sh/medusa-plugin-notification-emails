import { SlackBlock } from "../../types"
import { pickValueFromObject } from "../../../../utils"

/**
 * RepeaterBlock - Iterates over an array and renders blocks for each item
 * 
 * This block takes an array path and renders itemBlocks for each item in the array
 * 
 * @example
 * {
 *   type: "repeater",
 *   props: {
 *     arrayPath: "order.items",
 *     itemBlocks: [
 *       { type: "section", props: { text: "{{title}}" } }
 *     ],
 *     separator: { type: "divider" }
 *   }
 * }
 */
export function RepeaterBlock({
  props,
  data,
  renderBlock, // Function to render blocks (passed from SlackBlockRenderer to avoid circular dependency)
}: {
  props: {
    arrayPath: string
    itemBlocks: any[]  // Already interpolated itemBlocks from interpolateBlocks
    separator?: any
  }
  data: any
  renderBlock: (blocks: any[], itemData: any) => SlackBlock[]
}): SlackBlock[] {
  // Retrieve array from data
  const array = pickValueFromObject(props.arrayPath, data)

  if (!Array.isArray(array) || array.length === 0) {
    return []
  }

  const result: SlackBlock[] = []

  // Render blocks for each item
  array.forEach((item: any, index: number) => {
    // Render itemBlocks for this item
    const itemBlocks = renderBlock(props.itemBlocks, item)
    result.push(...itemBlocks)

    // Add separator between items (but not after last item)
    if (props.separator && index < array.length - 1) {
      const separatorBlock = renderBlock([props.separator], data) // Use main data for separator
      result.push(...separatorBlock)
    }
  })

  return result
}
