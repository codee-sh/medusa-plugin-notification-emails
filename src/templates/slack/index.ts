import React from "react";
import { TEMPLATES_NAMES } from "./types";

import {
  templateBlocks as InventoryLevelTemplateBlocks,
  translations as inventoryLevelTranslations,
} from "./inventory-level";
import {
  templateBlocks as ProductTemplateBlocks,
  translations as productTranslations,
} from "./product";
import {
  templateBlocks as ProductVariantTemplateBlocks,
  translations as productVariantTranslations,
} from "./product-variant";

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

/**
 * Template names constants
 */
export { TEMPLATES_NAMES };

/**
 * Template renderer interface for Slack channel
 */
export interface TemplateRenderer extends BaseTemplateRenderer {}

const baseTemplateConfig: Record<TemplateName, TemplateRenderer> = {
  [TEMPLATES_NAMES.BASE_TEMPLATE]: {}
};

/**
 * Template registry mapping template names to their renderers
 */
const templateRegistry: Record<
  TemplateName,
  TemplateRenderer
> = {
  ...baseTemplateConfig,
  [TEMPLATES_NAMES.INVENTORY_LEVEL]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: InventoryLevelTemplateBlocks,
        translations: inventoryLevelTranslations,
      };
    },
  },
  [TEMPLATES_NAMES.PRODUCT]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: ProductTemplateBlocks,
        translations: productTranslations,
      };
    },
  },
  [TEMPLATES_NAMES.PRODUCT_VARIANT]: {
    ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
    getConfig: (): any => {
      return {
        blocks: ProductVariantTemplateBlocks,
        translations: productVariantTranslations,
      };
    },
  }
};

/**
 * Recursively interpolate text in SlackBlock[] structure
 * Finds all "text" properties in the entire tree and interpolates them
 * 
 * This function works on SlackBlock[] after rendering (Slack API format)
 * It recursively searches for all "text" properties regardless of nesting level
 * 
 * @param blocks - SlackBlock[] array (Slack API format)
 * @param data - Data object for interpolation
 * @param translator - Translator instance
 * @param config - Optional config (e.g., arrayPath for repeater)
 * @returns Interpolated SlackBlock[] array
 */
export function interpolateSlackBlocks(
  blocks: any[],
  data: any,
  translator: any,
  config?: any
): any[] {
  return blocks.map((block) => {
    // Create fields array if fieldTemplate and fieldsPath is provided and array is not empty
    if (block.type === "section" && block?.fieldTemplate) {
      const { fieldsPath, fieldTemplate } = block || {};
      
      if (fieldsPath && fieldTemplate) {
        const array = pickValueFromObject(fieldsPath, data);
  
        if (Array.isArray(array) && array.length > 0) {
          const interpolatedFieldBlocks = array.map((item: any) => {
            return recursivelyInterpolateText(fieldTemplate, item, translator, {
              arrayPath: fieldsPath,
            });
          });
  
          block = {
            ...block,
            fields: interpolatedFieldBlocks,
          };
        }
      }
    }  
  
    return recursivelyInterpolateText(block, data, translator, config);
  });
}

/**
 * Recursively interpolate all "text" / "url" properties in an object
 * 
 * This function traverses the entire object tree and interpolates:
 * - All string values in "text" properties
 * - Works with nested structures (blocks.text.text, elements[].text.text, etc.)
 * - Handles arrays and objects recursively
 * 
 * @param obj - Object to process (can be SlackBlock, array, or any nested structure)
 * @param data - Data object for interpolation
 * @param translator - Translator instance
 * @param config - Optional config (e.g., arrayPath for repeater)
 * @returns Processed object with interpolated text
 */
function recursivelyInterpolateText(
  node: any,
  data: any,
  translator: any,
  config?: any
): any {
  // If it's a string, interpolate it
  if (typeof node === "string") {
    return multiInterpolate(node, data, translator, config);
  }

  // If it's an array, process each element recursively
  if (Array.isArray(node)) {
    return node.map((item) => {
      return recursivelyInterpolateText(item, data, translator, config);      
    });
  }

  // If it's an object, process all properties
  if (node && typeof node === "object") {
    const processed: any = {};

    for (const [key, value] of Object.entries(node)) {
      // If key is "text" and value is a string, interpolate it
      if ((key === "text" || key === "url") && typeof value === "string") {
        processed[key] = multiInterpolate(value, data, translator, config);
      }
      // If key is "text" and value is an object (e.g., { type: "plain_text", text: "..." })
      else if (key === "text" && value && typeof value === "object") {
        // Recursively process the text object (will interpolate text.text)
        processed[key] = recursivelyInterpolateText(value, data, translator, config);
      }
      // If key is "elements" and value is an array (e.g., { type: "plain_text", text: "..." })
      else if (key === "elements" && Array.isArray(value)) {
        processed[key] = value.map((item: any) => {
          return recursivelyInterpolateText(item, data, translator, config);
        });  
      }
      // For all other properties, recursively process them
      else {
        processed[key] = value;
      }
    }

    return processed;
  }

  return node;
}

/**
 * Prepare template data wrapper for Slack channel
 * Uses shared prepareTemplateData with Slack-specific interpolateSlackBlocks
 */
function prepareSlackTemplateData({
  templateName,
  data,
  options = {},
}: {
  templateName: TemplateName;
  data: TemplateData;
  options?: any;
}): {
  template: TemplateRenderer;
  translator: { t: (key: string, data?: Record<string, any>) => string };
  renderOptions: any;
} {
  return prepareTemplateData<TemplateRenderer>({
    templateName,
    data,
    templateRegistry,
    interpolateFunction: interpolateSlackBlocks,
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
export async function renderSlackTemplate(
  templateName: TemplateName | null,
  data: TemplateData,
  options?: any,
  createTemplate?: (
    data: TemplateData,
    options: any
  ) => React.ReactElement<any>
): Promise<{
  blocks: any[];
}> {
  // Original behavior: use template from registry
  if (!templateName) {
    throw new Error("Either templateName or createTemplate must be provided");
  }

  const { template, translator, renderOptions } = prepareSlackTemplateData({
    templateName,
    data,
    options,
  });

  return {
    blocks: renderOptions?.blocks || []
  };
}