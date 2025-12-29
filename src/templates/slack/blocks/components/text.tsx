import { SlackBlock } from "../../types"

/**
 * TextBlock - Custom text block that converts to Slack section block
 * 
 * This is a convenience block that converts to a section block with text
 * 
 * @example
 * {
 *   type: "text",
 *   props: {
 *     text: "Order {{data.order.id}} has been placed",
 *     type: "mrkdwn"
 *   }
 * }
 */
export function TextBlock({
  props,
}: {
  props: {
    text: string
    type?: "plain_text" | "mrkdwn"
  }
}): SlackBlock {
  const textType = props.type || "mrkdwn"

  return {
    type: "section",
    text: {
      type: textType,
      text: props.text,
      ...(textType === "plain_text" && { emoji: true }),
    },
  }
}

