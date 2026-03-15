import { FieldDefinition } from "../../../fields"

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
export type FieldConfig = FieldDefinition

/**
 * Module options type
 */
export type ModuleOptions = {
  extend?: {
    contexts?: Array<{
      id: string
      label?: string
      description?: string
    }>
    services?: Array<{
      id: string
      templates?: Array<{
        name: string
        path: string
      }>
    }>
  }
}