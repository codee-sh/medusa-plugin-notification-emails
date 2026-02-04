import {
  Button
} from "@medusajs/ui"
import { Trash } from "@medusajs/icons"
import { toast } from "@medusajs/ui"
import { useMemo, useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { handleDragEnd } from "../../../../utils"
import { BlockList } from "../components/block-list"
import { BlockItem } from "../components/block-item"
import { BlockItemWrapper } from "../components/block-item-wrapper"
import { BlockItemFields } from "../components/block-item-fields"
import { createBlockFormSchema } from "../../templates/templates-form/utils/block-form-schema"
import { baseBlocksSchema } from "../../templates/templates-form/types/schema"
import { BlockDropdownMenu } from "../components/block-dropdown"
import { useEditTemplateBlocks } from "../../../../hooks/api/templates/blocks"
import { useQueryClient } from "@tanstack/react-query"
import { BlocksChildren } from "../blocks-children"

type BlockFormValues = z.infer<typeof baseBlocksSchema>

export const BlocksForm = (props: any) => {
  const { template_id, template, blocks, items } = props

  const blockFormSchema = useMemo(() => {
    return createBlockFormSchema(
      blocks ?? []
    )
  }, [blocks])

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: { items: items.map((i: any) => ({ ...i, children: i.children ?? [] })) },
    mode: "onChange",
  })

  const itemsPath = "items"

  const { fields, append, remove, move, replace } = useFieldArray({
    control: form.control,
    name: itemsPath,
    keyName: "rhf_id"
  })

  useEffect(() => {
    if (items) {
      replace(items)
    }
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const queryClient = useQueryClient()

  const {
    mutateAsync: editTemplateBlocks,
    isPending: isEditTemplateBlocksPending,
  } = useEditTemplateBlocks()  

  async function onSubmit(values: BlockFormValues) {
    const payload = values.items.map((item, index) => ({
      ...item,
      position: index,
    }))

    const items = {
      template_id: template_id,
      blocks: payload,
    }

    await editTemplateBlocks(items)

    queryClient.invalidateQueries({
      queryKey: ["template-blocks", template_id],
    })

    toast.success(
      "Blocks updated successfully",
      {
        position: "top-right",
        duration: 3000,
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd({ form, path: itemsPath, event, fields, move })}
      >
        <SortableContext
          items={fields.map((f) => f.rhf_id)}
          strategy={verticalListSortingStrategy}
        >
          <BlockList>
            {fields.map((field, index) => {
              return (
                <BlockItem key={field.rhf_id} id={field.rhf_id} item={field} index={index} form={form} remove={remove}>
                  <BlockItemWrapper index={index} field={field} blocks={blocks}>
                    {field.type === "group" && (
                      <BlocksChildren
                        path={`items.${index}`}
                        blocks={blocks}
                        form={form}
                        sensors={sensors}
                        handleDragEnd={handleDragEnd}
                      />
                    ) }
                    {field.type !== "group" && (
                      <BlockItemFields
                        path={`items.${index}`}
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
        <BlockDropdownMenu items={blocks} append={append} />

        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  )
}
