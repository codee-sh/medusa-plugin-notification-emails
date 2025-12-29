import { TemplateName, BaseTemplateRenderer } from "./types"

/**
 * Get template renderer by template name
 *
 * @param templateName - Name of the template
 * @param templateRegistry - Template registry for the channel
 * @returns Template renderer
 * @throws Error if template name is not found
 */
export function getTemplate<T extends BaseTemplateRenderer>(
  templateName: TemplateName,
  templateRegistry: Record<TemplateName, T>
): T {
  const template = templateRegistry[templateName]

  if (!template) {
    throw new Error(
      `Template "${templateName}" not found. Available templates: ${Object.keys(templateRegistry).join(", ")}`
    )
  }

  return template
}

