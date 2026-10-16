import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { slackServiceStep } from "./steps/slack-service"
import { SlackServiceWorkflowInput } from "./types"

export const slackServiceWorkflowName =
  "mpn-builder-slack-service"

/**
 * This workflow renders a Slack template using the Slack service.
 *
 * @param input - The input for the workflow.
 * - template_id: Required - The ID of the template to render. It can be a system template or a database template.
 * - data: Required - The data to render the template with.
 * - options: Optional - The options to render the template with.
 *
 *
 * @example
 * const { blocks } = slackServiceWorkflow({
 *   template_id: "system_template_123", // or "123" - ID from the database template
 *   data: {
 *     name: "John Doe",
 *   },
 *   options: {
 *     locale: "en",
 *   },
 * })
 */
export const slackServiceWorkflow = createWorkflow(
  slackServiceWorkflowName,
  (input: SlackServiceWorkflowInput) => {
    const { blocks } = slackServiceStep(input)

    return new WorkflowResponse({
      blocks: blocks,
    })
  }
)
