import { SlackBlock } from "../../types"

/**
 * SectionBlock - Slack section block component
 * 
 * Maps to Slack API section block: https://api.slack.com/reference/block-kit/blocks#section
 * 
 * @example
 * // With fields
 * {
 *   type: "section",
 *   props: {
 *     fields: [
 *       { label: "Order ID", value: "{{data.order.id}}" },
 *       { label: "Total", value: "{{data.order.total}}" }
 *     ]
 *   }
 * }
 * 
 * @example
 * // With text
 * {
 *   type: "section",
 *   props: {
 *     text: "Order {{data.order.id}} has been placed"
 *   }
 * }
 */
export function SectionBlock({
  props,
}: {
  props: {
    text?: string
    fields?: Array<{
      label?: string
      value?: string
    }>
  }
}): SlackBlock {
  const block: SlackBlock = {
    type: "section",
  }

  // If fields are provided, use fields
  if (props.fields && props.fields.length > 0) {
    block.fields = props.fields.map((field) => ({
      type: "mrkdwn",
      text: field.label && field.value
        ? `*${field.label}*\n${field.value}`
        : field.value || field.label || "",
    }))
  }
  // If text is provided, use text
  else if (props.text) {
    block.text = {
      type: "mrkdwn",
      text: props.text,
    }
  }

  return block
}

