import { TemplateName, TemplateData } from "../shared"

export const TEMPLATES_NAMES = {
  // BASE_TEMPLATE: "base-template",
  INVENTORY_LEVEL: "system_inventory-level",
  PRODUCT: "system_product",
  PRODUCT_VARIANT: "system_product-variant",
  ORDER_PLACED: "system_order-placed",
  ORDER_COMPLETED: "system_order-completed",
  ORDER_UPDATED: "system_order-updated",
  ORDER_CANCELED: "system_order-canceled",
  ORDER_ARCHIVED: "system_order-archived",
} as const

export type SlackBlock = {
  type: string
  [key: string]: any
}

export interface SlackTemplateOptions {
  backendUrl?: string
  locale?: string
  customTranslations?: Record<string, Record<string, any>>
  [key: string]: any
}

export interface SlackTemplateRendererParams {
  context: any
  contextType?: string | null
  options?: SlackTemplateOptions
}

export type SlackTemplateRenderer = (
  params: SlackTemplateRendererParams
) =>
  | Promise<{ text: string; blocks: SlackBlock[] }>
  | { text: string; blocks: SlackBlock[] }

export interface RenderSlackTemplateParams {
  templateName: TemplateName | null
  data: TemplateData
  options?: any
  createTemplate?: (
    data: TemplateData,
    options: any
  ) => React.ReactElement<any>
}
