import { BaseTemplateService } from "./base-template-service"

import { TemplateRenderParams } from "../types"
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
  TemplateRenderOptionsType,
} from "../types"
import { FormBlockDefinition } from "../types"

export class SlackTemplateService extends BaseTemplateService {
  id = "slack"
  label = "Slack"

  baseTemplateConfig: any

  constructor() {
    super()

    this.interpolateFunction =
      this.interpolateSlackBlocks.bind(this)

    // Register base template
    this.registerTemplate({
      name: TEMPLATES_EMAILS_NAMES.BASE_TEMPLATE,
      renderer: this.baseTemplateConfig,
      context_type: null,
    })

    // Initialize default templates
    this.initializeSystemTemplates()
  }

  /**
   * Initialize default email templates
   */
  protected initializeSystemTemplates(): void {
    // Inventory level template
    this.registerTemplate({
      name: TEMPLATES_NAMES.INVENTORY_LEVEL,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: InventoryLevelTemplateBlocks,
            translations: inventoryLevelTranslations,
          }
        },
      },
      context_type: "inventory_level",
    })

    // Product template
    this.registerTemplate({
      name: TEMPLATES_NAMES.PRODUCT,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: ProductTemplateBlocks,
            translations: productTranslations,
          }
        },
      },
      context_type: "product",
    })

    // Product variant template
    this.registerTemplate({
      name: TEMPLATES_NAMES.PRODUCT_VARIANT,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: ProductVariantTemplateBlocks,
            translations: productVariantTranslations,
          }
        },
      },
      context_type: "product_variant",
    })

    // Order placed template
    this.registerTemplate({
      name: TEMPLATES_NAMES.ORDER_PLACED,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: OrderPlacedTemplateBlocks,
            translations: orderPlacedTranslations,
          }
        },
      },
      context_type: "order",
    })

    // Order completed template
    this.registerTemplate({
      name: TEMPLATES_NAMES.ORDER_COMPLETED,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: OrderCompletedTemplateBlocks,
            translations: orderCompletedTranslations,
          }
        },
      },
      context_type: "order",
    })

    // Order updated template
    this.registerTemplate({
      name: TEMPLATES_NAMES.ORDER_UPDATED,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: OrderUpdatedTemplateBlocks,
            translations: orderUpdatedTranslations,
          }
        },
      },
      context_type: "order",
    })

    // Order canceled template
    this.registerTemplate({
      name: TEMPLATES_NAMES.ORDER_CANCELED,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: OrderCanceledTemplateBlocks,
            translations: orderCanceledTranslations,
          }
        },
      },
      context_type: "order",
    })

    // Order archived template
    this.registerTemplate({
      name: TEMPLATES_NAMES.ORDER_ARCHIVED,
      renderer: {
        ...this.baseTemplateConfig,
        getConfig: (): any => {
          return {
            blocks: OrderArchivedTemplateBlocks,
            translations: orderArchivedTranslations,
          }
        },
      },
      context_type: "order",
    })
  }

  blocks: FormBlockDefinition[] = [
    {
      type: "group",
      runtimeType: "heading",
      label: "Headline",
      hasChildren: false,
      fields: [
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          name: "value",
          defaultValue: "",
        },
      ],
    },
    {
      type: "group",
      runtimeType: "text",
      label: "Text",
      hasChildren: false,
      fields: [
        {
          key: "value",
          label: "Value",
          type: "textarea",
          required: true,
          name: "value",
          defaultValue: "",
        },
      ],
    },
    {
      type: "group",
      runtimeType: "row",
      label: "Row",
      hasChildren: false,
      fields: [
        {
          key: "label",
          label: "Label",
          type: "text",
          required: true,
          name: "label",
          defaultValue: "",
        },
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          name: "value",
          defaultValue: "",
        },
      ],
    },
    {
      type: "repeater",
      runtimeType: "repeater",
      label: "Repeater",
      hasChildren: true,
      fields: [
        {
          key: "arrayPath",
          label: "Array path",
          type: "text",
          required: true,
          name: "arrayPath",
          defaultValue: "",
        },
      ],
    },
    {
      type: "group",
      runtimeType: "group",
      label: "group",
      hasChildren: true,
      fields: [],
    },
    {
      type: "group",
      runtimeType: "separator",
      label: "Separator",
      hasChildren: false,
      fields: [],
    },
  ]

  /**
   * Transform blocks from database format (with metadata) to Slack Block Kit format
   *
   * This method transforms blocks from database storage format to Slack Block Kit format:
   * - Database stores: { type: "heading", metadata: { value: "..." } }
   * - Slack Block Kit expects: { type: "header", text: { type: "plain_text", text: "..." } }
   *
   * Handles nested blocks recursively:
   * - children → flattened blocks (for group)
   * - children → blocks for repeater (handled separately during interpolation)
   *
   * **Usage:** Call this method before passing blocks to interpolateBlocks()
   *
   * @param blocks - Blocks from database with metadata property
   * @returns Blocks transformed to Slack Block Kit format
   *
   * @example
   * // Input (from database):
   * [
   *   { type: "heading", metadata: { value: "{{data.order.id}}" } },
   *   { type: "separator", metadata: {} },
   *   { type: "group", metadata: {}, children: [
   *     { type: "text", metadata: { value: "Hello" } }
   *   ]}
   * ]
   *
   * // Output (Slack Block Kit):
   * [
   *   { type: "header", text: { type: "plain_text", text: "{{data.order.id}}" } },
   *   { type: "divider" },
   *   { type: "section", text: { type: "mrkdwn", text: "Hello" } }
   * ]
   *
   */
  public transformBlocksForRendering(blocks: any[]): any[] {
    if (!blocks || !Array.isArray(blocks)) {
      return []
    }

    const result: any[] = []

    for (const block of blocks) {
      const runtimeType = String(
        block.type || block.runtimeType || ""
      )

      if (!runtimeType) {
        throw new Error(
          `Block runtimeType not found for type "${block.type}"`
        )
      }

      const metadata = block.metadata || {}
      const children = block.children || []

      // Transform block based on type
      switch (runtimeType) {
        case "heading": {
          // heading → header block
          result.push({
            type: "header",
            text: {
              type: "plain_text",
              text: metadata.value || "",
              emoji: true,
            },
          })
          break
        }

        case "text": {
          // text → section block with mrkdwn
          result.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: metadata.value || "",
            },
          })
          break
        }

        case "row": {
          // row → section block with fields
          result.push({
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: metadata.label || "",
              },
              {
                type: "mrkdwn",
                text: metadata.value || "",
              },
            ],
          })
          break
        }

        case "separator": {
          // separator → divider block
          result.push({
            type: "divider",
          })
          break
        }

        // case "group": {
        //   // group → flatten children blocks
        //   if (children.length > 0) {
        //     const transformedChildren = this.transformBlocksForRendering(children)
        //     result.push(...transformedChildren)
        //   }
        //   break
        // }

        case "repeater": {
          // repeater → keep structure for later processing during interpolation
          // Children will be transformed to blocks
          const transformedChildren =
            this.transformBlocksForRendering(children)
          result.push({
            type: "repeater",
            arrayPath: metadata.arrayPath || "",
            blocks: transformedChildren,
          })
          break
        }

        default: {
          // Unknown block type - keep as is (might be custom Slack block)
          const transformedBlock: any = {
            type: runtimeType,
          }

          // Copy metadata as properties
          if (metadata && typeof metadata === "object") {
            Object.assign(transformedBlock, metadata)
          }

          // Handle children if present
          if (children.length > 0) {
            const transformedChildren =
              this.transformBlocksForRendering(children)
            transformedBlock.blocks = transformedChildren
          }

          result.push(transformedBlock)
          break
        }
      }
    }

    return result
  }

  /**
   * Recursively interpolate text in SlackBlock[] structure
   * Finds all "text" properties in the entire tree and interpolates them
   * Handles repeater blocks by expanding blocks for each array item
   */
  private interpolateSlackBlocks(
    blocks: any[],
    data: any,
    translator: any,
    config?: any
  ): any[] {
    const result: any[] = []

    for (const block of blocks) {
      // Handle repeater blocks
      if (block.type === "repeater") {
        const { arrayPath, blocks } = block

        if (arrayPath && blocks) {
          const array = pickValueFromObject(arrayPath, data)

          if (Array.isArray(array) && array.length > 0) {
            // For each item in the array, interpolate blocks
            const interpolatedItemBlocks = array.flatMap(
              (item: any) => {
                return this.interpolateSlackBlocks(
                  blocks,
                  item,
                  translator,
                  {
                    arrayPath: arrayPath,
                  }
                )
              }
            )

            result.push(...interpolatedItemBlocks)
          }
        }
        continue
      }

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

            const processedBlock = {
              ...omit(block, "fieldsPath", "fieldTemplate"),
              fields: interpolatedFieldBlocks,
            }

            result.push(
              this.recursivelyInterpolateText(
                processedBlock,
                data,
                translator,
                config
              )
            )
            continue
          }
        }
      }

      // Process regular blocks
      result.push(
        this.recursivelyInterpolateText(
          block,
          data,
          translator,
          config
        )
      )
    }

    return result
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
