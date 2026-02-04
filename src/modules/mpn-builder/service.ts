import {
  MedusaService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  MpnBuilderTemplate,
  MpnBuilderTemplateBlock,
} from "./models"
import {
  ModuleOptions,
} from "./types"
import { Logger } from "@medusajs/framework/types"
import { EmailTemplateService } from "./services-local/email-template-service"
import { BaseTemplateService } from "./services-local/base-template-service"
import { SlackTemplateService } from "./services-local/slack-template-service"

type InjectedDependencies = {
  logger: Logger
}

class MpnBuilderService extends MedusaService({
  MpnBuilderTemplate,
  MpnBuilderTemplateBlock,
}) {
  private options_: ModuleOptions
  private logger_: Logger
  private templateServices_: Map<string, { templateService: BaseTemplateService; enabled: boolean }> = new Map()

  constructor(
    { logger }: InjectedDependencies,
    options?: ModuleOptions
  ) {
    super(...arguments)

    this.logger_ = logger
    this.options_ = options || {}

    // Initialize default templates
    this.initializeTemplateServices()    
  }

  /**
   * Initialize template services from defaults and options
   *
   * @returns void
   */
  private initializeTemplateServices() {
    const defaultTemplateServices: BaseTemplateService[] = [
      new EmailTemplateService(),
      new SlackTemplateService(),
    ]

    defaultTemplateServices.forEach((templateService) => {
      this.templateServices_.set(templateService.id, {
        templateService: templateService,
        enabled: true,
      })

      this.logger_.info(
        `Template service for ${templateService.id} registered`
      )      
    })
  }

  /**
   * Get template services map
   *
   * @returns Map of template services
   */
  private getTemplateServices(): Map<
    string,
    { templateService: BaseTemplateService; enabled: boolean }
  > {
    return this.templateServices_
  }

  /**
   * Get template service by ID for the admin panel form
   *
   * @param templateServiceId - Template service ID
   * @returns Template service
   */
  getTemplateService(
    templateServiceId: string
  ):
    | { templateService: BaseTemplateService; enabled: boolean }
    | undefined {
    const templateServices = this.getTemplateServices()
    return templateServices.get(templateServiceId)
  }

  /**
   * List all registered template services (e.g., email, slack)
   *
   * @param type - Optional type to filter by service ID
   * @returns Array of template service configurations
   */
  listTemplateServices(type?: string) {
    let templates = this.getTemplateServices()

    if (type) {
      const templateService = templates.get(type)
      const template = templateService?.templateService
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
      let blocks = template.templateService.blocks || []

      return {
        id: template.templateService.id,
        label: template.templateService.label,
        description: template.templateService.description,
        configComponentKey:
          template.templateService.configComponentKey,
        // templateLoaders: template.template.templateLoaders,
        blocks: blocks,
        enabled: template.enabled,
      }
    })
  }
}

export default MpnBuilderService
