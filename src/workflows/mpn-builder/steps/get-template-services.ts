import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"

export interface GetTemplateServicesStepInput {
  type: string
}

export interface GetTemplateServicesStepOutput {
  list: any[]
}

export const getTemplateServicesStepId = "get-template-services"

/**
 * Retrieves available template services filtered by type.
 *
 * @example
 * const data = getTemplateServicesStep({
 *   type: "email"
 * })
 */
export const getTemplateServicesStep = createStep(
  getTemplateServicesStepId,
  async (
    input: GetTemplateServicesStepInput,
    { container }
  ): Promise<StepResponse<GetTemplateServicesStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const mpnBuilderService = container.resolve(
      MPN_BUILDER_MODULE
    ) as MpnBuilderService

    const listTemplateServices = mpnBuilderService.listTemplateServices(input.type)

    return new StepResponse({
      list: listTemplateServices
    })
  }
)
