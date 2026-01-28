import { z } from "zod"
import { baseBlocksSchema } from "../types/schema"

// Function to create schema with dynamic validation based on availableActions
export function createBlockFormSchema(
  availableBlocks?: Array<{
    type: string
    fields?: Array<{
      name: string
      key: string
      label: string
      type: string
      required?: boolean
      placeholder?: string
    }>
  }>
) {
  return baseBlocksSchema.superRefine(
    (data, ctx) => {
      // Validate action config fields dynamically
      if (data.items && availableBlocks) {
        data.items.forEach((item, index) => {
          if (!item.type) {
            return // Skip if no action type selected
          }

          // Find action definition
          const blockDef = availableBlocks.find(
            (b) => b.type === item.type
          )

          if (!blockDef || !blockDef.fields) {
            return // Skip if no fields defined
          }

          // Validate each required field
          blockDef.fields.forEach((field) => {
            if (field.required) {
              const fieldValue =
                item.metadata?.[field.name || field.key]

              if (
                !fieldValue ||
                !String(fieldValue).trim()
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `${field.label} is required`,
                  path: [
                    "items",
                    index,
                    "metadata",
                    field.name || field.key,
                  ],
                })
              }
            }
          })
        })
      }
    }
  )
}
