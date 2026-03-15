import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  BlockItemDeleteControls,
  BlockItemSortControls,
} from "../block-item-controls"

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
      <BlockItemSortControls
        index={props.index}
        itemsCount={props.itemsCount}
        onMoveUp={() =>
          props.move(props.index, props.index - 1)
        }
        onMoveDown={() =>
          props.move(props.index, props.index + 1)
        }
        setActivatorNodeRef={setActivatorNodeRef}
        attributes={attributes}
        listeners={listeners}
      />

      <div className="flex-1 min-w-0">{props.children}</div>

      <BlockItemDeleteControls
        onRemove={() => props.remove(props.index)}
      />
    </div>
  )
}
