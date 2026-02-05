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
        className="flex items-start justify-between w-full py-4 relative"
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Przeciągnij"
          className="cursor-grab mr-2 shrink-0"
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
        >
          <Trash />
        </Button>        
      </div>
    </div>
  )
}
