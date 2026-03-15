/**
 * Removes empty strings, null, and undefined from an object.
 * Returns null for null/undefined input.
 *
 * @param value - Object to compact
 * @returns New object without empty values, or null
 *
 * @example
 * compactObject({ a: "ok", b: "", c: null, d: undefined })
 * // => { a: "ok" }
 */
export function compactObject(
  value: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (!value) {
    return null
  }

  return Object.entries(value).reduce(
    (acc, [key, item]) => {
      if (item === "" || item === undefined || item === null) {
        return acc
      }
      acc[key] = item
      return acc
    },
    {} as Record<string, unknown>
  )
}
