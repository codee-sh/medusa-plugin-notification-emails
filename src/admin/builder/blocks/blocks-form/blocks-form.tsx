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

import { BlockList } from "../components/block-list"
import { BlockItem } from "../components/block-item"
import { BlockItemBox } from "../components/block-item-box"
import { BlocksGroup } from "../blocks-group/blocks-group"
import { createBlockFormSchema } from "../../templates/templates-form/utils/block-form-schema"
import { baseBlocksSchema } from "../../templates/templates-form/types/schema"
import { BlockDropdownMenu } from "../components/block-dropdown"
import { useEditTemplateBlocks } from "../../../../hooks/api/templates/blocks"
import { useQueryClient } from "@tanstack/react-query"

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
    defaultValues: { items: items.map(i => ({ ...i, children: i.children ?? [] })) },
    mode: "onChange",
  })

  const { fields, append, remove, move, replace } = useFieldArray({
    control: form.control,
    name: "items",
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

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const oldIndex = fields.findIndex((f) => f.rhf_id === active.id)
    const newIndex = fields.findIndex((f) => f.rhf_id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    move(oldIndex, newIndex)
  }

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

    console.log("items", items)

    // await editTemplateBlocks(items)

    // queryClient.invalidateQueries({
    //   queryKey: ["template-blocks", template_id],
    // })

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
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.rhf_id)}
          strategy={verticalListSortingStrategy}
        >
          <BlockList>
            {fields.map((field, index) => {
              return (
                <BlockItem key={field.rhf_id} id={field.rhf_id} item={field} index={index} form={form} remove={remove}>
                  {field.type === "group" && (
                    <BlocksGroup
                      path={`items.${index}`}
                      blocks={blocks}
                      form={form}
                      sensors={sensors}
                      handleDragEnd={handleDragEnd}
                    />
                  ) }
                  {field.type !== "group" && (
                    <BlockItemBox
                      path={`items.${index}`}
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
        <BlockDropdownMenu items={blocks} append={append} />

        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  )
}
