import {
    ContainerRegistrationKeys,
  } from "@medusajs/framework/utils"
  import {
    StepResponse,
    createStep,
  } from "@medusajs/framework/workflows-sdk"
  import MpnBuilderService from "../../../modules/mpn-builder/service"
  import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
  
  export interface GetServicesTypesTemplatesStepInput {
  }
  
  export interface GetServicesTypesTemplatesStepOutput {
    templates: any[]
  }
  
  export const getServicesTypesTemplatesStepId = "get-services-types-templates"
  
  /**
   * This step retrieves all services, types and templates.
   *
   * @example
   * const data = getServicesTypesTemplatesStep()
   */
  export const getServicesTypesTemplatesStep = createStep(
    getServicesTypesTemplatesStepId,
    async (
      input: GetServicesTypesTemplatesStepInput,
      { container }
    ): Promise<StepResponse<GetServicesTypesTemplatesStepOutput>> => {
      const query = container.resolve(
        ContainerRegistrationKeys.QUERY
      )
  
      const mpnBuilderService = container.resolve(
        MPN_BUILDER_MODULE
      ) as MpnBuilderService
  
      const listTemplateServices = mpnBuilderService.listTemplateServices()
  
      const newTemplates = await Promise.all(listTemplateServices.map(async (template: any) => {
        const serviceTemplate = mpnBuilderService.getTemplateService(template.id)?.templateService
  
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
          templates: {
            system: serviceTemplate?.getSystemTemplates(),
            db: templates,
          }
        }
      }))
  
      return new StepResponse({
        templates: newTemplates
      })
    }
  )
  