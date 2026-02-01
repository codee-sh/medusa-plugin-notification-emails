import { TemplateOptionsType } from "../../../modules/mpn-builder/types"
import {
  renderHTML,
  renderText,
  renderHTMLReact,
} from "./template"

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
  return await renderHTML(data, options)
}

export async function getBaseTemplateText(
  data: any,
  options: TemplateOptionsType
): Promise<any> {
  return await renderText(data, options)
}

export function getBaseTemplateReactNode(
  data: any,
  options: TemplateOptionsType
): React.ReactNode {
  return renderHTMLReact(data, options)
}
