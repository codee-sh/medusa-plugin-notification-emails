export interface Template {
  id?: string
  name: string
  label: string | null
  description: string | null
  channel: string
  locale: string
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
