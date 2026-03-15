export interface CollectTreeIdsOptions {
  idKey?: string
  childrenKey?: string
}

/**
 * Recursively collects ids from a tree structure. Traverses depth-first.
 * Skips nodes without an id.
 *
 * @param nodes - Tree nodes (array of root nodes)
 * @param options - idKey (default: "id"), childrenKey (default: "children")
 * @returns Flat array of ids
 *
 * @example
 * collectTreeIds([
 *   { id: "1", children: [{ id: "2", children: [] }] },
 * ])
 * // => ["1", "2"]
 */
export function collectTreeIds(
  nodes: any[],
  options: CollectTreeIdsOptions = {}
): string[] {
  const { idKey = "id", childrenKey = "children" } = options

  return nodes.flatMap((node) => {
    const id = node[idKey]
    const children = node[childrenKey] ?? []
    const self = id ? [id] : []
    return [...self, ...collectTreeIds(children, options)]
  })
}
