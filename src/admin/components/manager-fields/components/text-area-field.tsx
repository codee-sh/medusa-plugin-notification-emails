import { MentionInput, MentionSuggestion } from "./mention-input"

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  mentionSuggestions?: MentionSuggestion[]
}

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  mentionSuggestions = [],
}: TextAreaFieldProps) => {
  return (
    <MentionInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      suggestions={mentionSuggestions}
    />
  )
}
