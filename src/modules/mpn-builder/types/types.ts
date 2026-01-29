export type BlockType = {
  id: string
  type: string
  position: number
  metadata: Record<string, any>
  parent_id: string
  virtual?: boolean
  children?: BlockType[]
}

export interface FieldConfig {
  name: string
  key: string
  label: string
  description?: string
  type:
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
  placeholder?: string
  required?: boolean
  defaultValue?: any
  options?: Array<{ value: string; name: string }>
  min?: number
  max?: number
  step?: number
}

export type ModuleOptions = {
  builder?: {
    
  }
}