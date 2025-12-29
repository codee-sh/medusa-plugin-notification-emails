import pl from "./translations/pl.json";
import en from "./translations/en.json";

export { pl, en };

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
};

/**
 * Order placed template blocks
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
    id: "separator-1",
    type: "separator",
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
            value: "{{data.order.sales_channel.name}}",
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
            value: "{{data.order.transformed.order_number}}",
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
            value: "{{data.order.transformed.order_date}}",
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
          id: "repeater-1",
          type: "repeater",
          props: {
            arrayPath: "order.transformed.items",
            itemBlocks: [
              {
                id: "product-item",
                type: "product-item",
                props: {
                  label: "{{translations.labels.product}}",
                  thumbnail: "{{data.order.transformed.items.thumbnail}}",
                  value: "{{data.order.transformed.items.title}} - {{data.order.transformed.items.quantity}}x {{data.order.transformed.items.price}}",
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
            value: "{{data.order.transformed.shipping_address_text}}",
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
    id: "section-5",
    props: {
      blocks: [
        {
          id: "row-4",
          type: "row",
          props: {
            label: "{{translations.labels.discountTotal}}",
            value: "{{data.order.transformed.summary.discount_total}}",
          },
        },
        {
          id: "separator-3",
          type: "separator",
        },
        {
          id: "row-5",
          type: "row",
          props: {
            label: "{{translations.labels.orderTotal}}",
            value: "{{data.order.transformed.summary.total}}",
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
            label: "{{translations.labels.paidTotal}}",
            value: "{{data.order.transformed.summary.paid_total}}",
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
            label: "{{translations.labels.taxTotal}}",
            value: "{{data.order.transformed.summary.tax_total}}",
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

