import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { validTemplateTypeStep } from "./steps/valid-template-type"

export interface ValidTemplateTypeWorkflowInput {
  template_id?: string | null
}

export const validTemplateTypeWorkflowId =
  "valid-template-type"

/**
 * Workflow that resolves template type (system, external, db) from template_id.
 * Can be run standalone: validTemplateTypeWorkflow(scope).run({ input: { template_id: "x" } })
 */
export const validTemplateTypeWorkflow = createWorkflow(
  validTemplateTypeWorkflowId,
  (input: WorkflowData<ValidTemplateTypeWorkflowInput>) => {
    const result = validTemplateTypeStep({
      template_id: input.template_id,
    })

    return new WorkflowResponse(result)
  }
)
