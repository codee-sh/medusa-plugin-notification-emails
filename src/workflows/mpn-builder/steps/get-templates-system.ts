import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"

export interface GetTemplatesStepInput {
}

export interface GetTemplatesStepOutput {
  templates: any[]
}

export const getTemplatesStepId = "get-templates-system"

/**
 * This step retrieves a template by its ID.
 *
 * @example
 * const data = getTemplatesStep()
 */
export const getTemplatesSystemStep = createStep(
  getTemplatesStepId,
  async (
    input: GetTemplatesStepInput,
    { container }
  ): Promise<StepResponse<GetTemplatesStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const mpnBuilderService = container.resolve(
      MPN_BUILDER_MODULE
    ) as MpnBuilderService

    const availableServicesTemplates = mpnBuilderService.listTemplateServices()

    const newTemplates = await Promise.all(availableServicesTemplates.map(async (template: any) => {
      const serviceTemplate = mpnBuilderService.getTemplateService(template.id)?.templateService

      return {
        id: template.id,
        label: template.label,
        channel: template.id,
        templates: serviceTemplate?.getSystemTemplates()
      }
    }))

    return new StepResponse({
      templates: newTemplates
    })
  }
)
