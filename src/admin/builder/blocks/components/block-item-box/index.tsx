import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useFieldArray } from "react-hook-form"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { BlockItemChildren } from "../block-item-children"
import { Heading } from "@medusajs/ui"
import { ManagerFields } from "../../../../components/manager-fields"
import { Button } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

export function BlockItemBox(props) {
  const { index, form, remove, blocks, field, path } = props
  
  const availableBlock = blocks.find((b) => b.type === field.type)
  const fields = availableBlock?.fields || []

  const fieldsPathMetadata = `${path}.metadata`

  return (
    <div className="flex items-start justify-between w-full gap-4">
      <div className="flex-1">
        <Heading level="h2" className="mb-2">Block title: {availableBlock.label} <span className="text-ui-fg-subtle text-xs">(position: {index})</span></Heading>

        <ManagerFields
          name={fieldsPathMetadata}
          form={form}
          fields={fields}
          errors={
            form.formState.errors?.items?.[index]?.metadata as
              | Record<string, string>
              | undefined
          }
        />
      </div>
    </div>
  )
}
