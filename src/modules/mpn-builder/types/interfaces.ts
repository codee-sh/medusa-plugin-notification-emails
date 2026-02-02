export interface Template {
  id?: string
  name: string
  label: string | null
  description: string | null
  channel: string
  locale: string
  subject: string | null
  is_active: boolean
}

export interface TemplateBlock {
  id?: string
  type: string
  props: any
}

export interface TemplateBlockProps {
  [key: string]: any
}

/**
 * Parameters for render method
 */
export interface TemplateRenderParams {
  templateName?: string
  templateId?: string
  data: any
  options?: any
  container?: any
}

export interface TemplateRenderOptionsType {
  subject?: string
  blocks?: any[]
  theme?: any
  locale?: any
  customTranslations?: Record<string, Record<string, any>>
}

export interface TemplateOptionsType {
  blocks?: any[]
  theme?: any
  locale?: any
  customTranslations?: Record<string, Record<string, any>>
}

export interface RenderTemplateParams {
  templateName: string | null
  data: any
  options?: TemplateRenderOptionsType
}

export interface RenderTemplateSyncParams {
  templateName: string | null
  data: any
  options?: TemplateRenderOptionsType
}

