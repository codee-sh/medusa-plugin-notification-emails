import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { getBlocksByTemplateWorkflow } from "../../../workflows/mpn-builder/get-blocks-by-template-id"
import { getTemplateWorkflow } from "../../mpn-builder/get-template"
import { buildTree } from "../../../utils"
import { TEMPLATE_TYPES } from "../../../modules/mpn-builder/types/types"

export const emailServiceStepId = "mpn-builder-email-service-step"

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

      const blocksTree = buildTree(templateData?.template?.blocks)

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
