import {
  TemplateName,
  TemplateData,
  TemplateRenderer
} from "./types"
import {
  createTranslator,
  mergeTranslations,
} from "../../utils"

/**
 * Parameters for render method
 */
export interface RenderParams {
  templateName: TemplateName
  data: TemplateData
  options?: any
}

/**
 * Abstract template service class
 * Provides common functionality for template registration and rendering
 * 
 * @template T - Template renderer type (extends TemplateRenderer)
 */
export abstract class AbstractTemplateService<T> {
  /**
   * Template registry - stores all registered templates
   */
  protected templateRegistry: Map<TemplateName, T> = new Map()

  /**
   * Base template configuration
   * Set by subclasses in constructor
   */
  protected baseTemplateConfig: T

  /**
   * Interpolation function for blocks
   * Set by subclasses in constructor
   */
  protected interpolateFunction: (
    blocks: any[],
    data: any,
    translator: any,
    config?: any
  ) => any[]

  /**
   * Register a template
   * 
   * @param name - Template name
   * @param renderer - Template renderer configuration
   */
  registerTemplate(name: TemplateName, renderer: T): void {
    this.templateRegistry.set(name, renderer)
  }

  /**
   * Get template by name
   * 
   * @param name - Template name
   * @returns Template renderer
   * @throws Error if template not found
   */
  getTemplate(name: TemplateName): T {
    const template = this.templateRegistry.get(name)

    if (!template) {
      throw new Error(
        `Template "${name}" not found. Available templates: ${Array.from(
          this.templateRegistry.keys()
        ).join(", ")}`
      )
    }

    return template
  }

  /**
   * Check if template exists
   * 
   * @param name - Template name
   * @returns True if template exists
   */
  hasTemplate(name: TemplateName): boolean {
    return this.templateRegistry.has(name)
  }

  /**
   * List all registered template names
   * 
   * @returns Array of template names
   */
  listTemplates(): TemplateName[] {
    return Array.from(this.templateRegistry.keys())
  }

  /**
   * Get base template configuration
   * 
   * @returns Base template config
   */
  getBaseTemplate(): T {
    return this.baseTemplateConfig
  }

  /**
   * Prepare template data.
   * 
   * This method prepares the data for the template renderer.
   * Merge translations from template config and options (if provided), 
   * then interpolate blocks using the interpolate function.
   * 
   * @param params - Parameters object
   * @returns Prepared template data
   */
  protected prepareData(params: {
    templateName: TemplateName
    data: TemplateData
    options?: any
  }): {
    template: T
    translator: { t: (key: string, data?: Record<string, any>) => string }
    blocks: any[]
  } {
    // Get locale from options or default to "en"
    const locale = params.options?.locale || "en"
    
    // Get registered template
    const template = this.getTemplate(params.templateName)
    const config = (template as TemplateRenderer).getConfig?.() || {}

    const configTranslations = config?.translations || {}
    const configBlocks = config?.blocks || []

    const optionsBlocks = params.options?.blocks || []
    const optionsTranslations = params.options?.translations
    
    // If blocks are not provided in options, use basic blocks from config
    const blocks = optionsBlocks.length > 0 ? optionsBlocks : configBlocks

    // Merge translations
    const mergedTranslations = mergeTranslations(
      configTranslations,
      optionsTranslations
    )

    // Create translator function
    const translator = createTranslator(locale, mergedTranslations)

    // Interpolate blocks using the interpolate function
    const interpolatedBlocks =
      blocks.length > 0
        ? this.interpolateFunction(blocks, params.data, translator)
        : blocks

    return {
      template,
      translator,
      blocks: interpolatedBlocks,
    }
  }

  /**
   * Initialize default templates
   * Called automatically in constructor
   * Override in subclasses to register prebuild templates
   */
  protected abstract initializeDefaultTemplates(): void

  /**
   * Render template
   * Main method for rendering templates
   * Must be implemented by subclasses
   * 
   * @param params - Render parameters
   * @returns Rendered template result (type depends on channel)
   */
  abstract render(params: RenderParams): Promise<any>
}

