import pl from "./translations/pl.json"
import en from "./translations/en.json"

export { pl, en }

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
}

/**
 * Product template blocks
 *
 * Blocks built by Slack Block Kit:
 * https://api.slack.com/reference/block-kit/blocks
 */
export const templateBlocks = [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "{{translations.header.title}}",
      emoji: true,
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Open in Panel",
        },
        url: `/app/products/{{data.product.id}}`,
        style: "primary",
      },
    ],
  },
  {
    type: "divider",
  },
]
