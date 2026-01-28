import {
  Button,
  Heading,
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

import { BlockList } from "../block-list"
import { BlockItem } from "../block-item"
import { ManagerFields } from "../../../../components/manager-fields"
import { createBlockFormSchema } from "../../../templates-form/utils/block-form-schema"
import { baseBlocksSchema } from "../../../templates-form/types/schema"
import { BlockDropdownMenu } from "../block-dropdown"
import { useEditTemplateBlocks } from "../../../../../hooks/api/templates/blocks"
import { useQueryClient } from "@tanstack/react-query"

type BlockFormValues = z.infer<typeof baseBlocksSchema>

export const BlockForm = (props: any) => {
  const { template_id, template, blocks, items } = props

  const blockFormSchema = useMemo(() => {
    return createBlockFormSchema(
      blocks ?? []
    )
  }, [blocks])


  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: { items: items },
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

    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)

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
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.rhf_id)}
          strategy={verticalListSortingStrategy}
        >
          <BlockList>
            {fields.map((field, index) => {
              const availableBlock = blocks.find((b) => b.type === field.type)
              const fields = availableBlock?.fields || []

              return (
                <BlockItem key={field.id} id={field.id} item={field}>
                  <div className="flex items-start justify-between w-full gap-4">
                    <div className="flex-1">
                      <Heading level="h2" className="mb-2">Block title: {availableBlock.label} <span className="text-ui-fg-subtle text-xs">(position: {index})</span></Heading>

                      <ManagerFields
                        name={`items.${index}.metadata`}
                        form={form}
                        fields={fields}
                        errors={
                          form.formState.errors?.items?.[index]?.metadata as
                            | Record<string, string>
                            | undefined
                        }
                      />
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => remove(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
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
