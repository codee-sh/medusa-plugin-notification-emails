import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getBlocksByTemplateStep } from "./steps/get-blocks-by-template-id"

export interface GetBlocksByTemplateWorkflowInput {
  template_id: string
}

export const getBlocksByTemplateStepId = "get-blocks-by-template"

/**
 * Retrieves all blocks for a specific template, organized as a tree structure.
 *
 * @example
 * const { result } = await getBlocksByTemplateWorkflow(container).run({
 *   input: {
 *     template_id: "template_123"
 *   }
 * })
 */
export const getBlocksByTemplateWorkflow = createWorkflow(
  getBlocksByTemplateStepId,
  (input: WorkflowData<GetBlocksByTemplateWorkflowInput>) => {
    const blocks = getBlocksByTemplateStep({
      template_id: input.template_id,
    })

    return new WorkflowResponse(blocks)
  }
)

