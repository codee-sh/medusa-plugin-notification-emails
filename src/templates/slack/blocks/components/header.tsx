import { SlackBlock } from "../../types"

/**
 * HeaderBlock - Slack header block component
 * 
 * Maps to Slack API header block: https://api.slack.com/reference/block-kit/blocks#header
 * 
 * @example
 * {
 *   type: "header",
 *   props: {
 *     text: "{{translations.header.title}}",
 *     emoji: true
 *   }
 * }
 */
export function HeaderBlock({
  props,
}: {
  props: {
    text: string
    emoji?: boolean
  }
}): SlackBlock {
  return {
    type: "header",
    text: {
      type: "plain_text",
      text: props.text,
      emoji: props.emoji !== false, // Default to true if not specified
    },
  }
}

