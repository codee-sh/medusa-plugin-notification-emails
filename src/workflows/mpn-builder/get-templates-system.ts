import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplatesSystemStep } from "./steps/get-templates-system"

export interface GetTemplatesSystemWorkflowInput {
}

export const getTemplatesSystemWorkflowName = "get-templates-system"

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
export const getTemplatesSystemWorkflow = createWorkflow(
  getTemplatesSystemWorkflowName,
  (input: WorkflowData<GetTemplatesSystemWorkflowInput>) => {
    const template = getTemplatesSystemStep()

    return new WorkflowResponse(template)
  }
)
