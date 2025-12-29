import { SlackBlock } from "../types"
import { HeaderBlock } from "./components/header"
import { SectionBlock } from "./components/section"
import { ActionsBlock } from "./components/actions"
import { DividerBlock } from "./components/divider"
import { TextBlock } from "./components/text"
import { RepeaterBlock } from "./components/repeater"

/**
 * SlackBlockRenderer - Renders Slack blocks from block configuration
 * 
 * Converts block configuration (with props) to SlackBlock[] format
 * 
 * @param blocks - Array of block configurations
 * @param data - Event data for interpolation
 * @returns Array of SlackBlock objects ready for Slack API
 */
export function SlackBlockRenderer({
  blocks,
  data,
}: {
  blocks: any[]
  data?: any
}): SlackBlock[] {
  const result: SlackBlock[] = []

  for (const block of blocks) {
    const blockKey = block.id || `block-${blocks.indexOf(block)}`

    switch (block.type) {
      case "header":
        result.push(
          HeaderBlock({
            props: block.props,
          })
        )
        break

      case "section":
        result.push(
          SectionBlock({
            props: block.props,
          })
        )
        break

      case "actions":
        result.push(
          ActionsBlock({
            props: block.props,
          })
        )
        break

      case "divider":
        result.push(DividerBlock())
        break

      case "text":
        result.push(
          TextBlock({
            props: block.props,
          })
        )
        break

      case "repeater":
        if (!data) {
          console.warn("RepeaterBlock requires data prop")
          break
        }
        // RepeaterBlock returns an array of blocks
        // Pass renderBlock function to avoid circular dependency
        const repeaterBlocks = RepeaterBlock({
          props: block.props,
          data: data,
          renderBlock: (blocks, itemData) => {
            // Recursively render blocks for each item
            return SlackBlockRenderer({ blocks, data: itemData })
          },
        })
        result.push(...repeaterBlocks)
        break

      default:
        console.warn(`Unknown Slack block type: ${block.type}`)
        break
    }
  }

  return result
}

