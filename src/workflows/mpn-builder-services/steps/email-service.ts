import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateWorkflow } from "../../mpn-builder/get-template"
import { buildTree } from "../../../utils"
import { TEMPLATE_TYPES } from "../../../modules/mpn-builder/types"
import {
  EmailServiceWorkflowInput,
  EmailServiceWorkflowOutput,
} from "../types"

export const emailServiceStepId =
  "mpn-builder-email-service-step"

/**
 * This step renders an email template using the email service.
 *
 * @param input - The input for the step.
 * - template_id: Required - The ID of the template to render. It can be a system, external or database template.
 * - data: Required - The data to render the template with.
 * - options: Optional - locale, subject, theme and translations.
 *
 * @example
 * const { html, text, subject } = emailServiceStep({
 *   template_id: "system_template_123", // or "123" - ID from the database template
 *   data: {
 *     name: "John Doe",
 *   },
 *   options: {
 *     locale: "en",
 *   },
 * })
 *
 * @returns The HTML, text, and subject of the rendered template.
 */
export const emailServiceStep = createStep(
  emailServiceStepId,
  async (
    input: EmailServiceWorkflowInput,
    { container }
  ): Promise<StepResponse<EmailServiceWorkflowOutput>> => {
    const mpnBuilderService = container.resolve(
      "mpnBuilder"
    ) as any

    const templateEmailService =
      mpnBuilderService.getTemplateService(
        "email"
      )?.templateService

    const options = input.options || {}
    const templateId = input.template_id
    const isSystemTemplateId = templateId?.startsWith(
      TEMPLATE_TYPES.SYSTEM_TEMPLATE
    )
    const isExternalTemplateId = templateId?.startsWith(
      TEMPLATE_TYPES.EXTERNAL_TEMPLATE
    )
    const isRegistryTemplate =
      isSystemTemplateId || isExternalTemplateId

    let blocks: any[] = []

    // If it's not a registry template, get the blocks from the database
    if (!isRegistryTemplate) {
      const { result: templateData } =
        await getTemplateWorkflow(container).run({
          input: {
            template_id: templateId,
            fields: ["blocks.*"],
          },
        })

      const blocksTree = buildTree(
        templateData?.templates[0]?.blocks
      )

      blocks =
        templateEmailService?.transformBlocksForRendering(
          blocksTree
        )
    }

    const { html, text, subject } =
      await templateEmailService.render({
        templateName: isRegistryTemplate
          ? templateId
          : "base-template",
        data: input.data,
        options: {
          locale: options.locale,
          theme: options.theme,
          translations: options.translations,
          blocks: blocks,
          subject: options.subject,
        },
      })

    return new StepResponse({
      html: html,
      text: text,
      subject: subject,
    })
  }
)
