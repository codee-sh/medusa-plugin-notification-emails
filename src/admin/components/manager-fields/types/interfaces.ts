import { MentionSuggestion } from "../components"

export interface DeclarativeFieldManagerProps {
  fields: any
  name: string
  form: any
  errors?: any
  mentionSuggestions?: MentionSuggestion[]
}
