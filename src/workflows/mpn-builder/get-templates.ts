import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplatesStep } from "./steps/get-templates"

export interface GetTemplatesWorkflowInput {
}

export const getTemplatesWorkflowName = "get-templates"

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
export const getTemplatesWorkflow = createWorkflow(
  getTemplatesWorkflowName,
  (input: WorkflowData<GetTemplatesWorkflowInput>) => {
    const template = getTemplatesStep()

    return new WorkflowResponse(template)
  }
)
