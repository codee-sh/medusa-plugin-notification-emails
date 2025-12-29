import { SlackBlock } from "../../types"

/**
 * ActionsBlock - Slack actions block component
 * 
 * Maps to Slack API actions block: https://api.slack.com/reference/block-kit/blocks#actions
 * 
 * @example
 * {
 *   type: "actions",
 *   props: {
 *     buttons: [
 *       {
 *         text: "Open in Panel",
 *         url: "{{backendUrl}}/app/orders/{{data.order.id}}",
 *         style: "primary"
 *       }
 *     ]
 *   }
 * }
 */
export function ActionsBlock({
  props,
}: {
  props: {
    buttons?: Array<{
      text: string
      url?: string
      style?: "primary" | "danger" | "default"
    }>
  }
}): SlackBlock {
  if (!props.buttons || props.buttons.length === 0) {
    // Return empty actions block if no buttons
    return {
      type: "actions",
      elements: [],
    }
  }

  return {
    type: "actions",
    elements: props.buttons.map((button) => ({
      type: "button",
      text: {
        type: "plain_text",
        text: button.text,
      },
      ...(button.url && { url: button.url }),
      ...(button.style && button.style !== "default" && { style: button.style }),
    })),
  }
}

