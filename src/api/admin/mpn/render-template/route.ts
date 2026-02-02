import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { defaultTheme } from "../../../../templates/shared/theme"
import { transformContext } from "../../../../utils/transforms"
import { getPluginOptions } from "../../../../utils/plugins"
import { MPN_BUILDER_MODULE } from "../../../../modules/mpn-builder"
import { emailServiceWorkflow } from "../../../../workflows/mpn-builder-services/email-service"

export async function POST(
  req: MedusaRequest<{
    templateId: string
    templateName: string
    context: any
    contextType: any
    locale: string
  }>,
  res: MedusaResponse
) {
  const pluginOptions = getPluginOptions(
    req.scope,
    "@codee-sh/medusa-plugin-notification"
  )

  const templateId = req.body?.templateId
  const templateName = req.body?.templateName
  const context = req.body?.context
  const contextType = req.body?.contextType

  const locale = req.body?.locale || "pl"

  if (!templateId || !context || !locale) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "Template id, template data and locale are required"
    )
  }

  const transformedTemplateData = transformContext(
    contextType,
    context,
    locale
  )

  const { result: { html, text, subject } } = await emailServiceWorkflow(req.scope).run({
    input: {
      templateId: templateId,
      data: transformedTemplateData,
      options: {
        locale: locale,
        theme: pluginOptions?.theme || defaultTheme,
        translations:
          pluginOptions?.customTranslations?.[templateName],
      },
    },
  })

  res.status(200).json({
    html,
    text,
    subject,
  })
}
