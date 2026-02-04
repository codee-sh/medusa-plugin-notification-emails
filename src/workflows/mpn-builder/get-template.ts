import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateStep } from "./steps/get-template"

export interface GetTemplateByIdWorkflowInput {
  template_id?: string
  channel?: string
  name?: string
  locale?: string
  active?: boolean
  fields?: string[]
}

export const getTemplateWorkflowId = "get-template"

/**
 * This workflow retrieves a template by its ID.
 *
 * @example
 * const { result } = await getTemplateByIdWorkflow(container).run({
 *   input: {
 *     template_id: "template_123"
 *   }
 * })
 */
export const getTemplateWorkflow = createWorkflow(
  getTemplateWorkflowId,
  (input: WorkflowData<GetTemplateByIdWorkflowInput>) => {
    const template = getTemplateStep({
      template_id: input.template_id,
      channel: input.channel,
      name: input.name,
      locale: input.locale,
      active: input.active,
      fields: input.fields,
    })

    return new WorkflowResponse(template)
  }
)
