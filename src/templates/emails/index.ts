import React from "react";
import { TemplateOptionsType, TemplateRenderOptionsType } from "./types";
import {
  getBaseTemplateHtml,
  getBaseTemplateText,
  getBaseTemplateReactNode,
} from "./base-template/index";

import { TEMPLATES_NAMES } from "./types";

import {
  templateBlocks as ContactFormTemplateBlocks,
  translations as contactFormTranslations,
} from "./contact-form";
import {
  templateBlocks as InventoryLevelTemplateBlocks,
  translations as inventoryLevelTranslations,
} from "./inventory-level";
import {
  templateBlocks as OrderPlacedTemplateBlocks,
  translations as orderPlacedTranslations,
} from "./order-placed";
import {
  templateBlocks as OrderCompletedTemplateBlocks,
  translations as orderCompletedTranslations,
} from "./order-completed";

import {
  createTranslator,
  mergeTranslations,
  pickValueFromObject,
  multiInterpolate,
} from "../../utils";

/**
 * Template names constants
 */
export { TEMPLATES_NAMES };

/**
 * Available templates
 */
export type TemplateName = any

/**
 * Template data type
 */
export type TemplateData = any;

/**
 * Template translations registry mapping template names to their translations
 */
const templateTranslationsRegistry: Partial<
  Record<TemplateName, Record<string, any>>
> = {
  [TEMPLATES_NAMES.INVENTORY_LEVEL]: inventoryLevelTranslations,
};

const baseTemplateConfig: Record<TemplateName, TemplateRenderer> = {
  [TEMPLATES_NAMES.BASE_TEMPLATE]: {
    getHtml: async (
      data: any,
      options?: TemplateOptionsType
    ): Promise<string> => {
      return await getBaseTemplateHtml(data, options as any);
    },
    getText: async (
      data: any,
      options?: TemplateOptionsType
    ): Promise<string> => {
      return await getBaseTemplateText(data, options as any);
    },
    getReactNode: (
      data: any,
      options?: TemplateOptionsType
    ): React.ReactNode => {
      return getBaseTemplateReactNode(data, options as any);
    },
  }
};

/**
 * Template registry mapping template names to their renderers
 */
const templateRegistry: Record<
  TemplateName,
  TemplateRenderer & {
    getReactNode?: (
      data: any,
      options?: TemplateOptionsType
    ) => React.ReactNode;
  }
> = {
  ...baseTemplateConfig,
  [TEMPLATES_NAMES.CONTACT_FORM]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: ContactFormTemplateBlocks,
        translations: contactFormTranslations,
      };
    },
  },
  [TEMPLATES_NAMES.ORDER_PLACED]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: OrderPlacedTemplateBlocks,
        translations: orderPlacedTranslations,
      };
    },
  },
  [TEMPLATES_NAMES.ORDER_COMPLETED]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: OrderCompletedTemplateBlocks,
        translations: orderCompletedTranslations,
      };
    },
  },
  [TEMPLATES_NAMES.INVENTORY_LEVEL]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: InventoryLevelTemplateBlocks,
        translations: inventoryLevelTranslations,
      };
    },
  }
};

/**
 * Template renderer interface
 */
export interface TemplateRenderer {
  getHtml: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getText: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getReactNode?: (data: any, options?: TemplateOptionsType) => any;
  getConfig?: () => any;
}

/**
 * Recursively interpolate text in blocks
 * Processes props.text in each block and nested blocks
 */
export function interpolateBlocks(
  blocks: any[],
  data: any,
  translator: any,
  config?: any
): any[] {
  return blocks.map((block) => {
    const processedBlock = { ...block };

    // Process all string properties in props
    if (processedBlock.props && typeof processedBlock.props === "object") {
      const processedProps: any = { ...processedBlock.props };
      
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
          );
        }
      }
      
      processedBlock.props = processedProps;
    }

    // Recursively process nested blocks
    if (
      processedBlock.props?.blocks &&
      Array.isArray(processedBlock.props.blocks)
    ) {
      processedBlock.props = {
        ...processedBlock.props,
        blocks: interpolateBlocks(
          processedBlock.props.blocks,
          data,
          translator
        ),
      };
    }

    if (processedBlock.type === "repeater") {
      const { arrayPath, itemBlocks } = processedBlock.props || {};

      if (arrayPath && itemBlocks) {
        const array = pickValueFromObject(arrayPath, data);

        if (Array.isArray(array) && array.length > 0) {
          const interpolatedItemBlocks = array.map((item: any) =>
            interpolateBlocks(itemBlocks, item, translator, {
              arrayPath: arrayPath,
            })
          )[0];

          processedBlock.props = {
            ...processedBlock.props,
            itemBlocks: interpolatedItemBlocks,
          };
        }
      }
    }

    return processedBlock;
  });
}

/**
 * Get template renderer by template name
 *
 * @param templateName - Name of the template
 * @returns Template renderer with getHtml and getText methods
 * @throws Error if template name is not found
 */
export function getTemplate(templateName: any): TemplateRenderer {
  const template = templateRegistry[templateName];

  if (!template) {
    throw new Error(
      `Template "${templateName}" not found. Available templates: ${Object.keys(templateRegistry).join(", ")}`
    );
  }

  return template;
}

/**
 * Prepare template data (translations, blocks, translator, processedBlocks)
 * Shared logic for renderTemplate and renderTemplateSync
 */
function prepareTemplateData(
  templateName: TemplateName,
  data: TemplateData,
  options?: TemplateRenderOptionsType
): {
  template: TemplateRenderer;
  translator: { t: (key: string, data?: Record<string, any>) => string };
  processedBlocks: any[];
  renderOptions: TemplateOptionsType;
} {
  const locale = options?.locale || "pl";
  const template = getTemplate(templateName);
  const config = template.getConfig?.() || {};

  // Get translations for this template
  const translations = config?.translations || templateTranslationsRegistry[templateName] || {};

  // If blocks are not provided, use basic blocks from config
  const providedBlocks = options?.blocks || [];
  let blocks = providedBlocks.length > 0 ? providedBlocks : config?.blocks || [];

  // Process translations once
  const customTranslations = options?.customTranslations?.[templateName];

  // Merge translations
  const mergedTranslations = mergeTranslations(
    translations,
    customTranslations
  );

  // Create translator function
  const translator = createTranslator(locale, mergedTranslations as any);

  // Interpolate blocks if provided
  const processedBlocks =
    blocks.length > 0 ? interpolateBlocks(blocks, data, translator) : blocks;

  // Pass processed blocks in options to render functions
  const renderOptions: TemplateOptionsType = {
    ...options,
    blocks: processedBlocks,
  };

  return {
    template,
    translator,
    processedBlocks,
    renderOptions,
  };
}

/**
 * Generate HTML and text for a template
 *
 * @param templateName - Name of the template (optional if createTemplate is provided)
 * @param data - Template data
 * @param options - Optional theme and locale configuration
 * @param createTemplate - Optional custom template function that takes data and options, returns React.ReactElement
 * @returns Object with html, text, and subject properties
 */
export async function renderTemplate(
  templateName: TemplateName | null,
  data: TemplateData,
  options?: TemplateRenderOptionsType,
  createTemplate?: (
    data: TemplateData,
    options: TemplateOptionsType
  ) => React.ReactElement<any>
): Promise<{
  html: any;
  text: any;
  subject: string;
  reactNode?: React.ReactNode;
}> {
  // // If createTemplate is provided, use custom template
  // if (createTemplate) {
  //   // Create basic i18n if not provided (for custom templates)
  //   let i18n = options?.customTranslations?.[templateName];
  //   if (!i18n) {
  //     // Create a simple i18n object for custom templates
  //     i18n = {
  //       t: (key: string, data?: any) => {
  //         // Try to get from customTranslations if available
  //         if (options?.customTranslations && templateName) {
  //           const custom = options.customTranslations[templateName];
  //           if (custom && custom[key]) {
  //             return typeof custom[key] === "function"
  //               ? custom[key](data)
  //               : custom[key];
  //           }
  //         }
  //         // Fallback to key or empty string
  //         return key;
  //       },
  //     };
  //   }

  //   // Pass processed i18n in options to render functions
  //   const renderOptions: TemplateOptionsType = {
  //     ...options,
  //     i18n,
  //   };

  //   // Render React component to HTML
  //   const reactNode = createTemplate(data, renderOptions);
  //   const htmlRendered = await render(reactNode);
  //   const html = await pretty(htmlRendered);
  //   const text = toPlainText(htmlRendered);

  //   // Get subject from i18n or use default
  //   const subject = i18n.t("headerTitle", data) || "Email";

  //   return {
  //     html,
  //     text,
  //     subject,
  //   };
  // }

  // Original behavior: use template from registry
  if (!templateName) {
    throw new Error("Either templateName or createTemplate must be provided");
  }

  const { template, translator, renderOptions } = prepareTemplateData(templateName, data, options);

  return {
    html: await template.getHtml(data, renderOptions),
    text: await template.getText(data, renderOptions),
    subject: multiInterpolate("{{translations.headerTitle}}", data, translator),
  };
}

export function renderTemplateSync(
  templateName: TemplateName | null,
  data: TemplateData,
  options?: TemplateRenderOptionsType
): any {
  if (!templateName) {
    throw new Error("Either templateName or createTemplate must be provided");
  }

  const { template, renderOptions } = prepareTemplateData(templateName, data, options);

  return {
    reactNode: template.getReactNode
      ? template.getReactNode(data, renderOptions)
      : undefined,
  };
}
