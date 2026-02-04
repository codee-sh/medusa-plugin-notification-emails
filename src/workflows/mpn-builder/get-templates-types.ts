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
 * This workflow retrieves a template by its ID.
 *
 * @example
 * const { result } = await getTemplateByIdWorkflow(container).run({
 *   input: {
 *     template_id: "template_123"
 *   }
 * })
 */
export const getTemplateTypesWorkflow = createWorkflow(
  getTemplateTypesWorkflowName,
  (input: WorkflowData<GetTemplateTypesWorkflowInput>) => {
    const template = getTemplateTypesStep()

    return new WorkflowResponse(template)
  }
)
