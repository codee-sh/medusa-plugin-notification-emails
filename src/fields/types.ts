export type FormFieldPrimitiveType =
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

export type FormFieldLayoutType =
  | "group"
  | "array"
  | "row"
  | "collapsible"

export type FormFieldType =
  | FormFieldPrimitiveType
  | FormFieldLayoutType

/**
 * `type` controls builder/form semantics (UI behavior).
 * - `group`: regular block definition (leaf-like or container)
 * - `repeater`: collection block with repeated item scope
 */
export type FormBlockSemanticType = "group" | "repeater"

/**
 * Runtime block identifier stored in DB and used during rendering.
 * Examples: "heading", "text", "row", "repeater", "group".
 */
export type FormBlockRuntimeType = string

export interface FormFieldOption {
  value: string
  name: string
}

export interface FormFieldContext {
  data?: Record<string, unknown>
  siblingData?: Record<string, unknown>
  blockData?: Record<string, unknown>
  path?: string
}

export interface FormFieldAdminConfig {
  description?: string
  placeholder?: string
  readOnly?: boolean
  width?: "full" | "1/2" | "1/3"
  condition?: (
    siblingData: Record<string, unknown>,
    context?: FormFieldContext
  ) => boolean
}

/**
 * Schema for a single form field. Used in FormBlockDefinition.fields
 * to define the form structure for each block type.
 */
export interface FormFieldDefinition {
  name: string
  key: string
  label: string
  description?: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  defaultValue?: unknown
  options?:
    | FormFieldOption[]
    | ((context?: FormFieldContext) => FormFieldOption[])
  min?: number
  max?: number
  step?: number
  validate?: (
    value: unknown,
    siblingData: Record<string, unknown>,
    context?: FormFieldContext
  ) => true | string
  admin?: FormFieldAdminConfig
  fields?: FormFieldDefinition[]
}

/**
 * Block definition for template builder (schema: type, fields, hasChildren).
 * Used by template services to define available blocks.
 */
export interface FormBlockDefinition {
  /**
   * Builder semantic type (NOT persisted as block instance type).
   */
  type: FormBlockSemanticType
  /**
   * Persisted/runtime type for save/load/render (`type` in DB records).
   */
  runtimeType: FormBlockRuntimeType
  label: string
  description?: string
  fields: FormFieldDefinition[]
  hasChildren?: boolean
  ui?: {
    icon?: string
    collapsible?: boolean
    group?: string
  }
}

export interface FormManagerFieldsProps {
  fields: FormFieldDefinition[]
  name: string
  form: any
  errors?: any
  mentionSuggestions?: any[]
}