// Attributes available in rules (without technical relations with *)
// These attributes are displayed in the UI for creating conditions in automations
export const ORDER_ATTRIBUTES = [
  // Basic fields
  {
    value: "order.id",
    label: "ID",
    description: "Unique identifier of the order",
  },
  {
    value: "order.display_id",
    label: "Display ID",
    description:
      "Human-readable order number displayed to customers",
  },
  {
    value: "order.custom_display_id",
    label: "Custom Display ID",
    description:
      "Custom order identifier set by the merchant",
  },
  {
    value: "order.status",
    label: "Status",
    description: "Current status of the order",
  },
  {
    value: "order.locale",
    label: "Locale",
    description:
      "Locale code for the order (language and region)",
  },
  {
    value: "order.email",
    label: "Email",
    description:
      "Customer email address associated with the order",
  },
  {
    value: "order.currency_code",
    label: "Currency Code",
    description: "ISO 4217 currency code for the order",
  },
  {
    value: "order.region_id",
    label: "Region ID",
    description: "Unique identifier of the region",
  },
  {
    value: "order.created_at",
    label: "Created At",
    description:
      "Date and time when the order was created (ISO 8601 format)",
  },
  {
    value: "order.updated_at",
    label: "Updated At",
    description:
      "Date and time when the order was last updated (ISO 8601 format)",
  },
  // Totals
  {
    value: "order.total",
    label: "Total",
    description:
      "Total amount of the order including taxes, shipping, and discounts",
  },
  {
    value: "order.subtotal",
    label: "Subtotal",
    description:
      "Subtotal amount before taxes and shipping",
  },
  {
    value: "order.tax_total",
    label: "Tax Total",
    description:
      "Total amount of taxes applied to the order",
  },
  {
    value: "order.original_total",
    label: "Original Total",
    description:
      "Original total amount before any changes or adjustments",
  },
  {
    value: "order.original_subtotal",
    label: "Original Subtotal",
    description:
      "Original subtotal before any changes or adjustments",
  },
  {
    value: "order.original_tax_total",
    label: "Original Tax Total",
    description:
      "Original tax total before any changes or adjustments",
  },
  {
    value: "order.discount_total",
    label: "Discount Total",
    description:
      "Total amount of discounts applied to the order",
  },
  {
    value: "order.discount_tax_total",
    label: "Discount Tax Total",
    description:
      "Tax amount on discounts applied to the order",
  },
  // Shipping (specific fields, not *)
  {
    value: "order.shipping_methods.amount",
    label: "Shipping Methods Amount",
    description:
      "Total shipping cost for all shipping methods. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.subtotal",
    label: "Shipping Methods Subtotal",
    description:
      "Shipping subtotal before taxes. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.tax_total",
    label: "Shipping Methods Tax Total",
    description:
      "Tax amount on shipping. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.original_total",
    label: "Shipping Methods Original Total",
    description:
      "Original shipping total before adjustments. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.original_subtotal",
    label: "Shipping Methods Original Subtotal",
    description:
      "Original shipping subtotal before adjustments. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.original_tax_total",
    label: "Shipping Methods Original Tax Total",
    description:
      "Original shipping tax total before adjustments. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.discount_total",
    label: "Shipping Methods Discount Total",
    description:
      "Total shipping discounts applied. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.discount_subtotal",
    label: "Shipping Methods Discount Subtotal",
    description:
      "Shipping discount subtotal. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  {
    value: "order.shipping_methods.discount_tax_total",
    label: "Shipping Methods Discount Tax Total",
    description:
      "Tax amount on shipping discounts. This is an array - operator 'eq' checks if ANY value matches",
    type: "array",
    isRelation: true,
    relationType: "shipping_methods",
  },
  // Summary (specific fields)
  {
    value: "order.summary.total",
    label: "Summary Total",
    description:
      "Summary total amount including all adjustments",
  },
  {
    value: "order.summary.subtotal",
    label: "Summary Subtotal",
    description: "Summary subtotal amount",
  },
  {
    value: "order.summary.tax_total",
    label: "Summary Tax Total",
    description: "Summary tax total amount",
  },
  {
    value: "order.summary.discount_total",
    label: "Summary Discount Total",
    description: "Summary discount total amount",
  },
  {
    value: "order.summary.original_order_total",
    label: "Summary Original Order Total",
    description:
      "Summary original order total before adjustments",
  },
  {
    value: "order.summary.current_order_total",
    label: "Summary Current Order Total",
    description:
      "Summary current order total after all adjustments",
  },
  {
    value: "order.summary.paid_total",
    label: "Summary Paid Total",
    description:
      "Total amount that has been paid for this order",
  },
  {
    value: "order.summary.refunded_total",
    label: "Summary Refunded Total",
    description:
      "Total amount that has been refunded for this order",
  },
  {
    value: "order.summary.accounting_total",
    label: "Summary Accounting Total",
    description: "Total amount for accounting purposes",
  },
  {
    value: "order.summary.credit_line_total",
    label: "Summary Credit Line Total",
    description:
      "Total amount from credit lines applied to this order",
  },
  {
    value: "order.summary.transaction_total",
    label: "Summary Transaction Total",
    description:
      "Total amount of all transactions for this order",
  },
  {
    value: "order.summary.pending_difference",
    label: "Summary Pending Difference",
    description:
      "Difference between expected and actual payment amounts",
  },
  // Customer relation
  {
    value: "order.customer.id",
    label: "Customer ID",
    description:
      "Unique identifier of the customer who placed the order",
  },
  {
    value: "order.customer.email",
    label: "Customer Email",
    description:
      "Email address of the customer who placed the order",
  },
  {
    value: "order.customer.first_name",
    label: "Customer First Name",
    description: "First name of the customer",
  },
  {
    value: "order.customer.last_name",
    label: "Customer Last Name",
    description: "Last name of the customer",
  },
  // Sales channel relation
  {
    value: "order.sales_channel.id",
    label: "Sales Channel ID",
    description: "Unique identifier of the sales channel",
  },
  {
    value: "order.sales_channel.name",
    label: "Sales Channel Name",
    description: "Name of the sales channel",
  },
  // Shipping address
  {
    value: "order.shipping_address.first_name",
    label: "Shipping First Name",
    description: "First name for shipping address",
  },
  {
    value: "order.shipping_address.last_name",
    label: "Shipping Last Name",
    description: "Last name for shipping address",
  },
  {
    value: "order.shipping_address.address_1",
    label: "Shipping Address 1",
    description: "Primary street address for shipping",
  },
  {
    value: "order.shipping_address.city",
    label: "Shipping City",
    description: "City for shipping address",
  },
  {
    value: "order.shipping_address.country_code",
    label: "Shipping Country Code",
    description:
      "ISO 3166-1 alpha-2 country code for shipping",
  },
  {
    value: "order.shipping_address.postal_code",
    label: "Shipping Postal Code",
    description: "Postal/ZIP code for shipping address",
  },
  // Billing address
  {
    value: "order.billing_address.first_name",
    label: "Billing First Name",
    description: "First name for billing address",
  },
  {
    value: "order.billing_address.last_name",
    label: "Billing Last Name",
    description: "Last name for billing address",
  },
  {
    value: "order.billing_address.address_1",
    label: "Billing Address 1",
    description: "Primary street address for billing",
  },
  {
    value: "order.billing_address.city",
    label: "Billing City",
    description: "City for billing address",
  },
  {
    value: "order.billing_address.country_code",
    label: "Billing Country Code",
    description:
      "ISO 3166-1 alpha-2 country code for billing",
  },
  {
    value: "order.billing_address.postal_code",
    label: "Billing Postal Code",
    description: "Postal/ZIP code for billing address",
  },
  // Items (specific fields, not *)
  {
    value: "order.items.id",
    label: "Item ID",
    description: "Unique identifier of the order item",
  },
  {
    value: "order.items.quantity",
    label: "Item Quantity",
    description: "Quantity of this item in the order",
  },
  {
    value: "order.items.title",
    label: "Item Title",
    description: "Title/name of the order item",
  },
  {
    value: "order.items.unit_price",
    label: "Item Unit Price",
    description: "Price per unit of this item",
  },
  {
    value: "order.items.variant.id",
    label: "Item Variant ID",
    description: "Unique identifier of the product variant",
  },
  {
    value: "order.items.variant.sku",
    label: "Item Variant SKU",
    description:
      "SKU (Stock Keeping Unit) of the product variant",
  },
  {
    value: "order.items.product.id",
    label: "Item Product ID",
    description: "Unique identifier of the product",
  },
  {
    value: "order.items.product.title",
    label: "Item Product Title",
    description: "Title/name of the product",
  },
  // Payment collections
  {
    value: "order.payment_collections.id",
    label: "Payment Collection ID",
    description:
      "Unique identifier of the payment collection",
  },
  {
    value: "order.payment_collections.status",
    label: "Payment Collection Status",
    description:
      "Status of payment collections for this order",
  },
  {
    value: "order.payment_collections.amount",
    label: "Payment Collection Amount",
    description: "Amount of the payment collection",
  },
  // Fulfillments
  {
    value: "order.fulfillments.id",
    label: "Fulfillment ID",
    description: "Unique identifier of the fulfillment",
  },
  {
    value: "order.fulfillments.status",
    label: "Fulfillment Status",
    description: "Status of fulfillments for this order",
  },
]

// Fields for use in query.graph() - includes technical relations with *
// These fields are required for correct totals calculation by OrderModuleService
// ORDER_QUERY_FIELDS contains all fields from ORDER_ATTRIBUTES plus technical relations
export const ORDER_QUERY_FIELDS = [
  // Basic fields from ORDER_ATTRIBUTES
  ...ORDER_ATTRIBUTES.map((attr) => attr.value),

  // Technical relations required for totals calculation
  // These fields are not available in UI rules, but are needed for correct data retrieval
  "order.items.*",
  "order.items.tax_lines.*",
  "order.items.adjustments.*",
  "order.shipping_methods.*",
  "order.shipping_methods.tax_lines.*",
  "order.shipping_methods.adjustments.*",
  "order.fulfillments.*",
  "order.credit_lines.*",
  "order.summary.*",
  "order.payment_collections.*",
]
