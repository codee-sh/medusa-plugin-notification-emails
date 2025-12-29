import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getOrderByIdWorkflow } from "../../../../workflows/order/get-order-by-id"
import { Modules } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/framework/utils"
import { transformContext } from "../../../../utils/transforms"
import { TEMPLATES_NAMES } from "../../../../templates/emails/types"
import { renderTemplate } from "../../../../templates/emails"
import { getPluginOptions } from "../../../../utils/plugins"

export async function POST(
  req: MedusaRequest<{ id: string }>,
  res: MedusaResponse
) {
  const container = req.scope
  const id = req.body?.id as string 
  
  const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification-emails")

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Order ID is required")
  }

  const { result: order } = await getOrderByIdWorkflow(container).run({
    input: {
      order_id: id,
    },
  })

  if (!order) {
    return
  }

  // Transform raw order data to email template format
  const templateData = transformContext("order", order, "pl")
  
  const templateName = TEMPLATES_NAMES.ORDER_PLACED

  const { html, text, subject } = await renderTemplate(
    templateName,
    templateData,
    { 
      locale: "pl",
      customTranslations: pluginOptions?.customTranslations?.[templateName]
    }
  )

  const result = await notificationModuleService.createNotifications({
    to: order.order.customer.email,
    channel: "email",
    template: templateName,
    trigger_type: "test-workflow",
    resource_id: id,
    resource_type: "order",
    data: templateData,
    content: {
      subject: subject,
      html,
      text,
    },
  })

  res.status(200).json(order)
}

