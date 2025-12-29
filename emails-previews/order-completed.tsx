import { defaultTheme } from "../src/templates/shared/theme";
import { renderTemplateSync } from "../src/templates/emails";

export const orderCompletedMockData: any = {
  order: {
    sales_channel: {
      name: "Test Sales Channel",
      description: "Test Sales Channel Description"
    },
    orderNumber: "1234567890",
    customerName: "Jan Kowalski",
    customerEmail: "jan@example.com",
    orderDate: "2021-01-01",
    completedDate: "2021-01-05",
    totalAmount: "100.00",
    currency_code: "pln",
    items: [
      {
        thumbnail: "",
        title: "Test Product 1",
        quantity: 10,
        price: "50.00"
      },
      {
        thumbnail: "https://placehold.co/150",
        title: "Test Product 2",
        quantity: 1,
        price: "100.00"
      }
    ],
    shippingAddress: "Test Shipping Address <br />Test Shipping Address 2",
    billingAddress: "Test Billing Address<br />Test Billing Address 2",
    orderUrl: "https://example.com/order/1234567890",
    summary: {
      total: "100.00",
      paid_total: "100.00",
      tax_total: "10.00",
      discount_total: "0.00"
    },
    transformed: {
      order_number: "1234567890",
      order_date: "2021-01-01",
      completed_date: "2021-01-05",
      total_amount: "100.00",
      currency_code: "pln",
      items: [
        {
          thumbnail: "https://placehold.co/150",
          title: "Test Product 1",
          quantity: 10,
          price: "50.00"
        },
        {
          thumbnail: "https://placehold.co/150",
          title: "Test Product 2",
          quantity: 1,
          price: "100.00"
        }
      ],
      shipping_address_text: "Test Shipping Address <br />Test Shipping Address 2",
      billing_address_text: "Test Billing Address<br />Test Billing Address 2",
      summary: {
        total: "100.00",
        paid_total: "100.00",
        tax_total: "10.00",
        discount_total: "0.00"
      }
    }
  }
};

export default function OrderCompleted() {
  const renderTemplate = renderTemplateSync(
    "order-completed",
    orderCompletedMockData,
    {
      locale: "pl",
      theme: defaultTheme,
    }
  );

  return renderTemplate.reactNode;
}

