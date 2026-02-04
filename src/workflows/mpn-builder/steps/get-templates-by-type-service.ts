import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import { getTemplateWorkflow } from "../get-template"

export interface GetTemplatesByTypeServiceStepInput {
  type_id: string
  service_id: string
}

export interface GetTemplatesByTypeServiceStepOutput {
  templates: any[]
}

export const getTemplatesByTypeServiceStepId = "get-templates-by-type-service"

/**
 * This step retrieves templates filtered by type and service.
 *
 * @example
 * const data = getTemplatesByTypeServiceStep({
 *   type_id: "db",
 *   service_id: "email"
 * })
 */
export const getTemplatesByTypeServiceStep = createStep(
  getTemplatesByTypeServiceStepId,
  async (
    input: GetTemplatesByTypeServiceStepInput,
    { container }
  ): Promise<StepResponse<GetTemplatesByTypeServiceStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const mpnBuilderService = container.resolve(
      MPN_BUILDER_MODULE
    ) as MpnBuilderService

    const { type_id, service_id } = input

    let templates: any[] = []

    if (type_id === "db") {
      const { result: templatesResult } =
        await getTemplateWorkflow(container).run({
          input: {
            channel: service_id,
          },
        })

      templates = templatesResult?.templates
    }

    if (type_id === "system") {
      const serviceTemplate =
        mpnBuilderService.getTemplateService(
          service_id
        )?.templateService
      templates =
        serviceTemplate?.getSystemTemplates() || []
    }

    return new StepResponse({
      templates: templates,
    })
  }
)
