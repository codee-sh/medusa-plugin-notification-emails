import { pickValueFromObject, isObject } from "../index"
import { DEFAULT_LOCALE } from "../../modules/mpn-builder/types/constants"

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
  if (
    !isObject(translations) ||
    !(translations as any).general
  ) {
    return translations
  }

  // Extract 'general' properties to root level
  const { general, ...rest } = translations as any
  return { ...general, ...rest }
}

/**
 * Get variable value from text
 */
export function getVariableValue(text: string): {
  replaced: string
  original: string
} {
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
    original: text,
  }
}

/**
 * Options of multiInterpolate
 */
export type InterpolateConfig = {
  /**
   * Array path of the repeater item the data belongs to. Data placeholders then read
   * `{{data.<arrayPath>.<field>}}` from the item.
   */
  arrayPath?: string
  /**
   * Applied to every value that comes from data, never to translation text, which the template
   * author owns. Pass escapeHtml when the result is rendered as HTML.
   */
  escape?: (value: string) => string
  /**
   * Replaces a data placeholder with no value by an empty string instead of keeping it.
   */
  emptyMissing?: boolean
}

const VARIABLE_REGEX =
  /\{\{((?:data\.|translations\.)?\w+(?:\.\w+)*)\}\}/g

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/**
 * Escapes the characters that HTML would read as markup
 */
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) => HTML_ESCAPES[character]
  )
}

/**
 * Group interpolate - handles variables with prefixes (data. or translations.)
 *
 * Variables with prefix `data.` are resolved using pickValueFromObject function
 * Variables with prefix `translations.` are resolved using translator.t function, and the
 * translation text is interpolated in turn.
 *
 * The text is scanned once: a value inserted from data is never interpolated again, so a
 * `{{...}}` inside a value stays literal, and `$&` or `$1` inside a value is inserted as is.
 *
 * @param text - Text with {{data.variable}} or {{translations.key}} placeholders
 * @param data - Data object for interpolation
 * @param translator - Translator instance with t method
 * @param config - Interpolation options, see InterpolateConfig
 * @returns Interpolated text
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
  translator: {
    t: (key: string, data?: Record<string, any>) => string
  },
  config?: InterpolateConfig
): string {
  if (!text || typeof text !== "string") {
    return text
  }

  const dataPrefix = config?.arrayPath
    ? `data.${config.arrayPath}.`
    : "data."

  return text.replace(
    VARIABLE_REGEX,
    (match: string, variable: string) => {
      if (variable.startsWith(dataPrefix)) {
        const value = pickValueFromObject(
          variable.slice(dataPrefix.length),
          data
        )

        if (value === undefined || value === null) {
          return config?.emptyMissing ? "" : match
        }

        const stringValue = String(value)

        return config?.escape
          ? config.escape(stringValue)
          : stringValue
      }

      if (variable.startsWith("translations.")) {
        const translation = translator.t(
          variable.slice("translations.".length),
          data
        )

        return multiInterpolate(
          translation,
          data,
          translator,
          config
        )
      }

      return match
    }
  )
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
  // Get translations for locale with fallback to the default locale
  const localeTranslations =
    translations[locale] ||
    translations[DEFAULT_LOCALE] ||
    {}

  // Flatten translations structure
  const flatTranslations = flattenTranslations(
    localeTranslations
  )

  const { replaced, original } = getVariableValue(key)

  // Get translation value (supports nested keys)
  const translation = pickValueFromObject(
    replaced as any,
    flatTranslations as any
  )

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
  translations: Record<string, any>
): {
  t: (key: string, data?: Record<string, any>) => string
} {
  return {
    t: (key: string, data: Record<string, any> = {}) => {
      return t(locale, translations, key)
    },
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
