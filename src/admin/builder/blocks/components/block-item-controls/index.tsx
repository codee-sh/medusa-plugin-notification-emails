import {
  Trash,
  ChevronUpMini,
  ChevronDownMini,
} from "@medusajs/icons"
import { Button, Text } from "@medusajs/ui"

export function BlockItemSortControls(props) {
  const {
    index,
    itemsCount,
    onMoveUp,
    onMoveDown,
    setActivatorNodeRef,
    attributes,
    listeners,
  } = props

  const isFirst = index === 0
  const isLast = index === itemsCount - 1

  return (
    <div className="flex flex-col shrink-0 items-center gap-1">
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Przeciągnij"
        className="z-10 rounded-md p-1.5 cursor-grab active:cursor-grabbing text-ui-fg-subtle bg-ui-bg-subtle hover:bg-ui-bg-subtle-hover hover:text-ui-fg-base touch-none select-none"
      >
        ⋮⋮
      </button>

      <div className="flex flex-col items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Przenieś wyżej"
          className="h-5 w-5 p-0"
        >
          <ChevronUpMini />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Przenieś niżej"
          className="h-5 w-5 p-0"
        >
          <ChevronDownMini />
        </Button>
      </div>
    </div>
  )
}

export function BlockItemDeleteControls(props) {
  const { onRemove } = props

  return (
    <Button
      type="button"
      variant="secondary"
      size="small"
      onClick={onRemove}
      aria-label="Usuń blok"
      className="h-7 w-7 p-0"
    >
      <Trash />
    </Button>
  )
}
