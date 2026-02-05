import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getRegionStep } from "./steps/get-region-by-id"

export interface GetRegionWorkflowInput {
  region_id?: string | null
  fields?: string[]
}

export const getRegionWorkflowName = "get-region"

/**
 * Retrieves a region by ID with optional field selection.
 *
 * @example
 * const { result } = await getRegionWorkflow(container).run({
 *   input: {
 *     region_id: "region_123",
 *     fields: ["id", "name", "currency_code"]
 *   }
 * })
 */
export const getRegionWorkflow = createWorkflow(
  getRegionWorkflowName,
  (input: WorkflowData<GetRegionWorkflowInput>) => {
    const region = getRegionStep({
      region_id: input.region_id || "",
      fields: input.fields || [],
    })

    return new WorkflowResponse(region)
  }
)
