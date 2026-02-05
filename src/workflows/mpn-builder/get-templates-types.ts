import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateTypesStep } from "./steps/get-template-types" 
export interface GetTemplateTypesWorkflowInput {
}

export const getTemplateTypesWorkflowName = "get-template-types"

/**
 * Retrieves all available template types.
 *
 * @example
 * const { result } = await getTemplateTypesWorkflow(container).run({
 *   input: {}
 * })
 */
export const getTemplateTypesWorkflow = createWorkflow(
  getTemplateTypesWorkflowName,
  (input: WorkflowData<GetTemplateTypesWorkflowInput>) => {
    const template = getTemplateTypesStep()

    return new WorkflowResponse(template)
  }
)
