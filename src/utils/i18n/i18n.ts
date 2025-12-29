import {
  pickValueFromObject,
  isObject
} from "../index"

/**
 * Simple i18n utility for templates
 * Provides basic translation functionality without external dependencies
 */

/**
 * Flatten translations structure - extracts 'general' object properties to root level
 * This allows JSON files to have nested structure while templates use flat structure
 *
 * @param translations - Translations object (may contain 'general' wrapper)
 * @returns Flattened translations object
 */
function flattenTranslations(translations: any): any {
  if (!isObject(translations) || !(translations as any).general) {
    return translations
  }

  // Extract 'general' properties to root level
  const { general, ...rest } = translations as any
  return { ...general, ...rest }
}

/**
 * Get variable value from text
 */
export function getVariableValue(
  text: string
): { replaced: string, original: string } {
  if (!text || typeof text !== "string") {
    return { replaced: text, original: text }
  }

  return {
    replaced: text.replace(
      /\{\{(\w+(?:\.\w+)*)\}\}/g,
      (match, key) => {
        return key
      }
    ),
    original: text
  }
}

/**
 * Group interpolate - handles variables with prefixes (data. or translations.)
 * 
 * Variables with prefix `data.` are resolved using interpolate function
 * Variables with prefix `translations.` are resolved using translator.single
 * 
 * @param text - Text with {{data.variable}} and {{translations.key}} placeholders
 * @param data - Data object for interpolation
 * @param translator - Translator instance with single method
 * @returns Interpolated text with all variables resolved
 * 
 * @example
 * multiInterpolate(
 *   "Order {{data.order.id}} - {{translations.headerTitle}}",
 *   { order: { id: "123" } },
 *   translator
 * )
 * // Returns: "Order 123 - Order Confirmation"
 */
export function multiInterpolate(
  text: string,
  data: Record<string, any> = {},
  translator: { t: (key: string, data?: Record<string, any>) => string },
  config?: any
): string {
  if (!text || typeof text !== "string") {
    return text
  }

  // Find all variables in format {{...}}
  const variableRegex = /\{\{((?:data\.|translations\.)?\w+(?:\.\w+)*)\}\}/g
  const matches = Array.from(text.matchAll(variableRegex))
  
  if (matches.length === 0) {
    return text
  }

  // Build dynamic data prefix array (e.g., ["data"] or ["data", "items"])
  const dataPrefix = config?.arrayPath 
    ? ["data", config.arrayPath]
    : ["data"]
  const dataPrefixString = dataPrefix.join(".")

  // Process each variable separately
  let result = text
  for (const match of matches) {
    const fullMatch = match[0] // e.g., "{{data.order.id}}"
    const variable = match[1]  // e.g., "data.order.id"
    
    let replacement: string | undefined

    // Check if variable starts with dynamic data prefix
    if (variable.startsWith(`${dataPrefixString}.`)) {
      const escapedPrefix = dataPrefixString.replace(/\./g, '\\.')
      const dataPath = variable.replace(new RegExp(`^${escapedPrefix}\\.`), "")
      const value = pickValueFromObject(dataPath, data)

      if (value === undefined || value === null) {
        replacement = undefined
      } else {
        replacement = String(value)
      }
    }
    // Check if variable starts with translations. prefix
    else if (variable.startsWith("translations.")) {
      const translationKey = variable.replace(/^translations\./, "")
      replacement = translator.t(translationKey, data)
      replacement = multiInterpolate(replacement, data, translator)
    }
    
    // Replace the variable in text if we found a replacement
    if (replacement !== undefined) {
      result = result.replace(fullMatch, replacement)
    }
  }

  return result
}

/**
 * Simple translation function
 *
 * @param locale - Target locale (e.g., 'pl', 'en')
 * @param translations - Record of translations by locale
 * @param key - Translation key (supports dot notation: "labels.inventoryLevelId")
 * @param data - Data for interpolation
 * @returns Translated and interpolated text
 */
export function t(
  locale: string,
  translations: Record<string, any>,
  key: string
): string {
  // Get translations for locale with fallback to 'pl'
  const localeTranslations =
    translations[locale] || translations["pl"] || {}

  // Flatten translations structure
  const flatTranslations = flattenTranslations(
    localeTranslations
  )

  const { replaced, original } = getVariableValue(key)

  // Get translation value (supports nested keys)
  const translation = pickValueFromObject(replaced as any, flatTranslations as any)

  // Use key as fallback if translation not found
  const text = translation || original

  return text
}

/**
 * Create a translator function
 * 
 * @param locale - Target locale (e.g., 'pl', 'en')
 * @param translations - Record of translations by locale
 * @returns Translator function that takes (key, data?) and returns translated string
 */
export function createTranslator(
  locale: string,
  translations: Record<string, any>,
): { t: (key: string, data?: Record<string, any>) => string } {
  return {
    t: (key: string, data: Record<string, any> = {}) => {
      return t(locale, translations, key)
    }
  }
}

/**
 * Merge custom translations with base translations
 * Custom translations override base translations
 *
 * @param baseTranslations - Base translations object
 * @param customTranslations - Custom translations to merge (optional)
 * @returns Merged translations object
 */
export function mergeTranslations(
  baseTranslations: Record<string, any>,
  customTranslations?: Record<string, any>
): Record<string, any> {
  if (
    !customTranslations ||
    !isObject(customTranslations)
  ) {
    return baseTranslations
  }

  const merged: Record<string, any> = {
    ...baseTranslations,
  }

  for (const [lang, custom] of Object.entries(
    customTranslations
  )) {
    if (isObject(custom)) {
      merged[lang] = {
        ...baseTranslations[lang],
        general: {
          ...(baseTranslations[lang]?.general || {}),
          ...((custom as any)?.general || (custom as any)),
        },
      }
    }
  }

  return merged
}
