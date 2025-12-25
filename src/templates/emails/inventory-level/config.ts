import pl from "./translations/pl.json";
import en from "./translations/en.json";

export { pl, en };

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
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
        {
          id: "text-1",
          type: "text",
          props: {
            value: "{{translations.headerDescription}}",
          },
        },
      ],
    },
  },
  {
    type: "section",
    id: "section-2",
    props: {
      blocks: [
        {
          id: "row-1",
          type: "row",
          props: {
            label: "{{translations.labels.inventoryLevelId}}",
            value: "{{data.inventory_level.id}}",
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
            label: "{{translations.labels.inventoryLevelLocation}}",
            value: "{{data.inventory_level.location_id}}",
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
            label: "{{translations.labels.inventoryLevelStockedQuantity}}",
            value: "{{data.inventory_level.stocked_quantity}}",
          },
        },
        {
          id: "separator-3",
          type: "separator",
        },
        {
          id: "row-4",
          type: "row",
          props: {
            label: "{{translations.labels.inventoryLevelReservedQuantity}}",
            value: "{{data.inventory_level.reserved_quantity}}",
          },
        },
        {
          id: "separator-4",
          type: "separator",
        },
        {
          id: "row-5",
          type: "row",
          props: {
            label: "{{translations.labels.inventoryLevelAvailableQuantity}}",
            value: "{{data.inventory_level.available_quantity}}",
          },
        },
      ],
    },
  },
  {
    type: "section",
    id: "section-3",
    props: {
      blocks: [
        {
          id: "text-2",
          type: "text",
          props: {
            value: "{{translations.footer}}",
          },
        },
      ],
    },
  },
];

