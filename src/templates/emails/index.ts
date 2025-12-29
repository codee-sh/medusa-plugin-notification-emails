import React from "react";
import { TemplateOptionsType, TemplateRenderOptionsType } from "./types";

import { TEMPLATES_NAMES } from "./types";

import {
  pickValueFromObject,
  multiInterpolate,
} from "../../utils";
import {
  TemplateName,
  TemplateData,
  BaseTemplateRenderer,
  prepareTemplateData,
} from "../shared";

import {
  getBaseTemplateHtml,
  getBaseTemplateText,
  getBaseTemplateReactNode,
} from "./base-template/index";
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
} from "./order/placed";
import {
  templateBlocks as OrderCompletedTemplateBlocks,
  translations as orderCompletedTranslations,
} from "./order/completed";
import {
  templateBlocks as OrderUpdatedTemplateBlocks,
  translations as orderUpdatedTranslations,
} from "./order/updated";

/**
 * Template names constants
 */
export { TEMPLATES_NAMES };

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
  TemplateRenderer
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
  [TEMPLATES_NAMES.ORDER_UPDATED]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: OrderUpdatedTemplateBlocks,
        translations: orderUpdatedTranslations,
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
 * Template renderer interface for email channel
 */
export interface TemplateRenderer extends BaseTemplateRenderer {
  getHtml: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getText: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getReactNode?: (data: any, options?: TemplateOptionsType) => any;
}

/**
 * Recursively interpolate text in blocks
 * Processes props.[property] in each block and nested blocks
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
          (typeof value === "string") &&
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
            })[0]
          );

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
 * Prepare template data wrapper for email channel
 * Uses shared prepareTemplateData with email-specific interpolateBlocks
 */
function prepareEmailTemplateData({
  templateName,
  data,
  options = {},
}: {
  templateName: TemplateName;
  data: TemplateData;
  options?: TemplateRenderOptionsType;
}): {
  template: TemplateRenderer;
  translator: { t: (key: string, data?: Record<string, any>) => string };
  renderOptions: TemplateOptionsType;
} {
  return prepareTemplateData<TemplateRenderer>({
    templateName,
    data,
    templateRegistry,
    interpolateFunction: interpolateBlocks,
    options,
  });
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

  const { template, renderOptions, translator } = prepareEmailTemplateData({
    templateName,
    data,
    options,
  });

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

  const { template, renderOptions } = prepareEmailTemplateData({
    templateName,
    data,
    options,
  });

  return {
    reactNode: template.getReactNode
      ? template.getReactNode(data, renderOptions)
      : undefined,
  };
}
