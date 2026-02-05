import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { editTemplateBlocksStep } from "./steps/edit-template-blocks"

export type EditTemplateBlocksWorkflowInput = {
  templateId: string
  blocks: any[]
}

/**
 * Updates template blocks for a notification template.
 *
 * @example
 * const { result } = await editTemplateBlocksWorkflow(container).run({
 *   input: {
 *     templateId: "template_123",
 *     blocks: [{ type: "text", content: "Hello" }]
 *   }
 * })
 */
export const editTemplateBlocksWorkflow = createWorkflow(
  "edit-template-blocks",
  ({
    templateId,
    blocks,
  }: EditTemplateBlocksWorkflowInput) => {
    const templateBlocks = editTemplateBlocksStep({
      template_id: templateId,
      blocks: blocks,
    })

    return new WorkflowResponse({
      blocks: templateBlocks,
    })
  }
)
