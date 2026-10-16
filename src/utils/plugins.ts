import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import type {
  PluginOptions,
  PluginSubscriberEvent,
  PluginSubscriberOptions,
} from "../modules/mpn-builder/types/types"

export const PLUGIN_NAME =
  "@codee-sh/medusa-plugin-notification-emails"

export function getPluginOptions(
  container: MedusaContainer,
  pluginName: string
): Record<string, any> | undefined {
  try {
    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )
    const plugin = configModule.plugins?.find((p) => {
      if (typeof p === "string") {
        return p === pluginName
      }
      return p.resolve === pluginName
    })
    return typeof plugin === "object"
      ? plugin.options
      : undefined
  } catch (error) {
    throw error
  }
}

/**
 * Returns the options of a plugin subscriber when it is enabled, otherwise undefined.
 * Subscribers are opt-in: a missing entry and `enabled: false` both turn the subscriber off.
 */
export function getEnabledSubscriberOptions(
  container: MedusaContainer,
  event: PluginSubscriberEvent
): PluginSubscriberOptions | undefined {
  const pluginOptions = getPluginOptions(
    container,
    PLUGIN_NAME
  ) as PluginOptions | undefined

  const subscriberOptions =
    pluginOptions?.subscribers?.[event]

  return subscriberOptions?.enabled === true
    ? subscriberOptions
    : undefined
}
