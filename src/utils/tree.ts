export interface BuildTreeOptions {
  /**
   * Key used to identify parent relationship (default: "parent_id")
   */
  parentKey?: string
  /**
   * Key used for sorting nodes (default: "position")
   */
  sortKey?: string
  /**
   * Whether to sort the tree (default: true)
   */
  sort?: boolean
}

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

export interface FlattenTreeOptions {
  /**
   * Key for child nodes (default: "children")
   */
  childrenKey?: string
  /**
   * Key for parent id in output (default: "parent_id")
   */
  parentKey?: string
  /**
   * Key for position in output (default: "position")
   */
  positionKey?: string
  /**
   * Parent id for current level (default: null for roots)
   */
  parentId?: string | null
}

/**
 * Converts a tree (nodes with children) into a flat array.
 * Inverse of buildTree.
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
