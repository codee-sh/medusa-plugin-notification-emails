import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import { renderTemplate } from "../templates/emails"
import { TEMPLATES_NAMES } from "../templates/emails/types"
import { transformContext } from "../utils/transforms"
import { getPluginOptions } from "../utils/plugins"
import { getOrderByIdWorkflow } from "../workflows/order/get-order-by-id"
  
export default async function orderPlacedEmailsHandler({
  event: { data: { id, trigger_type } },
  container,
}: SubscriberArgs<{ id: string, trigger_type: string }>) {
  const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification-emails")

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const triggerType = trigger_type || 'system'

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
    trigger_type: triggerType,
    resource_id: id,
    resource_type: "order",
    data: templateData,
    content: {
      subject: subject,
      html,
      text,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
