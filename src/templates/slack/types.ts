import { TemplateName, TemplateData } from "../shared"

export const TEMPLATES_NAMES = {
  BASE_TEMPLATE: "base-template",
  INVENTORY_LEVEL: "inventory-level",
  PRODUCT: "product",
  PRODUCT_VARIANT: "product-variant",
  ORDER_PLACED: "order-placed",
  ORDER_COMPLETED: "order-completed",
  ORDER_UPDATED: "order-updated",
  ORDER_CANCELED: "order-canceled",
  ORDER_ARCHIVED: "order-archived",
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
