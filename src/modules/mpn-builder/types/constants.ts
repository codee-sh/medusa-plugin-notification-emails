export const TEMPLATE_TYPES = {
  SYSTEM_TEMPLATE: "system",
  DB_TEMPLATE: "db",
  EXTERNAL_TEMPLATE: "external",
} as const

/**
 * Locale used when a render or a subscriber is given none
 */
export const DEFAULT_LOCALE = "en"

export const TEMPLATE_TYPES_NAMES: Record<
  keyof typeof TEMPLATE_TYPES,
  string
> = {
  SYSTEM_TEMPLATE: "System Template",
  DB_TEMPLATE: "DB Template",
  EXTERNAL_TEMPLATE: "External Template",
} as const
