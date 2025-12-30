/**
 * Common types for all template channels (email, slack, etc.)
 */

/**
 * Template name type
 */
export type TemplateName = any

/**
 * Template data type
 */
export type TemplateData = any

/**
 * Base template renderer interface
 * Each channel should extend this with channel-specific methods
 */
export interface TemplateRenderer {
  getConfig?: () => any
  [key: string]: any
}

