export const TEMPLATE_TYPES = {
  SYSTEM_TEMPLATE: "system_",
  DB_TEMPLATE: "db_",
  EXTERNAL_TEMPLATE: "external_",
} as const

/**
 * Template renderer function type - can be sync or async
 */
export type TemplateRenderer = {
  getConfig?: () => any
  [key: string]: any
}

/**
 * Block type
 */
export type BlockType = {
  id: string
  type: string
  position: number
  metadata: Record<string, any>
  parent_id: string
  virtual?: boolean
  children?: BlockType[]
}

/**
 * Field config type
 */
export interface FieldConfig {
  name: string
  key: string
  label: string
  description?: string
  type:
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "checkbox"
    | "date"
    | "chip-input"
    | "email"
    | "password"
    | "file"
  placeholder?: string
  required?: boolean
  defaultValue?: any
  options?: Array<{ value: string; name: string }>
  min?: number
  max?: number
  step?: number
}

/**
 * Module options type
 */
export type ModuleOptions = {
  builder?: {
    
  }
}