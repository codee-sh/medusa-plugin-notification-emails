import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import {
  Modules,
  MedusaError,
} from "@medusajs/framework/utils"
import { TEMPLATES_EMAILS_NAMES } from "../modules/mpn-builder/types"
import { transformContext } from "../utils/data/transform-context"
import { getPluginOptions } from "../utils/plugins"
import { getStoreWorkflow } from "../workflows/store/get-store-by-id"
import { getOrderByIdWorkflow } from "../workflows/order/get-order-by-id"
import { emailServiceWorkflow } from "../workflows/mpn-builder-services/email-service"
import { getRegionWorkflow } from "../workflows/region/get-region-by-id"
import { FIELDS as ORDER_FIELDS } from "../utils/data/modules/order"

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

  const templateId = TEMPLATES_EMAILS_NAMES.ORDER_PLACED

  const {
    result: { html, text, subject },
  } = await emailServiceWorkflow(container).run({
    input: {
      template_id: templateId,
      data: context,
      options: {
        locale: pluginOptions?.locale || "pl",
      },
    },
  })

  const result =
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
