import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateServicesStep } from "./steps/get-template-services"

export interface GetTemplateServicesWorkflowInput {
  type: string
}

export const getTemplateServicesWorkflowName = "get-template-services"

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
export const getTemplateServicesWorkflow = createWorkflow(
  getTemplateServicesWorkflowName,
  (input: WorkflowData<GetTemplateServicesWorkflowInput>) => {
    const template = getTemplateServicesStep(input)

    return new WorkflowResponse(template)
  }
)
