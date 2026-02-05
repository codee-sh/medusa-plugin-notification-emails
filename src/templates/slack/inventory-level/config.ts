import pl from "./translations/pl.json"
import en from "./translations/en.json"

export { pl, en }

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
}

/**
 * Inventory level template blocks
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
    },
  },
  {
    type: "section",
    fieldsPath: "inventory_level.stock_locations",
    fieldTemplate: {
      type: "plain_text",
      text: "{{data.inventory_level.stock_locations.name}}",
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
        url: `{{data.backend_url}}/app/inventory/{{data.inventory_level.inventory_item.id}}`,
        style: "primary",
      },
    ],
  },
]
