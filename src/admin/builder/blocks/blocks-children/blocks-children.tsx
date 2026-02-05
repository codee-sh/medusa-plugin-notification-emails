import { useFieldArray } from "react-hook-form"
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { handleDragEnd } from "../../../../utils"
import { BlockItemWrapper } from "../components/block-item-wrapper"
import { BlockList } from "../components/block-list"
import { BlockItem } from "../components/block-item"
import { BlockItemFields } from "../components/block-item-fields"
import { BlockDropdownMenu } from "../components/block-dropdown"
import { BlocksRepeater } from "../blocks-repeater"

export const BlocksChildren = (props: any) => {
  const { blocks, form, path, sensors } = props

  const childrenPath = `${path}.children`

  const { fields: childFields, append: appendChild, move: moveChild, remove: removeChild } = useFieldArray({
    control: form.control,
    name: childrenPath,
    keyName: "rhf_id"
  })

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd({ form, event, fields: childFields, move: moveChild, path: childrenPath })}
      >
        <SortableContext
          items={childFields.map((f) => f.rhf_id)}
          strategy={verticalListSortingStrategy}
        >
          <BlockList>
            {childFields.map((field: any, index: number) => {
              return (
                <BlockItem key={field.rhf_id} id={field.rhf_id} item={field} index={index} form={form} remove={removeChild}>
                  <BlockItemWrapper index={index} field={field} blocks={blocks}>
                    {field.type === "group" && (
                      <BlocksChildren
                        path={`${childrenPath}.${index}`}
                        blocks={blocks}
                        form={form}
                        sensors={sensors}
                        handleDragEnd={handleDragEnd}
                      />
                    )}
                    {field.type === "repeater" && (
                      <BlocksRepeater
                        path={`${childrenPath}.${index}`}
                        blocks={blocks}
                        form={form}
                        sensors={sensors}
                        handleDragEnd={handleDragEnd}
                      />
                    )}
                    {field.type !== "group" && field.type !== "repeater" && (
                      <BlockItemFields
                        path={`${childrenPath}.${index}`}
                        index={index}
                        field={field}
                        blocks={blocks}
                        form={form}
                      />
                    )}
                  </BlockItemWrapper>
                </BlockItem>
              )
            })}
          </BlockList>
        </SortableContext>
      </DndContext>

      <div className="flex justify-between gap-2 mt-4">
        <BlockDropdownMenu items={blocks} append={appendChild} />
      </div>
    </>
  )
}
