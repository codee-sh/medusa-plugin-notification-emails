import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emailServiceStep } from "./steps/email-service"
import { EmailServiceWorkflowInput } from "./types"

export const emailServiceWorkflowName =
  "mpn-builder-email-service"

/**
 * This workflow renders an email template using the email service. It sends nothing: pass the
 * result to the Notification Module as the notification `content`.
 *
 * @param input - The input for the workflow, see EmailServiceWorkflowInput.
 * - template_id: Required - The ID of the template to render. It can be a system, external or database template.
 * - data: Required - The data to render the template with.
 * - options: Optional - locale, subject, theme and translations.
 *
 * @example
 * const { result: { html, text, subject } } = await emailServiceWorkflow(container).run({
 *   input: {
 *     template_id: "system_template_123", // or "123" - ID from the database template
 *     data: {
 *       name: "John Doe",
 *     },
 *   },
 * })
 */
export const emailServiceWorkflow = createWorkflow(
  emailServiceWorkflowName,
  function (input: EmailServiceWorkflowInput) {
    const { html, text, subject } = emailServiceStep(input)

    return new WorkflowResponse({
      html,
      text,
      subject,
    })
  }
)
