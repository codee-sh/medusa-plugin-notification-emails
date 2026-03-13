export type FieldPrimitiveType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "date"
  | "chip-input"
  | "email"
  | "password"
  | "file"

export type FieldLayoutType =
  | "group"
  | "array"
  | "row"
  | "collapsible"

export type FieldType = FieldPrimitiveType | FieldLayoutType

/**
 * `type` controls builder/form semantics (UI behavior).
 * - `group`: regular block definition (leaf-like or container)
 * - `repeater`: collection block with repeated item scope
 */
export type BlockSemanticType = "group" | "repeater"

/**
 * Runtime block identifier stored in DB and used during rendering.
 * Examples: "heading", "text", "row", "repeater", "group".
 */
export type BlockRuntimeType = string

export interface FieldOption {
  value: string
  name: string
}

export interface FieldContext {
  data?: Record<string, unknown>
  siblingData?: Record<string, unknown>
  blockData?: Record<string, unknown>
  path?: string
}

export interface FieldAdminConfig {
  description?: string
  placeholder?: string
  readOnly?: boolean
  width?: "full" | "1/2" | "1/3"
  condition?: (
    siblingData: Record<string, unknown>,
    context?: FieldContext
  ) => boolean
}

export interface FieldDefinition {
  name: string
  key: string
  label: string
  description?: string
  type: FieldType
  placeholder?: string
  required?: boolean
  defaultValue?: unknown
  options?:
    | FieldOption[]
    | ((context?: FieldContext) => FieldOption[])
  min?: number
  max?: number
  step?: number
  validate?: (
    value: unknown,
    siblingData: Record<string, unknown>,
    context?: FieldContext
  ) => true | string
  admin?: FieldAdminConfig
  fields?: FieldDefinition[]
}

export interface BlockDefinition {
  /**
   * Builder semantic type (NOT persisted as block instance type).
   */
  type: BlockSemanticType
  /**
   * Persisted/runtime type for save/load/render (`type` in DB records).
   */
  runtimeType: BlockRuntimeType
  label: string
  description?: string
  fields: FieldDefinition[]
  hasChildren?: boolean
  ui?: {
    icon?: string
    collapsible?: boolean
    group?: string
  }
}

export interface BlockInstance {
  id?: string
  /**
   * Runtime type persisted in DB.
   */
  type: BlockRuntimeType
  position?: number
  parent_id?: string | null
  metadata?: Record<string, unknown> | null
  virtual?: boolean
  children?: BlockInstance[]
}

export interface FlatBlockRecord {
  id: string
  template_id: string
  type: BlockRuntimeType
  parent_id: string | null
  position: number
  metadata: Record<string, unknown> | null
}
