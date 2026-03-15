import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplateDetailsStep } from "./steps/get-template-details"

export interface GetTemplateDetailsWorkflowInput {
  template_id: string
}

export const getTemplateDetailsWorkflowId =
  "get-template-details"

/**
 * Resolves a template by ID from DB, system, or external sources.
 * Returns a unified template object with template_source and template_type.
 */
export const getTemplateDetailsWorkflow = createWorkflow(
  getTemplateDetailsWorkflowId,
  (
    input: WorkflowData<GetTemplateDetailsWorkflowInput>
  ) => {
    const result = getTemplateDetailsStep({
      template_id: input.template_id,
    })

    return new WorkflowResponse(result)
  }
)
