import {
  formatDate,
  getFormattedAddress,
  getLocaleAmount,
  getTotalCaptured,
} from "../index"

/**
 * Transform raw order data from API to email template format
 *
 * @param order - Raw order data from Medusa API
 * @param localeCode - Locale code for formatting (default: "pl")
 * @returns Transformed order data ready for email templates
 */
export function transformOrderData(
  order: any,
  localeCode: string = "pl"
): any {
  const shippingAddressText = getFormattedAddress({
    address: order.shipping_address,
  }).join("<br/>")
  const billingAddressText = getFormattedAddress({
    address: order.billing_address,
  }).join("<br/>")

  const transformedOrder = {
    ...order,
    transformed: {
      order_number: `#${order.display_id}`,
      order_date: formatDate({
        date: order.created_at,
        includeTime: true,
        localeCode,
      }),
      ...(order.updated_at && {
        completedDate: formatDate({
          date: order.updated_at,
          includeTime: true,
          localeCode,
        }),
      }),
      total_amount:
        order.items?.reduce(
          (acc: number, item: any) =>
            acc +
            (item.variant?.prices?.[0]?.amount || 0) *
              item.quantity,
          0
        ) || 0,
      items:
        order.items?.map((item: any) => ({
          thumbnail: item.thumbnail,
          title: item.title,
          quantity: item.quantity,
          price: getLocaleAmount(
            item.unit_price,
            order.currency_code
          ),
        })) || [],
      shipping_address_text: shippingAddressText,
      billing_address_text: billingAddressText,
      summary: {
        total: getLocaleAmount(
          order.summary?.original_order_total || 0,
          order.currency_code
        ),
        paid_total: getLocaleAmount(
          getTotalCaptured(order.payment_collections || []),
          order.currency_code
        ),
        tax_total: getLocaleAmount(
          order.tax_total || 0,
          order.currency_code
        ),
        discount_total: getLocaleAmount(
          order.discount_total || 0,
          order.currency_code
        ),
      },
    },
  }

  return transformedOrder
}
