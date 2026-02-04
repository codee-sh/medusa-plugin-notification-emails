import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emailServiceStep } from "./steps/email-service"

export const emailServiceWorkflowName = "mpn-builder-email-service"

/**
 * This workflow renders an email template using the email service.
 * 
 * @param input - The input for the workflow.
 * - template_id: Required - The ID of the template to render. It can be a system template or a database template.
 * - data: Required - The data to render the template with.
 * - options: Optional - The options to render the template with.
 * 
 *
 * @example
 * const { html, text, subject } = emailServiceWorkflow({
 *   template_id: "system_template_123", // or "123" - ID from the database template
 *   data: {
 *     name: "John Doe",
 *   },
 * })
 */
export const emailServiceWorkflow = createWorkflow(
  emailServiceWorkflowName,
  (input: any) => {
    const { html, text, subject } = emailServiceStep(input)

    return new WorkflowResponse({
      html,
      text,
      subject,
    })
  }
)
