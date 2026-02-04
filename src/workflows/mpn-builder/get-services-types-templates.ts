import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getServicesTypesTemplatesStep } from "./steps/get-services-types-templates" 
export interface GetServicesTypesTemplatesWorkflowInput {
}

export const getServicesTypesTemplatesWorkflowName = "get-services-types-templates"

/**
 * This workflow retrieves all services, types and templates.
 *
 * @example
 * const { result } = await getServicesTypesTemplatesWorkflow(container).run({
 *   input: {}
 * })
 */
export const getServicesTypesTemplatesWorkflow = createWorkflow(
  getServicesTypesTemplatesWorkflowName,
  (input: WorkflowData<GetServicesTypesTemplatesWorkflowInput>) => {
    const template = getServicesTypesTemplatesStep()

    return new WorkflowResponse(template)
  }
)
