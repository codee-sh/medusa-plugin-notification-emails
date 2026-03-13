import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

export function BlockItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start justify-between gap-2 w-full p-2 rounded-lg border border-ui-border-base bg-ui-bg-base relative ${
        isDragging ? "opacity-80" : ""
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Przeciągnij"
        className="z-10 mt-1 shrink-0 rounded-md p-2 cursor-grab active:cursor-grabbing text-ui-fg-subtle hover:bg-ui-bg-subtle hover:text-ui-fg-base touch-none"
      >
        ⋮⋮
      </button>

      <div className="flex-1 min-w-0">
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
  )
}
