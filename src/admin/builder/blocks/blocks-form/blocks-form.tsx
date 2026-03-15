import { Button } from "@medusajs/ui"
import { toast } from "@medusajs/ui"
import { useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { createBlockFormSchema } from "../../templates/templates-form/utils/block-form-schema"
import { baseBlocksSchema } from "../../templates/templates-form/types/schema"
import { useEditTemplateBlocks } from "../../../../hooks/api/templates/blocks"
import { useQueryClient } from "@tanstack/react-query"
import { BlocksTreeList } from "../components/blocks-tree-list"

type BlockFormValues = z.infer<typeof baseBlocksSchema>

export const BlocksForm = (props: any) => {
  const { template_id, template, blocks, items } = props

  const blockFormSchema = useMemo(() => {
    return createBlockFormSchema(blocks ?? [])
  }, [blocks])

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      items: items.map((i: any) => ({
        ...i,
        children: i.children ?? [],
      })),
    },
    mode: "onChange",
  })

  const itemsPath = "items"

  useEffect(() => {
    if (items) {
      form.reset({
        items,
      })
    }
  }, [items, form])

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
    queryClient.invalidateQueries({
      queryKey: ["preview", template_id],
    })

    toast.success("Blocks updated successfully", {
      position: "top-right",
      duration: 3000,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <BlocksTreeList
        path={itemsPath}
        blocks={blocks}
        form={form}
        sensors={sensors}
        footerRight={
          <Button type="submit" variant="primary">
            Save
          </Button>
        }
      />
    </form>
  )
}
