import {
    StepResponse,
    createStep,
  } from "@medusajs/framework/workflows-sdk"
  import MpnBuilderService from "../../../modules/mpn-builder/service"
  import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
  import { getTemplateWorkflow } from "../get-template"
  
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
    const mpnBuilderService = container.resolve(
        MPN_BUILDER_MODULE
      ) as MpnBuilderService
  
      const listTemplateServices = mpnBuilderService.listTemplateServices()
  
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
  