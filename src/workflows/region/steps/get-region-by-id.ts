import type {
  OrderTypes,
  CustomerTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { RegionTypes } from "@medusajs/framework/types"

export interface GetRegionByIdStepInput {
  region_id: string
  fields?: string[]
}

export interface GetRegionByIdStepOutput {
  region: RegionTypes.RegionDTO
}

export const getRegionStepName = "get-region"

/**
 * Retrieves a region by ID with optional field selection.
 *
 * @example
 * const data = getRegionStep({
 *   region_id: "region_123",
 *   fields: ["id", "name", "currency_code"]
 * })
 */
export const getRegionStep = createStep(
  getRegionStepName,
  async (
    input: GetRegionByIdStepInput,
    { container }
  ): Promise<StepResponse<GetRegionByIdStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const { data: region } = await query.graph({
      entity: "region",
      fields: input.fields || [],
    })

    return new StepResponse({
      region: region[0],
    })
  }
)
