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
 * Retrieves available template services filtered by type.
 *
 * @example
 * const { result } = await getTemplateServicesWorkflow(container).run({
 *   input: {
 *     type: "email"
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
