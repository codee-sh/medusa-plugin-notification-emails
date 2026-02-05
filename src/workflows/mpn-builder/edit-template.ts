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

/**
 * Updates existing notification templates.
 *
 * @example
 * const { result } = await editTemplateWorkflow(container).run({
 *   input: {
 *     id: "template_123",
 *     items: [{ id: "template_123", name: "updated", ... }]
 *   }
 * })
 */
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
