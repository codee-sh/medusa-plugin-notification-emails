import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getServicesTypesTemplatesStep } from "./steps/get-services-types-templates" 
export interface GetServicesTypesTemplatesWorkflowInput {
  service_id?: string
}

export const getServicesTypesTemplatesWorkflowName = "get-services-types-templates"

/**
 * Retrieves services, types and templates. If service_id is provided, returns only templates for that service.
 *
 * @example
 * const { result } = await getServicesTypesTemplatesWorkflow(container).run({
 *   input: {
 *     service_id: "email"
 *   }
 * })
 */
export const getServicesTypesTemplatesWorkflow = createWorkflow(
  getServicesTypesTemplatesWorkflowName,
  (input: WorkflowData<GetServicesTypesTemplatesWorkflowInput>) => {
    const template = getServicesTypesTemplatesStep({
      service_id: input.service_id,
    })

    return new WorkflowResponse(template)
  }
)
