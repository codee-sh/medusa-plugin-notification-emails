import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateByIdStep } from "./steps/get-template-by-id"

export interface GetTemplateByIdWorkflowInput {
  template_id: string
}

export const getTemplateByIdWorkflowId = "get-template-by-id"

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
export const getTemplateByIdWorkflow = createWorkflow(
  getTemplateByIdWorkflowId,
  (input: WorkflowData<GetTemplateByIdWorkflowInput>) => {
    const template = getTemplateByIdStep({
      template_id: input.template_id,
    })

    return new WorkflowResponse(template)
  }
)
