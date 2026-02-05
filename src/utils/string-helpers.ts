/**
 * Converts a string to kebab-case format
 * 
 * @example
 * toKebabCase("Order Placed") // "order-placed"
 * toKebabCase("order_placed") // "order-placed"
 * toKebabCase("OrderPlaced") // "order-placed"
 */
export function toKebabCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, and hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
}
