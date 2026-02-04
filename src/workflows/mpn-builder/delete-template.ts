import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deleteTemplateStep } from "./steps"

export type DeleteTemplateWorkflowInput = {
  id: string
}

/**
 * Deletes a notification template by ID.
 *
 * @example
 * const { result } = await deleteTemplateWorkflow(container).run({
 *   input: {
 *     id: "template_123"
 *   }
 * })
 */
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
