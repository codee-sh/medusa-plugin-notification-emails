import { defaultTheme } from "../src/templates/shared/theme";
import { renderTemplateSync } from "../src/templates/emails";

export const orderCompletedMockData: any = {
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
      title: "Test Product 1",
      quantity: 2,
      price: "50.00"
    },
    {
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

