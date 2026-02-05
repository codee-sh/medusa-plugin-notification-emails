import pl from "./translations/pl.json"
import en from "./translations/en.json"

export { pl, en }

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
}

/**
 * Order archived template blocks
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
          text: "{{translations.actions.openInPanel}}",
        },
        url: `{{data.backendUrl}}/app/orders/{{data.order.id}}`,
        style: "primary",
      },
    ],
  },
  {
    type: "divider",
  },
]
