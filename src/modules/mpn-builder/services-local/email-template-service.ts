import { BaseTemplateService } from "./base-template-service"

import React from "react"
import {
  TemplateRenderParams,
} from "../types"
import {
  pickValueFromObject,
  multiInterpolate,
} from "../../../utils"
import {
  getBaseTemplateHtml,
  getBaseTemplateText,
  getBaseTemplateReactNode,
} from "../../../templates/emails/base-template"
import {
  templateBlocks as ContactFormTemplateBlocks,
  translations as contactFormTranslations,
} from "../../../templates/emails/contact-form"
import {
  templateBlocks as InventoryLevelTemplateBlocks,
  translations as inventoryLevelTranslations,
} from "../../../templates/emails/inventory-level"
import {
  templateBlocks as OrderPlacedTemplateBlocks,
  translations as orderPlacedTranslations,
} from "../../../templates/emails/order/placed"
import {
  templateBlocks as OrderCompletedTemplateBlocks,
  translations as orderCompletedTranslations,
} from "../../../templates/emails/order/completed"
import {
  templateBlocks as OrderUpdatedTemplateBlocks,
  translations as orderUpdatedTranslations,
} from "../../../templates/emails/order/updated"
import {
  TEMPLATES_EMAILS_NAMES,
  TemplateOptionsType,
  TemplateRenderOptionsType,
} from "../types"

export class EmailTemplateService extends BaseTemplateService {
  id = "email"
  label = "Email"

  baseTemplateConfig: any

  constructor() {
    super()

    this.baseTemplateConfig = {
      getHtml: async (
        data: any,
        options?: TemplateOptionsType
      ): Promise<string> => {
        return await getBaseTemplateHtml(
          data,
          options as any
        )
      },
      getText: async (
        data: any,
        options?: TemplateOptionsType
      ): Promise<string> => {
        return await getBaseTemplateText(
          data,
          options as any
        )
      },
      getReactNode: (
        data: any,
        options?: TemplateOptionsType
      ): React.ReactNode => {
        return getBaseTemplateReactNode(
          data,
          options as any
        )
      },
    }

    this.interpolateFunction =
      this.interpolateBlocks.bind(this)

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
    // Contact form template
    this.registerTemplate(TEMPLATES_EMAILS_NAMES.CONTACT_FORM, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: ContactFormTemplateBlocks,
          translations: contactFormTranslations,
        }
      },
    })

    // Order placed template
    this.registerTemplate(TEMPLATES_EMAILS_NAMES.ORDER_PLACED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderPlacedTemplateBlocks,
          translations: orderPlacedTranslations,
        }
      },
    })

    // Order completed template
    this.registerTemplate(TEMPLATES_EMAILS_NAMES.ORDER_COMPLETED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderCompletedTemplateBlocks,
          translations: orderCompletedTranslations,
        }
      },
    })

    // Order updated template
    this.registerTemplate(TEMPLATES_EMAILS_NAMES.ORDER_UPDATED, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: OrderUpdatedTemplateBlocks,
          translations: orderUpdatedTranslations,
        }
      },
    })

    // Inventory level template
    this.registerTemplate(TEMPLATES_EMAILS_NAMES.INVENTORY_LEVEL, {
      ...this.baseTemplateConfig,
      getConfig: (): any => {
        return {
          blocks: InventoryLevelTemplateBlocks,
          translations: inventoryLevelTranslations,
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
    {
      type: "product-item",
      label: "Product Item",
      fields: [
        {
          key: "label",
          label: "Label",
          type: "text",
          required: false,
          name: "label",
          value: "",
          defaultValue: "",
        },
        {
          key: "thumbnail",
          label: "Thumbnail",
          type: "text",
          required: false,
          name: "thumbnail",
          value: "",
          defaultValue: "",
        },
        {
          key: "value",
          label: "Value",
          type: "textarea",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        },
      ],
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
      if (
        processedBlock.props &&
        typeof processedBlock.props === "object"
      ) {
        const processedProps: any = {
          ...processedBlock.props,
        }

        // Iterate over all properties in props
        for (const [key, value] of Object.entries(
          processedProps
        )) {
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
        const { arrayPath, itemBlocks } =
          processedBlock.props || {}

        if (arrayPath && itemBlocks) {
          const array = pickValueFromObject(arrayPath, data)

          if (Array.isArray(array) && array.length > 0) {
            const interpolatedItemBlocks = array.map(
              (item: any) =>
                this.interpolateBlocks(
                  itemBlocks,
                  item,
                  translator,
                  {
                    arrayPath: arrayPath,
                  }
                )[0]
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
  async render(
    params: TemplateRenderParams & {
      options?: TemplateRenderOptionsType
    }
  ): Promise<{
    html: string
    text: string
    subject: string
  }> {
    if (!params.templateName) {
      throw new Error("Template name is required")
    }

    const { template, blocks, translator } =
      this.prepareData({
        templateName: params.templateName,
        data: params.data,
        options: params.options,
      })

    const options = {
      ...params.options,
      blocks,
    }

    console.log(options)

    return {
      html: await template.getHtml(params.data, options),
      text: await template.getText(params.data, options),
      subject: multiInterpolate(
        options?.subject || "{{translations.headerTitle}}",
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
  renderSync(
    params: TemplateRenderParams & {
      options?: TemplateRenderOptionsType
    }
  ): {
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
