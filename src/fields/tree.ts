import { BlockInstance, FlatBlockRecord } from "./types"

export interface BuildBlocksTreeOptions {
  sort?: boolean
  sortKey?: keyof FlatBlockRecord | "position"
}

export function buildBlocksTree(
  items: FlatBlockRecord[],
  options: BuildBlocksTreeOptions = {}
): BlockInstance[] {
  const {
    sort = true,
    sortKey = "position",
  } = options

  const byId = new Map<string, BlockInstance>()
  const roots: BlockInstance[] = []

  for (const item of items) {
    byId.set(item.id, {
      ...item,
      children: [],
    })
  }

  for (const item of items) {
    const node = byId.get(item.id)!
    const parentId = item.parent_id

    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.children!.push(node)
    } else {
      roots.push(node)
    }
  }

  if (sort) {
    const sortNodes = (nodes: BlockInstance[]) => {
      nodes.sort(
        (a, b) =>
          Number(a[sortKey] ?? 0) -
          Number(b[sortKey] ?? 0)
      )

      for (const node of nodes) {
        sortNodes(node.children || [])
      }
    }

    sortNodes(roots)
  }

  return roots
}

export function flattenBlocksTree(
  blocks: BlockInstance[],
  options: {
    parentId?: string | null
  } = {}
): BlockInstance[] {
  const parentId =
    options.parentId === undefined
      ? null
      : options.parentId

  return blocks.flatMap((block, index) => {
    const normalized: BlockInstance = {
      ...block,
      parent_id: parentId,
      position: index,
      children: undefined,
    }

    const children = flattenBlocksTree(
      block.children || [],
      {
        parentId: block.id || null,
      }
    )

    return [normalized, ...children]
  })
}

export function normalizeBlocksPositions(
  blocks: BlockInstance[]
): BlockInstance[] {
  return blocks.map((block, index) => {
    return {
      ...block,
      position: index,
      children: normalizeBlocksPositions(
        block.children || []
      ),
    }
  })
}
