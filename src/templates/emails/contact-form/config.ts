import pl from "./translations/pl.json";
import en from "./translations/en.json";
import de from "./translations/de.json";

export { pl, en, de };

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
  de: de,
};

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
    type: "section",
    id: "section-1",
    props: {
      blocks: [
        {
          id: "row-1",
          type: "row",
          props: {
            label: "{{translations.labels.email}}",
            value: "{{data.email}}",
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
            value: "{{data.phone}}",
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
            value: "{{data.message}}",
          },
        },
        // {
        //   id: "repeater-1",
        //   type: "repeater",
        //   props: {
        //     arrayPath: "items",
        //     itemBlocks: [
        //       {
        //         id: "text-3",
        //         type: "text",
        //         props: {
        //           value: "{{data.items.label}} - {{data.items.value}} {{translations.email}}",
        //         },
        //       },
        //     ]
        //   },
        // },
      ],
    },
  },
];
