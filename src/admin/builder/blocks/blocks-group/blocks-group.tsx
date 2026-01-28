import { useFieldArray } from "react-hook-form"
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { BlockList } from "../components/block-list"
import { BlockItem } from "../components/block-item"
import { BlockItemBox } from "../components/block-item-box"
import { BlockDropdownMenu } from "../components/block-dropdown"

export const BlocksGroup = (props: any) => {
  const { blocks, form, path, sensors, handleDragEnd } = props

  const childrenPath = `${path}.children`

  const { fields: childFields, append: appendChild, remove, move, replace } = useFieldArray({
    control: form.control,
    name: childrenPath,
    keyName: "rhf_id"
  })

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={childFields.map((f) => f.rhf_id)}
          strategy={verticalListSortingStrategy}
        >
          <BlockList>
            {childFields.map((field: any, index: number) => {
              return (
                <BlockItem key={field.rhf_id} id={field.rhf_id} item={field} index={index} form={form}>
                  {field.type !== "group" && (
                    <BlockItemBox
                      path={`${childrenPath}.${index}`}
                      index={index}
                      field={field}
                      blocks={blocks}
                      form={form}
                      remove={remove}
                    />
                  )}
                </BlockItem>
              )
            })}
          </BlockList>
        </SortableContext>
      </DndContext>

      <div className="flex justify-between gap-2 mt-4">
        <BlockDropdownMenu items={blocks} append={appendChild} />
      </div>
    </div>
  )
}
