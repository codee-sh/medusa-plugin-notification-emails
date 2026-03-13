import {
  Badge,
  Input,
  Text,
  Textarea,
} from "@medusajs/ui"
import {
  KeyboardEvent,
  Ref,
  useMemo,
  useRef,
  useState,
} from "react"

export type MentionSuggestion = {
  id: string
  display: string
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  singleLine?: boolean
  suggestions?: MentionSuggestion[]
  rows?: number
}

export const MentionInput = ({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  singleLine = false,
  suggestions = [],
  rows = 3,
}: MentionInputProps) => {
  const inputRef = useRef<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const selectionStart =
    inputRef.current?.selectionStart || 0
  const beforeCursor = (value || "").slice(
    0,
    selectionStart
  )
  const triggerMatch =
    beforeCursor.match(/#([a-zA-Z0-9._-]*)$/)
  const query = triggerMatch?.[1] || ""
  const triggerStart =
    triggerMatch === null
      ? -1
      : selectionStart - query.length - 1

  const filteredSuggestions = useMemo(() => {
    if (!triggerMatch) {
      return []
    }

    const normalized = query.toLowerCase()
    return suggestions.filter((item) => {
      return (
        item.display
          .toLowerCase()
          .includes(normalized) ||
        item.id.toLowerCase().includes(normalized)
      )
    })
  }, [query, suggestions, triggerMatch])

  const isOpen = filteredSuggestions.length > 0

  const insertSuggestion = (suggestion: MentionSuggestion) => {
    if (triggerStart < 0 || !inputRef.current) {
      return
    }

    const currentValue = value || ""
    const afterCursor = currentValue.slice(selectionStart)
    const nextValue =
      currentValue.slice(0, triggerStart) +
      `${suggestion.id} ` +
      afterCursor

    onChange(nextValue)

    const nextCaret =
      triggerStart + suggestion.id.length + 1
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(
        nextCaret,
        nextCaret
      )
    })
    setActiveIndex(0)
  }

  const onKeyDown = (
    event: KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    if (!isOpen) {
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((prev) =>
        Math.min(
          prev + 1,
          filteredSuggestions.length - 1
        )
      )
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      const selected = filteredSuggestions[activeIndex]
      if (selected) {
        insertSuggestion(selected)
      }
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setActiveIndex(0)
    }
  }

  return (
    <div className="relative">
      {singleLine ? (
        <Input
          type="text"
          ref={inputRef as Ref<HTMLInputElement>}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
        />
      ) : (
        <Textarea
          ref={inputRef as Ref<HTMLTextAreaElement>}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          spellCheck={false}
        />
      )}

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-base shadow-elevation-card-rest">
          <div className="border-b border-ui-border-base bg-ui-bg-subtle px-3 py-2">
            <Text size="xsmall" className="text-ui-fg-muted">
              Add variable
            </Text>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
          {filteredSuggestions.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={item.id}
                type="button"
                className={`w-full px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-ui-bg-field-hover text-ui-fg-base"
                    : "bg-ui-bg-base text-ui-fg-subtle hover:bg-ui-bg-subtle"
                }`}
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={() => insertSuggestion(item)}
              >
                <div className="flex items-center gap-2">
                  <Badge size="2xsmall">#</Badge>
                  <Text
                    size="small"
                    weight="plus"
                    className="truncate text-ui-fg-base"
                  >
                    {item.display}
                  </Text>
                </div>
                {item.id !== item.display && (
                  <Text
                    size="xsmall"
                    className="mt-0.5 truncate text-ui-fg-muted"
                  >
                    {item.id}
                  </Text>
                )}
              </button>
            )
          })}
          </div>
        </div>
      )}
    </div>
  )
}
