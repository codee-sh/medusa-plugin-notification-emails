import { TemplateOptionsType } from "../types";
import { renderHTML, renderText } from "./template";

/**
 * Generates HTML for base template
 * 
 * @param data - Base template data
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export async function getBaseTemplateHtml(
  data: any, 
  options: TemplateOptionsType
): Promise<any> {
  return await renderHTML(data, options);
}

export async function getBaseTemplateText(
  data: any, 
  options: TemplateOptionsType
): Promise<any> {
  return await renderText(data, options);
}
