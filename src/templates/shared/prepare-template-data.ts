import {
  TemplateName,
  TemplateData,
  BaseTemplateRenderer,
} from "./types"
import { getTemplate } from "./get-template"
import {
  createTranslator,
  mergeTranslations,
} from "../../utils"

/**
 * Parameters for prepareTemplateData function
 */
export interface PrepareTemplateDataParams<T extends BaseTemplateRenderer> {
  templateName: TemplateName
  data: TemplateData
  templateRegistry: Record<TemplateName, T>
  interpolateFunction: (blocks: any[], data: any, translator: any, config?: any) => any[]
  options?: {
    locale?: string
    blocks?: any[]
    customTranslations?: Record<string, Record<string, any>>
    [key: string]: any
  }
}

/**
 * Prepare template data (translations, blocks, translator, processedBlocks)
 * Shared logic for all template channels
 * 
 * @param params - Parameters object
 * @returns Prepared template data with translator, processed blocks, and render options
 */
export function prepareTemplateData<T extends BaseTemplateRenderer>({
  templateName,
  data,
  templateRegistry,
  interpolateFunction,
  options = {},
}: PrepareTemplateDataParams<T>): {
  template: T
  translator: { t: (key: string, data?: Record<string, any>) => string }
  renderOptions: any
} {
  const locale = options?.locale || "pl"
  const template = getTemplate(templateName, templateRegistry)
  const config = template.getConfig?.() || {}

  // Get translations for this template
  const translations = config?.translations || {}

  // If blocks are not provided in options, use basic blocks from config
  const optionsBlocks = options?.blocks || []
  
  const blocks = optionsBlocks.length > 0 ? optionsBlocks : config?.blocks || []

  // Process translations once
  const customTranslations = options?.customTranslations?.[templateName]

  // Merge translations
  const mergedTranslations = mergeTranslations(
    translations,
    customTranslations
  )

  // Create translator function
  const translator = createTranslator(locale, mergedTranslations as any)

  // Interpolate blocks if provided
  const processedBlocks =
    blocks.length > 0 ? interpolateFunction(blocks, data, translator) : blocks

  // Pass processed blocks in options to render functions
  const renderOptions = {
    ...options,
    blocks: processedBlocks,
  }

  return {
    template,
    translator,
    renderOptions,
  }
}

