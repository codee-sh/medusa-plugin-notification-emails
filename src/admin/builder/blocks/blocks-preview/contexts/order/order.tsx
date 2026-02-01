import { useEffect, useState } from "react"
import { Alert } from "@medusajs/ui"
import { useOrder } from "../../../../../../hooks/api/orders"
import { BlocksPreview } from "../../blocks-preview"

export const OrderContext = ({
  contextType,
  templateId,
  orderId
}: {
  contextType: string,
  templateId: string,
  orderId: string
}) => {
  const [context, setContext] = useState<any>(null)

  const { data: order, isLoading: isOrderLoading } =
    useOrder({
      order_id: orderId,
      enabled: !!orderId,
    })

  useEffect(() => {
    if (order?.display_id) {
      setContext({
        order: order,
      })
    }
  }, [order])

  return (
    <div className="px-6 py-4">
      {isOrderLoading && (
        <Alert variant="info">
          Loading order {orderId}...
        </Alert>
      )}
      {context && (
        <BlocksPreview contextType={contextType} templateId={templateId} context={context} />
      )}
    </div>
  )
}
