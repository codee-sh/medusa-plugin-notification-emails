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
import { TEMPLATE_TYPES, TEMPLATE_TYPES_NAMES } from "./types/constants"

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

    // Initialize extended services (custom handlers and templates)
    // Note: templates with import paths will be loaded asynchronously
    this.initializeExtendedServices().catch((error) => {
      this.logger_.error(
        `Failed to initialize extended services: ${error?.message || "Unknown error"}`
      )
    })    
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
   * Initialize extended actions (custom handlers and templates)
   * Handles both custom handler registration and template loading
   *
   * @returns Promise<void>
   */
  private async initializeExtendedServices(): Promise<void> {
    const extendedServices = this.options_.extend?.services || []

    await Promise.all(
      extendedServices.map(async (serviceConfig: any) => {
        // 2. Register templates (for existing or newly registered handler)
        if (
          serviceConfig.templates
        ) {
          const handlerData = this.getTemplateService(
            serviceConfig.id
          )

          if (!handlerData) {
            this.logger_.warn(
              `Cannot register templates for "${serviceConfig.id}" - handler not found`
            )
            return
          }

          const { templateService } = handlerData

          if (!templateService.registerTemplate) {
            this.logger_.warn(
              `Handler "${serviceConfig.id}" does not support template registration`
            )
            return
          }

          await Promise.all(
            serviceConfig.templates.map(
              async (template: any) => {
                const templateName = template.name
                const templateValue = template.path

                let renderer = templateValue

                try {
                  const templateModule = await import(
                    templateValue
                  )
                  const template = templateModule.default
                  // renderer = template?.default || template
                  renderer = template?.default || templateModule

                  if (!renderer) {
                    this.logger_.warn(
                      `Template module from "${templateValue}" does not export a default function or expected named export`
                    )
                    return
                  }
                } catch (error: any) {
                  this.logger_.warn(
                    `Failed to load template from "${templateValue}": ${error?.message || "Unknown error"}`
                  )
                  return
                }

                if (templateName) {
                  templateService.registerTemplate!(
                    templateName,
                    renderer,
                    "external"
                  )

                  this.logger_.info(
                    `Custom template "${templateName}" registered for handler "${serviceConfig.id}"`
                  )
                }
              }
            )
          )
        }
      })
    )
  }

  /**
   * Get template types
   *
   * @returns Array of template types with key, value, and name
   */
  getTemplateTypes(): Array<{ id: string; name: string }> {
    return [
      {
        id: TEMPLATE_TYPES.DB_TEMPLATE,
        name: TEMPLATE_TYPES_NAMES.DB_TEMPLATE,
      },
      {
        id: TEMPLATE_TYPES.SYSTEM_TEMPLATE,
        name: TEMPLATE_TYPES_NAMES.SYSTEM_TEMPLATE,
      },
      {
        id: TEMPLATE_TYPES.EXTERNAL_TEMPLATE,
        name: TEMPLATE_TYPES_NAMES.EXTERNAL_TEMPLATE,
      },
    ]
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
        blocks: blocks,
        enabled: template.enabled,
      }
    })
  }
}

export default MpnBuilderService
