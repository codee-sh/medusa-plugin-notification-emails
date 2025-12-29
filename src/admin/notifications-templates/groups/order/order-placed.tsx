import { useEffect, useState } from "react";
import { Alert } from "@medusajs/ui"
import { useOrder } from "../../../../hooks/api/orders";
import { usePreview } from "../../../../hooks/api/preview";
import { TEMPLATES_NAMES } from "../../../../templates/emails";

export const OrderPlacedTemplate = ({ orderId }: { orderId: string }) => {
  const [context, setContext] = useState<any>(null);
  const [previewContext, setPreviewData] = useState<any>(null);

  const { data: order, isLoading: isOrderLoading } = useOrder({
    order_id: orderId,
    enabled: !!orderId
  });

  useEffect(() => {
    if (order?.display_id) {
      setContext({
        order: order
      });
    }
  }, [order]);

  const { data: preview, isLoading: isPreviewLoading } = usePreview({
    templateName: TEMPLATES_NAMES.ORDER_PLACED,
    context: context,
    contextType: "order",
    locale: "pl",
    enabled: !!context,
    extraKey: [context, orderId]
  });

  useEffect(() => {
    if (isOrderLoading) {
      setPreviewData(null);
    }
  }, [isOrderLoading]);

  useEffect(() => {
    if (preview) {
      setPreviewData(preview);
    }
  }, [preview]);

  return (
    <div className="px-6 py-4">
      {isOrderLoading && <Alert variant="info">Loading order {orderId}...</Alert>}
      {previewContext && <div className="px-6 py-4">
          <iframe
            srcDoc={previewContext?.html || ""}
            style={{ width: '100%', border: 'none', minHeight: '600px' }}
            sandbox="allow-same-origin"
          />
      </div>}
    </div>
  );
};
