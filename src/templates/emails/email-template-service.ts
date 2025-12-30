import React from "react"
import {
  AbstractTemplateService,
  RenderParams,
} from "../shared/abstract-template-service"
import {
  pickValueFromObject,
  multiInterpolate,
} from "../../utils"
import {
  getBaseTemplateHtml,
  getBaseTemplateText,
  getBaseTemplateReactNode,
} from "./base-template"
import {
  templateBlocks as ContactFormTemplateBlocks,
  translations as contactFormTranslations,
} from "./contact-form"
import {
  templateBlocks as InventoryLevelTemplateBlocks,
  translations as inventoryLevelTranslations,
} from "./inventory-level"
import {
  templateBlocks as OrderPlacedTemplateBlocks,
  translations as orderPlacedTranslations,
} from "./order/placed"
import {
  templateBlocks as OrderCompletedTemplateBlocks,
  translations as orderCompletedTranslations,
} from "./order/completed"
import {
  templateBlocks as OrderUpdatedTemplateBlocks,
  translations as orderUpdatedTranslations,
} from "./order/updated"
import {
  TEMPLATES_NAMES,
  TemplateOptionsType,
  TemplateRenderOptionsType,
} from "./types"

/**
 * Email template service
 * Handles registration and rendering of email templates
 */
export class EmailTemplateService extends AbstractTemplateService<any> {
  constructor() {
    super()

    this.baseTemplateConfig = {
      getHtml: async (
        data: any,
        options?: TemplateOptionsType
      ): Promise<string> => {
        return await getBaseTemplateHtml(data, options as any)
      },
      getText: async (
        data: any,
        options?: TemplateOptionsType
      ): Promise<string> => {
        return await getBaseTemplateText(data, options as any)
      },
      getReactNode: (
        data: any,
        options?: TemplateOptionsType
      ): React.ReactNode => {
        return getBaseTemplateReactNode(data, options as any)
      },
    }
    
    this.interpolateFunction = this.interpolateBlocks.bind(this)

    // Register base template
    this.registerTemplate(
      TEMPLATES_NAMES.BASE_TEMPLATE,
      this.baseTemplateConfig
    )

    // Initialize default templates
    this.initializeDefaultTemplates()
  }

  /**
   * Initialize default email templates
   */
  protected initializeDefaultTemplates(): void {
    // Contact form template
    this.registerTemplate(TEMPLATES_NAMES.CONTACT_FORM, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: ContactFormTemplateBlocks,
          translations: contactFormTranslations,
        }
      },
    })

    // Order placed template
    this.registerTemplate(TEMPLATES_NAMES.ORDER_PLACED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderPlacedTemplateBlocks,
          translations: orderPlacedTranslations,
        }
      },
    })

    // Order completed template
    this.registerTemplate(TEMPLATES_NAMES.ORDER_COMPLETED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderCompletedTemplateBlocks,
          translations: orderCompletedTranslations,
        }
      },
    })

    // Order updated template
    this.registerTemplate(TEMPLATES_NAMES.ORDER_UPDATED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderUpdatedTemplateBlocks,
          translations: orderUpdatedTranslations,
        }
      },
    })

    // Inventory level template
    this.registerTemplate(TEMPLATES_NAMES.INVENTORY_LEVEL, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: InventoryLevelTemplateBlocks,
          translations: inventoryLevelTranslations,
        }
      },
    })
  }

  /**
   * Recursively interpolate text in blocks using the multiInterpolate function
   * Processes props.[property] in each block and nested blocks
   * 
   * @param blocks - Blocks to interpolate
   * @param data - Data object for interpolation
   * @param translator - Translator instance with t method (created using createTranslator function)
   * @param config - Configuration object
   * @returns Interpolated blocks
   * 
   * @example
   * 
   * const blocks = [ { type: "text", props: { value: "Order {{data.order.id}} - {{translations.headerTitle}}" } } ]
   * const data = { order: { id: "123" } }
   * const translator = translator instance (created using createTranslator function)
   * const config = {}
   * 
   * const interpolatedBlocks = interpolateBlocks(blocks, data, translator, config)
   * 
   * Return: [ { type: "text", props: { value: "Order 123 - Order Confirmation" } } ]
   * 
   */
  private interpolateBlocks(
    blocks: any[],
    data: any,
    translator: any,
    config?: any
  ): any[] {
    return blocks.map((block) => {
      const processedBlock = { ...block }

      // Process all string properties in props
      if (processedBlock.props && typeof processedBlock.props === "object") {
        const processedProps: any = { ...processedBlock.props }

        // Iterate over all properties in props
        for (const [key, value] of Object.entries(processedProps)) {
          // Skip non-string values and special properties (blocks, itemBlocks, separator, arrayPath)
          if (
            typeof value === "string" &&
            key !== "blocks" &&
            key !== "itemBlocks" &&
            key !== "arrayPath"
          ) {
            processedProps[key] = multiInterpolate(
              value,
              data,
              translator,
              config
            )
          }
        }

        processedBlock.props = processedProps
      }

      // Recursively process nested blocks
      if (
        processedBlock.props?.blocks &&
        Array.isArray(processedBlock.props.blocks)
      ) {
        processedBlock.props = {
          ...processedBlock.props,
          blocks: this.interpolateBlocks(
            processedBlock.props.blocks,
            data,
            translator
          ),
        }
      }

      if (processedBlock.type === "repeater") {
        const { arrayPath, itemBlocks } = processedBlock.props || {}

        if (arrayPath && itemBlocks) {
          const array = pickValueFromObject(arrayPath, data)

          if (Array.isArray(array) && array.length > 0) {
            const interpolatedItemBlocks = array.map((item: any) =>
              this.interpolateBlocks(itemBlocks, item, translator, {
                arrayPath: arrayPath,
              })[0]
            )

            processedBlock.props = {
              ...processedBlock.props,
              itemBlocks: interpolatedItemBlocks,
            }
          }
        }
      }

      return processedBlock
    })
  }

  /**
   * Render email template
   * 
   * @param params - Render parameters
   * @returns Rendered email with html, text, and subject
   */
  async render(params: RenderParams & {
    options?: TemplateRenderOptionsType
  }): Promise<{
    html: string
    text: string
    subject: string
  }> {
    if (!params.templateName) {
      throw new Error("Template name is required")
    }

    const { template, blocks, translator } = this.prepareData({
      templateName: params.templateName,
      data: params.data,
      options: params.options,
    })

    const options = {
      ...params.options,
      blocks,
    }

    return {
      html: await template.getHtml(params.data, options),
      text: await template.getText(params.data, options),
      subject: multiInterpolate(
        "{{translations.headerTitle}}",
        params.data,
        translator
      ),
    }
  }

  /**
   * Render email template synchronously (for previews)
   * 
   * @param params - Render parameters
   * @returns React node
   */
  renderSync(params: RenderParams & {
    options?: TemplateRenderOptionsType
  }): {
    reactNode: React.ReactNode
  } {
    if (!params.templateName) {
      throw new Error("Template name is required")
    }

    const { template, blocks } = this.prepareData({
      templateName: params.templateName,
      data: params.data,
      options: params.options,
    })

    const options = {
      ...params.options,
      blocks,
    }

    return {
      reactNode: template.getReactNode
        ? template.getReactNode(params.data, options)
        : undefined,
    }
  }
}

