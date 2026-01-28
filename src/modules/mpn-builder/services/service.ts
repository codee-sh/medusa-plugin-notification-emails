import {
  MedusaService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  MpnBuilderTemplate,
  MpnBuilderTemplateBlock,
} from "../models"
import {
  ModuleOptions,
} from "../types"
import { Logger } from "@medusajs/framework/types"
import { EmailTemplateService } from "./email-template-service"
import { BaseTemplateService } from "./base-template-service"

type InjectedDependencies = {
  logger: Logger
}

class MpnBuilderService extends MedusaService({
  MpnBuilderTemplate,
  MpnBuilderTemplateBlock,
}) {
  private options_: ModuleOptions
  private logger_: Logger
  private templateServices_: Map<string, { template: BaseTemplateService; enabled: boolean }> = new Map()

  constructor(
    { logger }: InjectedDependencies,
    options?: ModuleOptions
  ) {
    super(...arguments)

    this.logger_ = logger
    this.options_ = options || {}

    this.initializeTemplateServices()
  }

  /**
   * Initialize action handlers from defaults and options
   *
   * @returns void
   */
  private initializeTemplateServices() {
    const defaultTemplateServices: BaseTemplateService[] = [
      new EmailTemplateService(),
    ]

    defaultTemplateServices.forEach((templateService) => {
      this.templateServices_.set(templateService.id, {
        template: templateService,
        enabled: true,
      })

      this.logger_.info(
        `Template service for ${templateService.id} registered`
      )      
    })
  }

  /**
   * Get action handlers map
   *
   * @returns Map of action handlers
   */
  private getTemplateServices(): Map<
    string,
    { template: BaseTemplateService; enabled: boolean }
  > {
    return this.templateServices_
  }

  /**
   * Get available actions for the admin panel form
   * If Handler has fields, we can push templateName field to fields array, then in the admin panel form we can render the templateName field as a select field with the templates options.
   *
   * @param eventName - Optional event name to filter templates dynamically
   * @returns Array of actions
   */
  getAvailableTemplates(type?: string) {
    let templates = this.getTemplateServices()

    if (type) {
      const templateService = templates.get(type)
      const template = templateService?.template
      const enabled = templateService?.enabled ?? true
      const templateBlocks = template?.blocks || []

      return [
        {
          id: template?.id,
          label: template?.label,
          description: template?.description,
          configComponentKey: template?.configComponentKey,
          // templateLoaders: template?.templateLoaders,
          blocks: templateBlocks,
          enabled: enabled,
        }
      ]
    }

    return Array.from(templates.values()).map((template) => {
      let blocks = template.template.blocks || []

      return {
        id: template.template.id,
        label: template.template.label,
        description: template.template.description,
        configComponentKey:
          template.template.configComponentKey,
        // templateLoaders: template.template.templateLoaders,
        blocks: blocks,
        enabled: template.enabled,
      }
    })
  }


  // /**
  //  * Get available templates for a given event name
  //  * Uses getAvailableEvents() to find the event and extract template
  //  *
  //  * @param eventName - Event name to search for
  //  * @returns Array of template options
  //  */
  // getTemplatesForBlock(
  //   eventName?: string
  // ): Array<{ value: string; name: string }> {
  //   if (!eventName) {
  //     return []
  //   }

  //   const allEvents = this.getAvailableEvents()

  //   // Search through all event groups
  //   for (const group of allEvents) {
  //     const event = group.events?.find(
  //       (e: any) => e.value === eventName
  //     )
  //     if (event?.templates && event.templates.length > 0) {
  //       return event.templates
  //     }
  //   }

  //   return []
  // }
}

export default MpnBuilderService
