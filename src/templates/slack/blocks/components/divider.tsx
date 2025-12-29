import { SlackBlock } from "../../types"

/**
 * DividerBlock - Slack divider block component
 * 
 * Maps to Slack API divider block: https://api.slack.com/reference/block-kit/blocks#divider
 * 
 * @example
 * {
 *   type: "divider"
 * }
 */
export function DividerBlock(): SlackBlock {
  return {
    type: "divider",
  }
}

