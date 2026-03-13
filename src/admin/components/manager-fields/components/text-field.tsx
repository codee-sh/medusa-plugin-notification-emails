import { MentionInput, MentionSuggestion } from "./mention-input"

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  mentionSuggestions?: MentionSuggestion[]
}

export const TextField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  mentionSuggestions = [],
}: TextFieldProps) => {
  return (
    <MentionInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      singleLine
      suggestions={mentionSuggestions}
    />
  )
}
