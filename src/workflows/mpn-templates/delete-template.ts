import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deleteTemplateStep } from "./steps"

export type DeleteTemplateWorkflowInput = {
  id: string
}

export const deleteTemplateWorkflow = createWorkflow(
  "delete-template",
  ({ id }: DeleteTemplateWorkflowInput) => {
    const result = deleteTemplateStep({
      id: id,
    })

    return new WorkflowResponse({
      result,
    })
  }
)
