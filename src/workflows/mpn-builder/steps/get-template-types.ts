import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"

export interface GetTemplateTypesStepInput {
}

export interface GetTemplateTypesStepOutput {
  list: any[]
}

export const getTemplateTypesStepId = "get-template-types"

/**
 * This step retrieves a list of template services.
 *
 * @example
 * const data = getTemplatesStep()
 */
export const getTemplateTypesStep = createStep(
  getTemplateTypesStepId,
  async (
    input: GetTemplateTypesStepInput,
    { container }
  ): Promise<StepResponse<GetTemplateTypesStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const mpnBuilderService = container.resolve(
      MPN_BUILDER_MODULE
    ) as MpnBuilderService

    const listTemplateTypes = mpnBuilderService.getTemplateTypes()

    return new StepResponse({
      list: listTemplateTypes
    })
  }
)
