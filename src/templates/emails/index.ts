import React from "react";
import { render, pretty, toPlainText } from "@react-email/render";
import { TemplateOptionsType, TemplateRenderOptionsType } from "./types";
import { getContactFormHtml, getContactFormText } from "./contact-form/index";
import { getOrderCreatedHtml, getOrderCreatedText } from "./order-placed/index";
import { getOrderCompletedHtml, getOrderCompletedText } from "./order-completed/index";
import { getInventoryLevelHtml, getInventoryLevelText } from "./inventory-level/index";
import { getBaseTemplateHtml, getBaseTemplateText } from "./base-template/index";

import { TEMPLATES_NAMES } from "./types";
import { translations as orderPlacedTranslations } from "./order-placed/translations";
import { translations as orderCompletedTranslations } from "./order-completed/translations";
import { translations as inventoryLevelTranslations } from "./inventory-level/translations";

import { createTranslator, mergeTranslations, pickValueFromObject, multiInterpolate } from "../../utils";

/**
 * Template names constants
 */
export { TEMPLATES_NAMES };

/**
 * Available templates
 */
export type TemplateName = (typeof TEMPLATES_NAMES)[keyof typeof TEMPLATES_NAMES];

/**
 * Template data type
 */
export type TemplateData = any

/**
 * Recursively interpolate text in blocks
 * Processes props.text in each block and nested blocks
 */
function interpolateBlocks(blocks: any[], data: any, translator: any, config?: any): any[] {
  return blocks.map(block => {
    const processedBlock = { ...block };
    
    // Process props.value if exists
    if (processedBlock.props?.value && typeof processedBlock.props.value === 'string') {
      processedBlock.props = {
        ...processedBlock.props,
        label: processedBlock.props.label ? multiInterpolate(processedBlock.props.label, data, translator, config) : undefined,
        value: multiInterpolate(processedBlock.props.value, data, translator, config)
      };
    }
    
    // Recursively process nested blocks
    if (processedBlock.props?.blocks && Array.isArray(processedBlock.props.blocks)) {
      processedBlock.props = {
        ...processedBlock.props,
        blocks: interpolateBlocks(processedBlock.props.blocks, data, translator)
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
          );
          
          processedBlock.props = {
            ...processedBlock.props,
            itemBlocks: interpolatedItemBlocks
          };
        }
      }
    }
    
    return processedBlock;
  });
}

/**
 * Template translations registry mapping template names to their translations
 */
const templateTranslationsRegistry: Partial<Record<TemplateName, Record<string, any>>> = {
  [TEMPLATES_NAMES.ORDER_PLACED]: orderPlacedTranslations,
  [TEMPLATES_NAMES.ORDER_COMPLETED]: orderCompletedTranslations,
  [TEMPLATES_NAMES.INVENTORY_LEVEL]: inventoryLevelTranslations,
};

/**
 * Template registry mapping template names to their renderers
 */
const templateRegistry: Record<TemplateName, TemplateRenderer> = {
  [TEMPLATES_NAMES.CONTACT_FORM]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getContactFormHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getContactFormText(data, options as any);
    },
  },
  [TEMPLATES_NAMES.ORDER_PLACED]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCreatedHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCreatedText(data, options as any);
    },
  },
  [TEMPLATES_NAMES.ORDER_COMPLETED]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCompletedHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getOrderCompletedText(data, options as any);
    },
  },
  [TEMPLATES_NAMES.INVENTORY_LEVEL]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getInventoryLevelHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getInventoryLevelText(data, options as any);
    },
  },
  [TEMPLATES_NAMES.BASE_TEMPLATE]: {
    getHtml: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getBaseTemplateHtml(data, options as any);
    },
    getText: async (data: any, options?: TemplateOptionsType): Promise<string> => {
      return await getBaseTemplateText(data, options as any);
    },
  },
};

/**
 * Template renderer interface
 */
export interface TemplateRenderer {
  getHtml: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getText: (data: any, options?: TemplateOptionsType) => Promise<string>;
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
  createTemplate?: (data: TemplateData, options: TemplateOptionsType) => React.ReactElement<any>
): Promise<{ html: any; text: any; subject: string }> {
  const locale = options?.locale || "pl";
  const blocks = options?.blocks || [];
  
  // If createTemplate is provided, use custom template
  if (createTemplate) {
    // Create basic i18n if not provided (for custom templates)
    let i18n = options?.i18n;
    if (!i18n) {
      // Create a simple i18n object for custom templates
      i18n = {
        t: (key: string, data?: any) => {
          // Try to get from customTranslations if available
          if (options?.customTranslations && templateName) {
            const custom = options.customTranslations[templateName];
            if (custom && custom[key]) {
              return typeof custom[key] === 'function' ? custom[key](data) : custom[key];
            }
          }
          // Fallback to key or empty string
          return key;
        }
      };
    }

    // Pass processed i18n in options to render functions
    const renderOptions: TemplateOptionsType = {
      ...options,
      i18n,
    };

    // Render React component to HTML
    const reactNode = createTemplate(data, renderOptions);
    const htmlRendered = await render(reactNode);
    const html = await pretty(htmlRendered);
    const text = toPlainText(htmlRendered);

    // Get subject from i18n or use default
    const subject = i18n.t("headerTitle", data) || "Email";

    return {
      html,
      text,
      subject,
    };
  }

  // Original behavior: use template from registry
  if (!templateName) {
    throw new Error("Either templateName or createTemplate must be provided");
  }

  const template = getTemplate(templateName);

  // Get translations for this template
  const translations = templateTranslationsRegistry[templateName] || {};
  
  // Process translations once in renderTemplate
  const customTranslations = options?.customTranslations?.[templateName];

  // Merge translations
  const mergedTranslations = mergeTranslations(
    translations,
    customTranslations
  )

  // Create translator function
  const translator = createTranslator(locale, mergedTranslations as any)

  // Interpolate blocks if provided
  const processedBlocks = blocks.length > 0 
    ? interpolateBlocks(blocks, data, translator)
    : blocks;

  // Pass processed blocks in options to render functions
  const renderOptions: TemplateOptionsType = {
    ...options,
    blocks: processedBlocks
  };

  return {
    html: await template.getHtml(data, renderOptions),
    text: await template.getText(data, renderOptions),
    subject: multiInterpolate("{{translations.headerTitle}}", data, translator),
  };
}
