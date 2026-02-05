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
