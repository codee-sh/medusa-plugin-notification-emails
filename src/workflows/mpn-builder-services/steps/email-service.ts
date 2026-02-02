import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { getBlocksByTemplateWorkflow } from "../../../workflows/mpn-builder/get-blocks-by-template-id"
import { getTemplateByIdWorkflow } from "../../../workflows/mpn-builder/get-template-by-id"

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

    const templateId = input.templateId

    const isSystemTemplateId = templateId?.startsWith("system_")
    
    const templateName = isSystemTemplateId ? templateId.replace(
      "system_",
      ""
    ) : "base-template"

    let blocks: any[] = []
    let template: any = {}

    if (!isSystemTemplateId) {
      const {
        result: { blocks: templateBlocks },
      } = await getBlocksByTemplateWorkflow(container).run({
        input: {
          template_id: templateId,
        },
      })

      const { result: templateData } = await getTemplateByIdWorkflow(container).run({
        input: {
          template_id: templateId,
        }
      })      

      blocks = templateEmailService?.transformBlocksForRendering(
        templateBlocks
      )

      template = templateData?.template
    }

    const { html, text, subject } =
      await templateEmailService.render({
        templateName: isSystemTemplateId
          ? templateName
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
