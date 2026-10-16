import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import {
  Modules,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  DEFAULT_LOCALE,
  TEMPLATES_EMAILS_NAMES,
} from "../modules/mpn-builder/types"
import { transformContext } from "../utils/transforms"
import { getEnabledSubscriberOptions } from "../utils/plugins"
import { getOrderByIdWorkflow } from "../workflows/order/get-order-by-id"
import { emailServiceWorkflow } from "../workflows/mpn-builder-services/email-service"

/**
 * Emails the order confirmation to the customer. Opt-in: does nothing unless the plugin options set
 * `subscribers["order.placed"].enabled` to true.
 */
export default async function orderPlacedEmailsHandler({
  event: {
    data: { id, trigger_type },
  },
  container,
}: SubscriberArgs<{ id: string; trigger_type: string }>) {
  const subscriberOptions = getEnabledSubscriberOptions(
    container,
    "order.placed"
  )

  if (!subscriberOptions) {
    return
  }

  const locale = subscriberOptions.locale || DEFAULT_LOCALE

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
  const context = transformContext("order", order, locale)

  const templateId = TEMPLATES_EMAILS_NAMES.ORDER_PLACED

  const {
    result: { html, text, subject },
  } = await emailServiceWorkflow(container).run({
    input: {
      template_id: templateId,
      data: context,
      options: {
        locale,
      },
    },
  })

  await notificationModuleService.createNotifications({
    to: context.order.customer.email,
    channel: "email",
    template: templateId,
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
  event: "order.placed",
}
