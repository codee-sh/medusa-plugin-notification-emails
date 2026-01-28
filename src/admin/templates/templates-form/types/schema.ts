import { z } from "zod"

export const baseTemplateFormSchema = z.object({
  general: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),
    label: z
      .string()
      .min(1, "Label is required")
      .min(3, "Label must be at least 3 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(3, "Description must be at least 3 characters"),
    channel: z.enum(["email", "slack"]).transform((val) => val.toLowerCase()).refine((val) => val === "email" || val === "slack", {
      message: "Channel must be either Email or Slack",
    }),
    locale: z.string().min(1, "Locale is required"),
    is_active: z.boolean(),
  })
})

export const baseBlocksSchema = z.object({
  items: z.array(z.object({
    id: z.string().nullable().optional(),
    type: z.string(), 
    virtual: z.boolean().optional(),
    position: z.number().optional(),
    template_id: z.string().optional(),
    parent_id: z.string().nullable().optional(),
    metadata: z.any(),
  }))
})
