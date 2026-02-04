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

export const getTemplatesStepId = "get-templates-db"

/**
 * This step retrieves a template by its ID.
 *
 * @example
 * const data = getTemplatesStep()
 */
export const getTemplatesDbStep = createStep(
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

    const listTemplateServices = mpnBuilderService.listTemplateServices()

    const newTemplates = await Promise.all(listTemplateServices.map(async (template: any) => {
      const { data: templates } = await query.graph({
        entity: "mpn_builder_template",
        fields: [
          "id",
          "name",
          "label",
          "description",
          "channel",
          "locale",
          "subject",
          "is_active",
          "created_at",
          "updated_at",
        ],
        filters: {
          channel: {
            $eq: template.id,
          },
        },
      })

      return {
        id: template.id,
        label: template.label,
        channel: template.id,
        templates: templates
      }
    }))

    return new StepResponse({
      templates: newTemplates
    })
  }
)
