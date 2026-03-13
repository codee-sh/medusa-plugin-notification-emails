import { ReactNode } from "react"
import { useFieldArray } from "react-hook-form"
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { handleDragEnd } from "../../../../../utils"
import { BlockList } from "../block-list"
import { BlockItem } from "../block-item"
import { BlockItemWrapper } from "../block-item-wrapper"
import { BlockItemFields } from "../block-item-fields"
import { BlockDropdownMenu } from "../block-dropdown"
import { BlocksRepeater } from "../../blocks-repeater"
import { resolveBlockUiState } from "../../utils/block-ui-resolver"

type BlocksTreeListProps = {
  blocks: any[]
  form: any
  path: string
  sensors: any
  footerRight?: ReactNode
}

export function BlocksTreeList({
  blocks,
  form,
  path,
  sensors,
  footerRight,
}: BlocksTreeListProps) {
  const {
    fields,
    append,
    move,
    remove,
  } = useFieldArray({
    control: form.control,
    name: path,
    keyName: "rhf_id",
  })

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) =>
          handleDragEnd({
            form,
            event,
            fields,
            move,
            path,
          })}
      >
        <SortableContext
          items={fields.map((f) => f.rhf_id)}
          strategy={verticalListSortingStrategy}
        >
          <BlockList>
            {fields.map((field: any, index: number) => {
              const itemPath = `${path}.${index}`
              const {
                isRepeater,
                canHaveChildren,
              } = resolveBlockUiState(
                blocks,
                field.type
              )

              return (
                <BlockItem
                  key={field.rhf_id}
                  id={field.rhf_id}
                  item={field}
                  index={index}
                  form={form}
                  remove={remove}
                >
                  <BlockItemWrapper
                    index={index}
                    field={field}
                    blocks={blocks}
                  >
                    {isRepeater && (
                      <BlocksRepeater
                        path={itemPath}
                        blocks={blocks}
                        form={form}
                        sensors={sensors}
                        handleDragEnd={handleDragEnd}
                      />
                    )}
                    {!isRepeater && (
                      <BlockItemFields
                        path={itemPath}
                        index={index}
                        field={field}
                        blocks={blocks}
                        form={form}
                      />
                    )}
                    {!isRepeater && canHaveChildren && (
                      <BlocksTreeList
                        path={`${itemPath}.children`}
                        blocks={blocks}
                        form={form}
                        sensors={sensors}
                      />
                    )}
                  </BlockItemWrapper>
                </BlockItem>
              )
            })}
          </BlockList>
        </SortableContext>
      </DndContext>

      <div className="sticky bottom-0 left-0 right-0 flex justify-between gap-2 mt-2 p-2 bg-ui-bg-base border rounded-lg">
        <BlockDropdownMenu items={blocks} append={append} />
        {footerRight}
      </div>
    </>
  )
}
