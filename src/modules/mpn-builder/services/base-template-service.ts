import { BaseTemplateServiceInterface, BlockType, TemplateRenderer } from "../types"
import {
  createTranslator,
  mergeTranslations,
} from "../../../utils"

/**
 * Base action service class
 *
 * @param id - Action ID (default: "base")
 * @param label - Template label (default: "Base")
 * @param description - Template description (default: "")
 * @param configComponentKey - Template config component key (default: "BaseConfigComponent")
 * @param blocks - Template blocks (default: [])
 */
export class BaseTemplateService implements BaseTemplateServiceInterface {
  id = "base"
  label = "Base"
  description = ""

  configComponentKey = "BaseConfigComponent"

  // Fields for the Template configuration rendered in the admin panel then saved in the metadata config
  blocks: BlockType[] = []

  // Template registry - each service manages its own templates
  protected templates_: Map<string, TemplateRenderer> =
    new Map()

  /**
   * Register a template for this service
   * @param name - Template name
   * @param renderer - Template renderer function
   */
  registerTemplate(
    name: string,
    renderer: TemplateRenderer
  ): void {
    this.templates_.set(name, renderer)
  }

  /**
   * Get template by name
   *
   * @param name - Template name
   * @returns Template renderer
   * @throws Error if template not found
   */
  getTemplate(name: string): TemplateRenderer {
    const template = this.templates_.get(name)

    if (!template) {
      throw new Error(
        `Template "${name}" not found. Available templates: ${Array.from(
          this.templates_.keys()
        ).join(", ")}`
      )
    }

    return template
  }

  getSystemTemplates() {
    return Array.from(this.templates_.entries()).map(([name, renderer]) => ({
      id: name,
      name,
      label: name,
      description: null,
      channel: this.id,
      is_system: true,
      is_active: true,
      blocks: renderer.getConfig?.().blocks || [],
    }))
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
    templateName: string
    data: any
    options?: any
  }): {
    template: TemplateRenderer
    translator: {
      t: (key: string, data?: Record<string, any>) => string
    }
    blocks: any[]
  } {
    // Get locale from options or default to "en"
    const locale = params.options?.locale || "en"

    // Get registered template
    const template = this.getTemplate(params.templateName)
    const config = (template).getConfig?.() || {}

    const configTranslations = config?.translations || {}
    const configBlocks = config?.blocks || []

    const optionsBlocks = params.options?.blocks || [] // blocks from data in mpn builder
    const optionsTranslations = params.options?.translations

    // If blocks are not provided in options, use basic blocks from config
    const blocks: BlockType[] =
      optionsBlocks.length > 0
        ? optionsBlocks
        : configBlocks

    // Merge translations
    const mergedTranslations = mergeTranslations(
      configTranslations,
      optionsTranslations
    )

    // Create translator function
    const translator = createTranslator(
      locale,
      mergedTranslations
    )

    // Interpolate blocks using the interpolate function
    const interpolatedBlocks =
      blocks.length > 0
        ? this.interpolateFunction(
            blocks,
            params.data,
            translator
          )
        : blocks

    return {
      template,
      translator,
      blocks: interpolatedBlocks,
    }
  }

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
}
