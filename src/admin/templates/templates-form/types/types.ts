import { z } from "zod"
import { ProgressStatus } from "@medusajs/ui"
import { baseTemplateFormSchema } from "./schema"

export type TemplateFormValues = z.infer<
  typeof baseTemplateFormSchema
>

export enum Tab {
  GENERAL = "general",
}

export type TabState = Record<Tab, ProgressStatus>
