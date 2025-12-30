import {
  AbstractTemplateService,
  RenderParams,
} from "../shared/abstract-template-service"
import {
  pickValueFromObject,
  multiInterpolate,
} from "../../utils"
import {
  templateBlocks as InventoryLevelTemplateBlocks,
  translations as inventoryLevelTranslations,
} from "./inventory-level"
import {
  templateBlocks as ProductTemplateBlocks,
  translations as productTranslations,
} from "./product"
import {
  templateBlocks as ProductVariantTemplateBlocks,
  translations as productVariantTranslations,
} from "./product-variant"
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
  templateBlocks as OrderCanceledTemplateBlocks,
  translations as orderCanceledTranslations,
} from "./order/canceled"
import {
  templateBlocks as OrderArchivedTemplateBlocks,
  translations as orderArchivedTranslations,
} from "./order/archived"
import { TEMPLATES_NAMES } from "./types"

/**
 * Slack template service
 * Handles registration and rendering of Slack templates
 */
export class SlackTemplateService extends AbstractTemplateService<any> {
  constructor() {
    super()
    
    this.baseTemplateConfig = {
      getBlocks: async (): Promise<any[]> => {
        // Base template for Slack returns an empty array
        return []
      },
    }

    this.interpolateFunction = this.interpolateSlackBlocks.bind(this)

    // Register base template
    this.registerTemplate(
      TEMPLATES_NAMES.BASE_TEMPLATE,
      this.baseTemplateConfig
    )

    // Initialize default templates
    this.initializeDefaultTemplates()
  }

  /**
   * Initialize default Slack templates
   */
  protected initializeDefaultTemplates(): void {
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

    // Product template
    this.registerTemplate(TEMPLATES_NAMES.PRODUCT, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: ProductTemplateBlocks,
          translations: productTranslations,
        }
      },
    })

    // Product variant template
    this.registerTemplate(TEMPLATES_NAMES.PRODUCT_VARIANT, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: ProductVariantTemplateBlocks,
          translations: productVariantTranslations,
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

    // Order canceled template
    this.registerTemplate(TEMPLATES_NAMES.ORDER_CANCELED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderCanceledTemplateBlocks,
          translations: orderCanceledTranslations,
        }
      },
    })

    // Order archived template
    this.registerTemplate(TEMPLATES_NAMES.ORDER_ARCHIVED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderArchivedTemplateBlocks,
          translations: orderArchivedTranslations,
        }
      },
    })
  }

  /**
   * Recursively interpolate text in SlackBlock[] structure
   * Finds all "text" properties in the entire tree and interpolates them
   */
  private interpolateSlackBlocks(
    blocks: any[],
    data: any,
    translator: any,
    config?: any
  ): any[] {
    return blocks.map((block) => {
      // Create fields array if fieldTemplate and fieldsPath is provided and array is not empty
      if (block.type === "section" && block?.fieldTemplate) {
        const { fieldsPath, fieldTemplate } = block || {}

        if (fieldsPath && fieldTemplate) {
          const array = pickValueFromObject(fieldsPath, data)

          if (Array.isArray(array) && array.length > 0) {
            const interpolatedFieldBlocks = array.map((item: any) => {
              return this.recursivelyInterpolateText(fieldTemplate, item, translator, {
                arrayPath: fieldsPath,
              })
            })

            block = {
              ...block,
              fields: interpolatedFieldBlocks,
            }
          }
        }
      }

      return this.recursivelyInterpolateText(block, data, translator, config)
    })
  }

  /**
   * Recursively interpolate all "text" / "url" properties in an object
   */
  private recursivelyInterpolateText(
    node: any,
    data: any,
    translator: any,
    config?: any
  ): any {
    // If it's a string, interpolate it
    if (typeof node === "string") {
      return multiInterpolate(node, data, translator, config)
    }

    // If it's an array, process each element recursively
    if (Array.isArray(node)) {
      return node.map((item) => {
        return this.recursivelyInterpolateText(item, data, translator, config)
      })
    }

    // If it's an object, process all properties
    if (node && typeof node === "object") {
      const processed: any = {}

      for (const [key, value] of Object.entries(node)) {
        // If key is "text" and value is a string, interpolate it
        if ((key === "text" || key === "url") && typeof value === "string") {
          processed[key] = multiInterpolate(value, data, translator, config)
        }
        // If key is "text" and value is an object (e.g., { type: "plain_text", text: "..." })
        else if (key === "text" && value && typeof value === "object") {
          // Recursively process the text object (will interpolate text.text)
          processed[key] = this.recursivelyInterpolateText(
            value,
            data,
            translator,
            config
          )
        }
        // If key is "elements" and value is an array
        else if (key === "elements" && Array.isArray(value)) {
          processed[key] = value.map((item: any) => {
            return this.recursivelyInterpolateText(item, data, translator, config)
          })
        }
        // For all other properties, recursively process them
        else {
          processed[key] = this.recursivelyInterpolateText(
            value,
            data,
            translator,
            config
          )
        }
      }

      return processed
    }

    return node
  }

  /**
   * Render Slack template
   * 
   * @param params - Render parameters
   * @returns Rendered Slack blocks
   */
  async render(params: RenderParams): Promise<{
    blocks: any[]
  }> {
    if (!params.templateName) {
      throw new Error("Template name is required")
    }

    // Add backendUrl to data for interpolation
    const dataWithOptions = {
      ...params.data,
      backendUrl: params.options?.backendUrl || "",
    }

    const { template, translator, blocks } = this.prepareData({
      templateName: params.templateName,
      data: dataWithOptions,
      options: params.options,
    })

    const options = {
      ...params.options,
      blocks,
    }

    // Get blocks from template
    return {
      blocks: options.blocks,
    }
  }
}

