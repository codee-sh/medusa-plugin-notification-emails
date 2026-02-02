import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getStoreStep } from "./steps/get-store-by-id"

export interface GetStoreWorkflowInput {
  store_id?: string | null
}

export const getStoreWorkflowName = "get-store"

/**
 * This workflow retrieves an order by its ID with related items, customer, addresses, and payment collections.
 *
 * @example
 * const { result } = await getStoreWorkflow(container).run({
 *   input: {
 *     store_id: "store_123"
 *   }
 * })
 */
export const getStoreWorkflow = createWorkflow(
  getStoreWorkflowName,
  (input: WorkflowData<GetStoreWorkflowInput>) => {
    const store = getStoreStep({
      store_id: input.store_id || "",
    })

    return new WorkflowResponse(store)
  }
)
