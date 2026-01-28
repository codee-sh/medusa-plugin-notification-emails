import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export function BlockItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id })

  console.log("props", props)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
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
    </div>
  )
}
