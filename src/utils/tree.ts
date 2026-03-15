import {
  BuildTreeOptions,
  FlattenTreeOptions,
} from "./types"

/**
 * Converts a flat list of items (with parent_id references) into a hierarchical
 * tree structure. Each node gets a `children` array. Roots are items with
 * no parent or unknown parent. Nodes are sorted recursively by the specified
 * sort key (default: position).
 *
 * @param items - Flat array of records with id and parent reference
 * @param options - parentKey, sortKey, sort
 * @returns Array of root nodes with nested children
 *
 * @example
 * buildTree([
 *   { id: "1", parent_id: null, position: 0 },
 *   { id: "2", parent_id: "1", position: 0 },
 * ])
 * // => [{ id: "1", parent_id: null, position: 0, children: [
 * //      { id: "2", parent_id: "1", position: 0, children: [] }
 * //    ]}]
 */
export function buildTree(
  items: any[],
  options: BuildTreeOptions = {}
): any[] {
  const {
    parentKey = "parent_id",
    sortKey = "position",
    sort = true,
  } = options

  const byId = new Map<string, any>()
  const roots: any[] = []

  // 1) Create a node for each record (without relations)
  for (const b of items) {
    byId.set(b.id, { ...b, children: [] })
  }

  // 2) Attach to parent or add to roots
  for (const b of items) {
    const node = byId.get(b.id)!
    const pid = b[parentKey]

    if (pid && byId.has(pid)) {
      byId.get(pid)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  // 3) Recursive sorting by specified key (optional)
  if (sort) {
    const sortRec = (arr: any[]) => {
      arr.sort(
        (a, b) => (a[sortKey] ?? 0) - (b[sortKey] ?? 0)
      )
      for (const n of arr) sortRec(n.children)
    }
    sortRec(roots)
  }

  return roots
}

/**
 * Converts a tree (nodes with children) into a flat array. Each node is
 * output with parent_id, position, and children removed. Traversal is
 * depth-first. Inverse of buildTree.
 *
 * @param nodes - Tree nodes with nested children
 * @param options - childrenKey, parentKey, positionKey, parentId
 * @returns Flat array of records with parent_id and position
 *
 * @example
 * flattenTree([
 *   { id: "1", parent_id: null, position: 0, children: [
 *     { id: "2", parent_id: "1", position: 0, children: [] },
 *   ]},
 * ])
 * // => [
 * //   { id: "1", parent_id: null, position: 0 },
 * //   { id: "2", parent_id: "1", position: 0 },
 * // ]
 */
export function flattenTree(
  nodes: any[],
  options: FlattenTreeOptions = {}
): any[] {
  const {
    childrenKey = "children",
    parentKey = "parent_id",
    positionKey = "position",
    parentId = null,
  } = options

  return nodes.flatMap((node, index) => {
    const children = node[childrenKey] ?? []
    const { [childrenKey]: _, ...rest } = node

    const flat: any = {
      ...rest,
      [parentKey]: parentId,
      [positionKey]: index,
    }

    const childFlats = flattenTree(children, {
      ...options,
      parentId: node.id ?? null,
    })

    return [flat, ...childFlats]
  })
}
