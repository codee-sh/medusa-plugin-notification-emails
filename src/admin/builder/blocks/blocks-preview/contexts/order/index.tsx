import { useState } from "react"
import { Select, Text } from "@medusajs/ui"
import { useOrders } from "../../../../../../hooks/api/orders"
import { OrderContext } from "./order"

export const OrderContextContainer = ({ contextType, templateId }: { contextType: string, templateId: string }) => {
  const [selectedOrder, setSelectedOrder] =
    useState<string>("")

  const { data: orders, isLoading: isOrdersLoading } =
    useOrders({
      fields: "id,display_id",
      enabled: true,
    })

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <Text size="xsmall" className="w-1/4 text-ui-fg-subtle">
          Select order
        </Text>
        <div className="w-full">
          <Select
            value={selectedOrder}
            onValueChange={(value) => setSelectedOrder(value)}
            disabled={isOrdersLoading}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select an order" />
            </Select.Trigger>
            <Select.Content>
              {orders?.orders?.map((order: any) => (
                <Select.Item key={order.id} value={order.id}>
                  #{order.display_id}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>
      {selectedOrder && (
        <OrderContext contextType={contextType} templateId={templateId} orderId={selectedOrder} />
      )}
    </>
  )
}
