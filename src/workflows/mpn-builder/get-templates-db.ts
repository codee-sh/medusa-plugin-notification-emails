import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplatesDbStep } from "./steps/get-templates-db"

export interface GetTemplatesDbWorkflowInput {
}

export const getTemplatesDbWorkflowName = "get-templates-db"

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
export const getTemplatesDbWorkflow = createWorkflow(
  getTemplatesDbWorkflowName,
  (input: WorkflowData<GetTemplatesDbWorkflowInput>) => {
    const template = getTemplatesDbStep()

    return new WorkflowResponse(template)
  }
)
