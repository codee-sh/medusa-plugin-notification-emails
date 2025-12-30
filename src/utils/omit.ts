/**
 * Creates a new object without the specified keys
 * Does not mutate the original object
 * 
 * @param obj - Source object
 * @param keys - Keys to omit from the object
 * @returns New object without the specified keys
 * 
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * omit(obj, 'a', 'c') // { b: 2 }
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result as Omit<T, K>
}

