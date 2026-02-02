import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createTemplateStep } from "./steps"
import { Template } from "../../modules/mpn-builder/types/interfaces"

export type CreateTemplateWorkflowInput = {
  items: Template[]
}

export const createTemplateWorkflow = createWorkflow(
  "create-template",
  ({ items }: CreateTemplateWorkflowInput) => {
    const template = createTemplateStep({
      items: items,
    })

    return new WorkflowResponse({
      template,
    })
  }
)
