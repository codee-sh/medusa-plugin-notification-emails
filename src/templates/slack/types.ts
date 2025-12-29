export const TEMPLATES_NAMES = {
  BASE_TEMPLATE: "base-template",
  INVENTORY_LEVEL: "inventory-level",
  PRODUCT: "product",
  PRODUCT_VARIANT: "product-variant",
} as const;

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
