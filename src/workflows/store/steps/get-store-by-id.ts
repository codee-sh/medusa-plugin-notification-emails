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
import { StoreTypes } from "@medusajs/framework/types"

export interface GetStoreByIdStepInput {
  store_id: string
}

export interface GetStoreByIdStepOutput {
  store: StoreTypes.StoreDTO
}

export const getStoreStepName = "get-store"

/**
 * This step retrieves an order by its ID with related items, customer, addresses, and payment collections.
 *
 * @example
 * const data = getOrderByIdStep({
 *   store_id: "store_123"
 * })
 */
export const getStoreStep = createStep(
  getStoreStepName,
  async (
    input: GetStoreByIdStepInput,
    { container }
  ): Promise<StepResponse<GetStoreByIdStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const { data: store } = await query.graph({
      entity: "store",
      fields: ["id", "name", "default_sales_channel_id", "default_region_id", "default_location_id", "metadata"],
    })

    return new StepResponse({
      store: store[0],
    })
  }
)
