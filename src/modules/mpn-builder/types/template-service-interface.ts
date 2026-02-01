import { BlockType, TemplateRenderer } from "./types"

/**
 * Template service interface - implement this to create custom template services
 */
export interface BaseTemplateServiceInterface {
  /**
   * Unique identifier for the action (e.g., "email", "sms", "custom_email")
   */
  id: string

  /**
   * Label displayed in UI
   */
  label: string

  /**
   * Optional description of the action
   */
  description?: string

  /**
   * Fields for the template configuration
   */
  blocks?: BlockType[]

  /**
   * Optional path to config component for dynamic import
   */
  configComponentKey?: string

  /**
   * Optional template loaders for dynamic import
   */
  templateLoaders?: Record<string, any>

  /**
   * Transform blocks for rendering
   * @returns Transformed blocks
   */
  transformBlocksForRendering?: () => any[]

  /**
   * Register a template for this template service
   * @param name - Template name
   * @param renderer - Template renderer function
   */
  registerTemplate?: (
    name: string,
    renderer: TemplateRenderer
  ) => void

  /**
   * Get template renderer by name
   * @param name - Template name
   * @returns Template renderer or undefined
   */
  getTemplate?: (
    name: string
  ) => TemplateRenderer | undefined

  /**
   * Render template (wrapper method)
   * @param params - Template rendering parameters
   * @returns Rendered template result
   */
  renderTemplate?: (params: {
    templateName: string
    context: any
    contextType?: string | null
    options?: any
  }) => Promise<any> | any
}
