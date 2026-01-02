import { transformOrderData } from "./order-transformer"

/**
 * Supported context types for data transformation
 */
export type ContextType = any

/**
 * Transform raw context data to email template format
 *
 * This function transforms raw data from API/subscribers/workflows into
 * a format suitable for email templates (formatted dates, amounts, addresses, etc.)
 *
 * @param contextType - Type of context data (e.g., "order", "inventory_level")
 * @param rawData - Raw data from API/subscribers/workflows
 * @param localeCode - Locale code for formatting (default: "pl")
 * @returns Transformed data ready for template rendering
 *
 * @example
 * ```typescript
 * const transformedData = transformContext("order", rawOrderData, "pl")
 * await renderTemplate("order-placed", transformedData, { locale: "pl" })
 * ```
 */
export function transformContext(
  contextType: ContextType | string | null | undefined,
  rawData: any,
  localeCode: string = "pl"
): any {
  if (!contextType || !rawData) {
    return rawData
  }

  switch (contextType) {
    case "order":
      return {
        [contextType]: transformOrderData(
          rawData[contextType],
          localeCode
        ),
      }

    case "inventory_level":
      // Inventory level data doesn't need transformation (uses raw data directly)
      return rawData

    case "payment":
      // Payment data transformation can be added here if needed
      return rawData

    default:
      // Unknown context type - return raw data as-is
      return rawData
  }
}
