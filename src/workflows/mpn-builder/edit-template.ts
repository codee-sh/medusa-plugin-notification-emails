import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { editTemplateStep } from "./steps"
import { Template } from "../../modules/mpn-builder/types/interfaces"

export type EditTemplateWorkflowInput = {
  id: string
  items: Template[]
}

export const editTemplateWorkflow = createWorkflow(
  "edit-template",
  ({ id, items }: EditTemplateWorkflowInput) => {
    const template = editTemplateStep({
      items: items,
    })

    return new WorkflowResponse({
      template,
    })
  }
)
