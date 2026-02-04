import { BaseTemplateServiceInterface, BlockType, TemplateRenderer } from "../types"
import { TEMPLATE_TYPES } from "../types/constants"
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
   * @param type - Template type (default: "system")
   */
  registerTemplate(
    name: string,
    renderer: TemplateRenderer,
    type: string = TEMPLATE_TYPES.SYSTEM_TEMPLATE
  ): void {
    this.templates_.set(name, { renderer, type: type })
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

    return template.renderer
  }

  /**
   * Get templates by type
   * @param type - Template type (TEMPLATE_TYPES.SYSTEM_TEMPLATE or TEMPLATE_TYPES.EXTERNAL_TEMPLATE)
   * @returns Array of templates matching the specified type
   */
  protected getTemplatesByType(type: string) {
    return Array.from(this.templates_.entries())
      .filter(([_, renderer]) => renderer.type === type)
      .map(([name, renderer]) => ({
        id: name,
        name,
        label: name,
        description: null,
        channel: this.id,
        is_system: type === TEMPLATE_TYPES.SYSTEM_TEMPLATE,
        is_active: true,
        type: renderer.type,
        blocks: renderer.renderer?.getConfig?.()?.blocks || [],
      }))
  }

  /**
   * Get system templates (type: "system")
   * @returns Array of system templates
   */
  getSystemTemplates() {
    return this.getTemplatesByType(TEMPLATE_TYPES.SYSTEM_TEMPLATE)
  }

  /**
   * Get external templates (type: "external")
   * @returns Array of external templates
   */
  getExternalTemplates() {
    return this.getTemplatesByType(TEMPLATE_TYPES.EXTERNAL_TEMPLATE)
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
    const config = (template)?.getConfig?.() || {}

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
