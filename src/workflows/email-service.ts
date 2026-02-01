import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse, transform, when } from "@medusajs/framework/workflows-sdk"
import { getBlocksByTemplateWorkflow } from "./mpn-templates/get-blocks-by-template-id"


export const emailServiceWorkflowName = "email-service"

const emailServiceStep = createStep(
  {
    name: "email-service-step",
  },
  async (
    input: any,
    { container }
  ): Promise<StepResponse<any>> => {
    const mpnBuilderService = container.resolve("mpnBuilder") as any
    const templateEmailService = mpnBuilderService.getTemplateService("email")?.templateService

    const templateId = input.templateId
    const isSystemTemplateId = templateId?.startsWith("system_")
    const systemTemplateId = templateId.replace("system_", "")

    const { result: { blocks } } = await getBlocksByTemplateWorkflow(container).run({
      input: {
        template_id: input.templateId,
      },
    })

    const transformedBlocks = isSystemTemplateId ? [] : templateEmailService?.transformBlocksForRendering(blocks)

    const { html, text, subject } = await templateEmailService.render({
      templateName: isSystemTemplateId ? systemTemplateId : "base-template",
      data: input.data,
      options: {
        locale: input.options.locale,
        theme: input.options.theme,
        translations:
          input.options.translations,
        blocks: transformedBlocks,
      }
    })    

    return new StepResponse({
      html: html,
      text: text,
      subject: subject,
    })
  }
)

export const emailServiceWorkflow = createWorkflow(
  emailServiceWorkflowName,
  (input: any) => {
    const { html, text, subject } = emailServiceStep(input)

    return new WorkflowResponse({
      html,
      text,
      subject,
    })
  }
)
