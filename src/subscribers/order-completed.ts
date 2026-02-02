import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import {
  Modules,
  MedusaError,
} from "@medusajs/framework/utils"
import { TEMPLATES_EMAILS_NAMES } from "../modules/mpn-builder/types"
import { transformContext } from "../utils/transforms"
import { getPluginOptions } from "../utils/plugins"
import { getOrderByIdWorkflow } from "../workflows/order/get-order-by-id"
import { emailServiceWorkflow } from "../workflows/mpn-builder-services/email-service"

export default async function orderPlacedEmailsHandler({
  event: {
    data: { id, trigger_type },
  },
  container,
}: SubscriberArgs<{ id: string; trigger_type: string }>) {
  const pluginOptions = getPluginOptions(
    container,
    "@codee-sh/medusa-plugin-notification-emails"
  )

  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  const triggerType = trigger_type || "system"

  if (!id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "Order ID is required"
    )
  }

  const { result: order } = await getOrderByIdWorkflow(
    container
  ).run({
    input: {
      order_id: id,
    },
  })

  if (!order) {
    return
  }

  // Transform raw order data to email template format
  const context = transformContext("order", order, "pl")

  const templateName = TEMPLATES_EMAILS_NAMES.ORDER_COMPLETED
  const templateId = `system_${templateName}`

  const { result: { html, text, subject } } = await emailServiceWorkflow(container).run({
    input: {
      templateId: templateId,
      data: context,
      options: {
        locale: "pl",
        translations:
          pluginOptions?.customTranslations?.[templateName],
      },
    },
  })

  const result =
    await notificationModuleService.createNotifications({
      to: order.order.customer.email,
      channel: "email",
      template: templateName,
      trigger_type: triggerType,
      resource_id: id,
      resource_type: "order",
      data: context,
      content: {
        subject: subject,
        html,
        text,
      },
    })
}

export const config: SubscriberConfig = {
  event: "order.completed",
}
