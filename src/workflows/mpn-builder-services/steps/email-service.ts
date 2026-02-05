import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateWorkflow } from "../../mpn-builder/get-template"
import { buildTree } from "../../../utils"
import { TEMPLATE_TYPES } from "../../../modules/mpn-builder/types"

export const emailServiceStepId = "mpn-builder-email-service-step"

/**
 * This step renders an email template using the email service.
 *
 * @param input - The input for the step.
 * - template_id: Required - The ID of the template to render. It can be a system template or a database template.
 * - data: Required - The data to render the template with.
 * - options: Optional - The options to render the template with.
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
    input: any,
    { container }
  ): Promise<StepResponse<any>> => {
    const mpnBuilderService = container.resolve(
      "mpnBuilder"
    ) as any

    const templateEmailService =
      mpnBuilderService.getTemplateService(
        "email"
      )?.templateService

    const templateId = input.template_id
    const isSystemTemplateId = templateId?.startsWith(TEMPLATE_TYPES.SYSTEM_TEMPLATE)

    let blocks: any[] = []
    let template: any = {}

    // If it's not a system template, get the blocks from the database
    if (!isSystemTemplateId) {
      const { result: templateData } = await getTemplateWorkflow(container).run({
        input: {
          template_id: templateId,
          fields: ["blocks.*"],
        }
      })

      const blocksTree = buildTree(templateData?.templates[0]?.blocks)

      blocks = templateEmailService?.transformBlocksForRendering(
        blocksTree
      )
    }

    const { html, text, subject } =
      await templateEmailService.render({
        templateName: isSystemTemplateId
          ? templateId
          : "base-template",
        data: input.data,
        options: {
          locale: input.options.locale,
          theme: input.options.theme,
          translations: input.options.translations,
          blocks: blocks,
          subject: template?.subject,
        },
      })

    return new StepResponse({
      html: html,
      text: text,
      subject: subject,
    })
  }
)
