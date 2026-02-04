import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTemplatesByTypeServiceStep } from "./steps/get-templates-by-type-service"

export interface GetTemplatesByTypeServiceWorkflowInput {
  type_id: string
  service_id: string
}

export const getTemplatesByTypeServiceWorkflowName = "get-templates-by-type-service"

/**
 * This workflow retrieves templates filtered by type and service.
 *
 * @example
 * const { result } = await getTemplatesByTypeServiceWorkflow(container).run({
 *   input: {
 *     type_id: "db",
 *     service_id: "email"
 *   }
 * })
 */
export const getTemplatesByTypeServiceWorkflow = createWorkflow(
  getTemplatesByTypeServiceWorkflowName,
  (input: WorkflowData<GetTemplatesByTypeServiceWorkflowInput>) => {
    const template = getTemplatesByTypeServiceStep(input)

    return new WorkflowResponse(template)
  }
)
