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
            label: "{{translations.labels.salesChannel}}",
            value: "{{data.sales_channel.name}}",
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
            label: "{{translations.labels.orderNumber}}",
            value: "{{data.orderNumber}}",
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
            label: "{{translations.labels.orderDate}}",
            value: "{{data.orderDate}}",
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
            label: "{{translations.labels.completedDate}}",
            value: "{{data.completedDate}}",
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
          id: "heading-2",
          type: "heading",
          props: {
            value: "{{translations.labels.products}}",
          },
        },
        {
          id: "repeater-product",
          type: "repeater",
          props: {
            arrayPath: "items",
            itemBlocks: [
              {
                id: "product-item-1",
                type: "product-item",
                props: {
                  label: "{{translations.labels.product}}",
                  thumbnail: "{{data.items.thumbnail}}",
                  value: "{{data.items.title}} - {{data.items.quantity}}x {{data.items.price}}",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    type: "section",
    id: "section-4",
    props: {
      blocks: [
        {
          id: "heading-3",
          type: "heading",
          props: {
            value: "{{translations.labels.shippingAddress}}",
          },
        },
        {
          id: "text-2",
          type: "text",
          props: {
            value: "{{data.shippingAddress}}",
          },
        },
      ],
    },
  },
  {
    type: "section",
    id: "section-5",
    props: {
      blocks: [
        {
          id: "row-5",
          type: "row",
          props: {
            label: "{{translations.labels.discountTotal}}",
            value: "{{data.summary.discount_total}}",
          },
        },
        {
          id: "separator-4",
          type: "separator",
        },
        {
          id: "row-6",
          type: "row",
          props: {
            label: "{{translations.labels.orderTotal}}",
            value: "{{data.summary.total}}",
          },
        },
        {
          id: "separator-5",
          type: "separator",
        },
        {
          id: "row-7",
          type: "row",
          props: {
            label: "{{translations.labels.paidTotal}}",
            value: "{{data.summary.paid_total}}",
          },
        },
        {
          id: "separator-6",
          type: "separator",
        },
        {
          id: "row-8",
          type: "row",
          props: {
            label: "{{translations.labels.taxTotal}}",
            value: "{{data.summary.tax_total}}",
          },
        },
      ],
    },
  },
  {
    type: "section",
    id: "section-6",
    props: {
      blocks: [
        {
          id: "text-3",
          type: "text",
          props: {
            value: "{{translations.footer}}",
          },
        },
      ],
    },
  },
];

