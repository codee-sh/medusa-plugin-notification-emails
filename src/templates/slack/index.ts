import React from "react";
import { SlackTemplateOptions } from "./types";
import {
  getBaseBlocks,
} from "./base-template/index";

import { TEMPLATES_NAMES } from "./types";

// import {
//   templateBlocks as InventoryLevelTemplateBlocks,
//   translations as inventoryLevelTranslations,
// } from "./inventory-level";

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
  // [TEMPLATES_NAMES.INVENTORY_LEVEL]: inventoryLevelTranslations,
};

const baseTemplateConfig: Record<TemplateName, TemplateRenderer> = {
  [TEMPLATES_NAMES.BASE_TEMPLATE]: {
    getBlocks: async (
      data: any,
      options?: any
    ): Promise<any[]> => {
      return await getBaseBlocks(data, options as any);
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
      options?: any
    ) => React.ReactNode;
  }
> = {
  ...baseTemplateConfig,
  // [TEMPLATES_NAMES.INVENTORY_LEVEL]: {
  //   ...baseTemplateConfig[TEMPLATES_NAMES.BASE_TEMPLATE],
  //   getConfig: (): any => {
  //     return {
  //       blocks: InventoryLevelTemplateBlocks,
  //       translations: inventoryLevelTranslations,
  //     };
  //   },
  // }
};

/**
 * Template renderer interface
 */
export interface TemplateRenderer {
  getBlocks: (data: any, options?: any) => Promise<any[]>;
  getConfig?: () => any;
}

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
 * Parameters for prepareTemplateData function
 */
interface PrepareTemplateDataParams {
  templateName: TemplateName;
  data: TemplateData;
  interpolateFunction: (...args: any[]) => any;
  options?: any;
}

/**
 * Prepare template data (translations, blocks, translator, processedBlocks)
 * Shared logic for renderTemplate and renderTemplateSync
 */
function prepareTemplateData({
  templateName,
  data,
  interpolateFunction,
  options = {},
}: PrepareTemplateDataParams): {
  template: TemplateRenderer;
  translator: { t: (key: string, data?: Record<string, any>) => string };
  processedBlocks: any[];
  renderOptions: any;
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
    blocks.length > 0 ? interpolateFunction(blocks, data, translator) : blocks;

  // Pass processed blocks in options to render functions
  const renderOptions: SlackTemplateOptions = {
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

  const { template, translator, renderOptions } = prepareTemplateData({
    templateName,
    data,
    interpolateFunction: interpolateSlackBlocks,
    options,
  });

  return {
    blocks: renderOptions?.blocks || []
  };
}