import {
    StepResponse,
    createStep,
  } from "@medusajs/framework/workflows-sdk"
  import MpnBuilderService from "../../../modules/mpn-builder/service"
  import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
  import { getTemplateWorkflow } from "../get-template"
  
  export interface GetServicesTypesTemplatesStepInput {
    service_id?: string
  }
  
  export interface GetServicesTypesTemplatesStepOutput {
    templates: any[]
  }
  
  export const getServicesTypesTemplatesStepId = "get-services-types-templates"
  
  /**
   * Retrieves services, types and templates. If service_id is provided, returns only templates for that service.
   *
   * @example
   * const data = getServicesTypesTemplatesStep({
   *   service_id: "email"
   * })
   */
  export const getServicesTypesTemplatesStep = createStep(
    getServicesTypesTemplatesStepId,
    async (
      input: GetServicesTypesTemplatesStepInput,
      { container }
    ): Promise<StepResponse<GetServicesTypesTemplatesStepOutput>> => {
    const mpnBuilderService = container.resolve(
        MPN_BUILDER_MODULE
      ) as MpnBuilderService
  
      let listTemplateServices = mpnBuilderService.listTemplateServices()
  
      // Filter by service_id if provided
      if (input.service_id) {
        listTemplateServices = listTemplateServices.filter(
          (service: any) => service.id === input.service_id
        )
      }
  
      const newTemplates = await Promise.all(listTemplateServices.map(async (template: any) => {
        const serviceTemplate = mpnBuilderService.getTemplateService(template.id)?.templateService
  
        let templates: any[] = []
        try {
          const { result } = await getTemplateWorkflow(container).run({
            input: {
              channel: template.id,
            },
          })
          templates = result?.templates || []
        } catch (error) {
          // If no templates found, return empty array
          templates = []
        }
  
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
  