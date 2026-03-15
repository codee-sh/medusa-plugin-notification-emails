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
