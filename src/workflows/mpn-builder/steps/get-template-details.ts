import { MedusaError } from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { getTemplateWorkflow } from "../get-template"

export interface GetTemplateDetailsStepInput {
  template_id: string
}

export interface GetTemplateDetailsStepOutput {
  template: Record<string, any>
}

export const getTemplateDetailsStepId =
  "get-template-details"

/**
 * Resolves a template by ID from DB, system, or external sources.
 * Returns a unified template object with template_source and template_type.
 */
export const getTemplateDetailsStep = createStep(
  getTemplateDetailsStepId,
  async (
    input: GetTemplateDetailsStepInput,
    { container }
  ): Promise<
    StepResponse<GetTemplateDetailsStepOutput>
  > => {
    const { template_id } = input

    try {
      const { result } = await getTemplateWorkflow(
        container
      ).run({
        input: { template_id },
      })

      const dbTemplate = result?.templates?.[0]
      if (dbTemplate) {
        return new StepResponse({
          template: {
            ...dbTemplate,
            template_source: "db",
            template_type: "db",
          },
        })
      }
    } catch {
      // Not found in DB templates
    }

    const builderService = container.resolve(
      MPN_BUILDER_MODULE
    ) as MpnBuilderService

    const serviceEntries =
      builderService.listTemplateServices()

    for (const service of serviceEntries) {
      const serviceId = service?.id
      if (!serviceId) {
        continue
      }

      const templateService =
        builderService.getTemplateService(
          serviceId
        )?.templateService

      const systemTemplate = templateService
        ?.getSystemTemplates()
        ?.find(
          (t: any) =>
            t.id === template_id || t.name === template_id
        )

      if (systemTemplate) {
        return new StepResponse({
          template: {
            ...systemTemplate,
            template_source: "system",
            template_type: "system",
            channel: serviceId,
          },
        })
      }

      const externalTemplate = templateService
        ?.getExternalTemplates()
        ?.find(
          (t: any) =>
            t.id === template_id || t.name === template_id
        )

      if (externalTemplate) {
        return new StepResponse({
          template: {
            ...externalTemplate,
            template_source: "external",
            template_type: "external",
            channel: serviceId,
          },
        })
      }
    }

    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Template "${template_id}" not found`
    )
  }
)
