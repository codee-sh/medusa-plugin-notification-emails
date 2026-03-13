import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

export function BlockItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-start justify-between gap-2 w-full p-2 rounded-lg border border-ui-border-base bg-ui-bg-base relative"
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Przeciągnij"
          className="cursor-grab shrink-0 text-ui-fg-subtle hover:text-ui-fg-base"
        >
          ⋮⋮
        </button>

        <div className="flex-1">
          {props.children}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => props.remove(props.index)}
          className="shrink-0"
        >
          <Trash />
        </Button>
      </div>
    </div>
  )
}
