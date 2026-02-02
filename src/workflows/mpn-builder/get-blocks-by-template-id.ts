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
 * This workflow retrieves an order by its ID with related items, customer, addresses, and payment collections.
 *
 * @example
 * const { result } = await getOrderByIdWorkflow(container).run({
 *   input: {
 *     order_id: "order_123"
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

