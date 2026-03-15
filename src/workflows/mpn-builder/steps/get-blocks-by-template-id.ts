import { MedusaError } from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { buildTree } from "../../../utils"

export interface GetBlocksByTemplateStepInput {
  template_id: string
}

export interface GetBlocksByTemplateStepOutput {
  blocks: any[]
}

export const getBlocksByTemplateStepId =
  "get-blocks-by-template"

/**
 * Retrieves all blocks for a specific template, organized as a tree structure.
 *
 * @example
 * const data = getBlocksByTemplateStep({
 *   template_id: "template_123"
 * })
 */
export const getBlocksByTemplateStep = createStep(
  getBlocksByTemplateStepId,
  async (
    input: GetBlocksByTemplateStepInput,
    { container }
  ): Promise<
    StepResponse<GetBlocksByTemplateStepOutput>
  > => {
    const mpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)

    if (!input.template_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Template ID is required"
      )
    }

    const items =
      await mpnBuilderService.listMpnBuilderTemplateBlocks({
        template_id: input.template_id,
      })

    const blocks = items.map((item: any) => ({
      id: item.id,
      template_id: item.template_id,
      type: item.type,
      parent_id: item.parent_id ?? null,
      position: Number(item.position ?? 0),
      metadata: item.metadata ?? null,
    }))

    // Convert flat array of blocks from the database to a tree structure
    const tree = buildTree(blocks)

    return new StepResponse({
      blocks: tree,
    })
  }
)
