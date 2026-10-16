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
  extend?: {
    services?: Array<{
      id: string
      templates?: Array<{
        name: string
        path?: string
        module?: Record<string, any>
      }>
    }>
  }
}

/**
 * Events the plugin's own subscribers answer
 */
export type PluginSubscriberEvent =
  | "order.placed"
  | "order.completed"

/**
 * Options of one plugin subscriber
 */
export type PluginSubscriberOptions = {
  enabled: boolean
  locale?: string
}

/**
 * Plugin options type. The plugin passes them to its module as well, so they extend ModuleOptions.
 */
export type PluginOptions = ModuleOptions & {
  /**
   * Opt-in switches for the plugin's subscribers. A subscriber whose event is not set to
   * `enabled: true` does nothing.
   */
  subscribers?: Partial<
    Record<PluginSubscriberEvent, PluginSubscriberOptions>
  >
  theme?: Record<string, any>
  customTranslations?: Record<string, Record<string, any>>
}
