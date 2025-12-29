import { SlackTemplateOptions } from "../types";
import { renderBlocks } from "./template";

/**
 * Generates HTML for base template
 * 
 * @param data - Base template data
 * @param options - Optional theme and locale configuration
 * @returns HTML string ready to send
 */
export async function getBaseBlocks(
  data: any, 
  options: any
): Promise<any> {
  return await renderBlocks(data, options);
}