import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { defaultTheme } from "../../../../templates/shared/theme"
import { renderTemplate, TemplateName, TemplateData } from "../../../../templates/emails"
import { transformContext } from "../../../../utils/transforms"
import { getPluginOptions } from "../../../../utils/plugins"

export async function POST(
  req: MedusaRequest<{ templateName: string, context: any, contextType: any, locale: string }>,
  res: MedusaResponse
) {
  const pluginOptions = getPluginOptions(req.scope, "@codee-sh/medusa-plugin-notification")

  const templateName = req.body?.templateName as TemplateName
  const context = req.body?.context as TemplateData
  const contextType = req.body?.contextType

  const locale = req.body?.locale || "pl"

  if (!templateName || !context || !locale) {
    throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Template name, template data and locale are required")
  }

  const transformedTemplateData = transformContext(contextType, context, locale)

  const { html, text } = await renderTemplate(
    templateName,
    transformedTemplateData,
    {
      locale: locale,
      theme: pluginOptions?.theme || defaultTheme,
      customTranslations: pluginOptions?.customTranslations?.[templateName]
    }
  )

  res.status(200).json({
    html,
    text,
  })
}

