import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules, ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { renderTemplate } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"
import { TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails/types"
import { transformContext } from "@codee-sh/medusa-plugin-notification-emails/utils"
import { getPluginOptions } from "@codee-sh/medusa-plugin-notification-emails/utils/plugins"
  
export default async function orderPlacedEmailsHandler({
  event: { data: { id, trigger_type } },
  container,
}: SubscriberArgs<{ id: string, trigger_type: string }>) {
  const pluginOptions = getPluginOptions(container, "@codee-sh/medusa-plugin-notification-emails")

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const triggerType = trigger_type || 'system'

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Order ID is required")
  }

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "email",
      "created_at",
      "payment_collections.*",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
      "currency_code",
      "display_id",
      "sales_channel.name",
      "sales_channel.description",
      "shipping_address.*",
      "billing_address.*",
      "summary.*",
      "tax_total",
      "discount_total",
    ],
    filters: {
      id: id,
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
    to: order.email,
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
