import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emailServiceStep } from "./steps/email-service"

export const emailServiceWorkflowName = "mpn-builder-email-service"

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
