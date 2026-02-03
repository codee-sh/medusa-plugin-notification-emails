import { BaseTemplateService } from "./base-template-service"

import {
  TemplateRenderParams,
} from "../types"
import {
  pickValueFromObject,
  multiInterpolate,
  omit,
} from "../../../utils"
import {
  templateBlocks as InventoryLevelTemplateBlocks,
  translations as inventoryLevelTranslations,
} from "../../../templates/slack/inventory-level"
import {
  templateBlocks as ProductTemplateBlocks,
  translations as productTranslations,
} from "../../../templates/slack/product"
import {
  templateBlocks as ProductVariantTemplateBlocks,
  translations as productVariantTranslations,
} from "../../../templates/slack/product-variant"
import {
  templateBlocks as OrderPlacedTemplateBlocks,
  translations as orderPlacedTranslations,
} from "../../../templates/slack/order/placed"
import {
  templateBlocks as OrderCompletedTemplateBlocks,
  translations as orderCompletedTranslations,
} from "../../../templates/slack/order/completed"
import {
  templateBlocks as OrderUpdatedTemplateBlocks,
  translations as orderUpdatedTranslations,
} from "../../../templates/slack/order/updated"
import {
  templateBlocks as OrderCanceledTemplateBlocks,
  translations as orderCanceledTranslations,
} from "../../../templates/slack/order/canceled"
import {
  templateBlocks as OrderArchivedTemplateBlocks,
  translations as orderArchivedTranslations,
} from "../../../templates/slack/order/archived"
import { TEMPLATES_NAMES } from "../../../templates/slack/types"
import {
  TEMPLATES_EMAILS_NAMES,
  TemplateOptionsType,
  TemplateRenderOptionsType,
} from "../types"

export class SlackTemplateService extends BaseTemplateService {
  id = "slack"
  label = "Slack"

  baseTemplateConfig: any

  constructor() {
    super()

    this.interpolateFunction =
      this.interpolateSlackBlocks.bind(this)

    // Register base template
    this.registerTemplate(
      TEMPLATES_EMAILS_NAMES.BASE_TEMPLATE,
      this.baseTemplateConfig
    )

    // Initialize default templates
    this.initializeSystemTemplates()
  }

  /**
   * Initialize default email templates
   */
  protected initializeSystemTemplates(): void {
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

  blocks: any[] = [
    {
      type: "heading",
      label: "Headline",
      fields: [
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        }
      ],
    },
    {
      type: "text",
      label: "Text",
      fields: [
        {
          key: "value",
          label: "Value",
          type: "textarea",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        }
      ],
    },
    {
      type: "row",
      label: "Row",
      fields: [
        {
          key: "label",
          label: "Etykieta",
          type: "text",
          required: true,
          name: "label",
          value: "",
          defaultValue: "",
        },
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        },
      ],
    },
    {
      type: "repeater",
      label: "Repeater",
      fields: [
        {
          key: "arrayPath",
          label: "Array path",
          type: "text",
          required: true,
          name: "arrayPath",
          value: "",
          defaultValue: "",
        },
      ],
    },
    {
      type: "group",
      label: "group",
      fields: [],
    },
    {
      type: "separator",
      label: "Separator",
      fields: [],
    },
  ]

  /**
   * Transform blocks from database format (with metadata) to rendering format (with props)
   * 
   * This method acts as a proxy/map layer between database storage and rendering:
   * - Database stores: { type: "heading", metadata: { value: "..." } }
   * - Rendering expects: { type: "heading", props: { value: "..." } }
   * 
   * Handles nested blocks recursively:
   * - children → props.blocks (for section, group)
   * - children → props.itemBlocks (for repeater)
   * 
   * **Usage:** Call this method before passing blocks to emailService.render() or interpolateBlocks()
   * 
   * @param blocks - Blocks from database with metadata property
   * @returns Blocks transformed to rendering format with props property
   * 
   * @example
   * // Input (from database):
   * [
   *   { type: "heading", metadata: { value: "{{data.order.id}}" } },
   *   { type: "section", metadata: {}, children: [
   *     { type: "text", metadata: { value: "Hello" } }
   *   ]}
   * ]
   * 
   * // Output (for rendering):
   * [
   *   { type: "heading", props: { value: "{{data.order.id}}" } },
   *   { type: "section", props: { blocks: [
   *     { type: "text", props: { value: "Hello" } }
   *   ]}}
   * ]
   * 
   */
  public transformBlocksForRendering(blocks: any[]): any[] {
    if (!blocks || !Array.isArray(blocks)) {
      return []
    }

    return blocks.map((block) => {
      // Create base block structure
      const transformedBlock: any = {
        id: block.id,
        type: block.type,
      }

      // Transform metadata to props
      if (block.metadata && typeof block.metadata === "object") {
        transformedBlock.props = { ...block.metadata }
      } else {
        transformedBlock.props = {}
      }

      // Handle nested blocks based on block type
      if (block.children && Array.isArray(block.children) && block.children.length > 0) {
        const transformedChildren = this.transformBlocksForRendering(block.children)

        if (block.type === "repeater") {
          // For repeater, children become itemBlocks
          transformedBlock.props.itemBlocks = transformedChildren
        } else if (
          block.type === "section" ||
          block.type === "group"
        ) {
          // For section/group, children become props.blocks
          transformedBlock.props.blocks = transformedChildren
        }
      }

      // If block already has props (from config.ts), merge with metadata
      // This allows config blocks to work alongside database blocks
      if (block.props && typeof block.props === "object") {
        transformedBlock.props = {
          ...transformedBlock.props,
          ...block.props,
        }
      }

      return transformedBlock
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
      if (
        block.type === "section" &&
        block?.fieldTemplate
      ) {
        const { fieldsPath, fieldTemplate } = block || {}

        if (fieldsPath && fieldTemplate) {
          const array = pickValueFromObject(
            fieldsPath,
            data
          )

          if (Array.isArray(array) && array.length > 0) {
            const interpolatedFieldBlocks = array.map(
              (item: any) => {
                return this.recursivelyInterpolateText(
                  fieldTemplate,
                  item,
                  translator,
                  {
                    arrayPath: fieldsPath,
                  }
                )
              }
            )

            block = {
              ...omit(block, "fieldsPath", "fieldTemplate"),
              fields: interpolatedFieldBlocks,
            }
          }
        }
      }

      return this.recursivelyInterpolateText(
        block,
        data,
        translator,
        config
      )
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
      return multiInterpolate(
        node,
        data,
        translator,
        config
      )
    }

    // If it's an array, process each element recursively
    if (Array.isArray(node)) {
      return node.map((item) => {
        return this.recursivelyInterpolateText(
          item,
          data,
          translator,
          config
        )
      })
    }

    // If it's an object, process all properties
    if (node && typeof node === "object") {
      const processed: any = {}

      for (const [key, value] of Object.entries(node)) {
        // If key is "text" and value is a string, interpolate it
        if (
          (key === "text" || key === "url") &&
          typeof value === "string"
        ) {
          processed[key] = multiInterpolate(
            value,
            data,
            translator,
            config
          )
        }
        // If key is "text" and value is an object (e.g., { type: "plain_text", text: "..." })
        else if (
          key === "text" &&
          value &&
          typeof value === "object"
        ) {
          // Recursively process the text object (will interpolate text.text)
          processed[key] = this.recursivelyInterpolateText(
            value,
            data,
            translator,
            config
          )
        }
        // If key is "elements" and value is an array
        else if (
          key === "elements" &&
          Array.isArray(value)
        ) {
          processed[key] = value.map((item: any) => {
            return this.recursivelyInterpolateText(
              item,
              data,
              translator,
              config
            )
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
   * Render email template
   *
   * @param params - Render parameters
   * @returns Rendered email with html, text, and subject
   */
  async render(
    params: TemplateRenderParams & {
      options?: TemplateRenderOptionsType
    }
  ): Promise<{
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

    const { template, translator, blocks } =
      this.prepareData({
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
