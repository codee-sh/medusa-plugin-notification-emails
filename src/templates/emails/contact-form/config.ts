import pl from "./translations/pl.json"
import en from "./translations/en.json"
import de from "./translations/de.json"

export { pl, en, de }

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
  de: de,
}

/**
 * Contact form template blocks
 *
 */
export const templateBlocks = [
  {
    type: "section",
    id: "section-1",
    props: {
      blocks: [
        {
          id: "heading-1",
          type: "heading",
          props: {
            value: "{{translations.headerTitle}}",
          },
        },
      ],
    },
  },
  {
    type: "group",
    id: "group-1",
    props: {
      blocks: [
        {
          id: "section-1",
          type: "section",
          props: {
            blocks: [
              {
                id: "heading-1",
                type: "heading",
                props: {
                  value: "sss",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: "separator-1",
    type: "separator",
  },
  {
    type: "section",
    id: "section-1",
    props: {
      blocks: [
        {
          id: "row-1",
          type: "row",
          props: {
            label: "{{translations.labels.email}}",
            value: "{{data.contact_form.email}}",
          },
        },
        {
          id: "separator-1",
          type: "separator",
        },
        {
          id: "row-2",
          type: "row",
          props: {
            label: "{{translations.labels.phone}}",
            value: "{{data.contact_form.phone}}",
          },
        },
        {
          id: "separator-2",
          type: "separator",
        },
        {
          id: "row-3",
          type: "row",
          props: {
            label: "{{translations.labels.message}}",
            value: "{{data.contact_form.message}}",
          },
        },
      ],
    },
  },
]
