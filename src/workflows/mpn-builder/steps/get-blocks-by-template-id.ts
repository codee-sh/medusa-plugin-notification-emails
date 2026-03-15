import { MedusaError } from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { buildTree } from "../../../utils"
import { FlatBlockRecord } from "../../../fields/types"

export interface GetBlocksByTemplateStepInput {
  template_id: string
}

export interface GetBlocksByTemplateStepOutput {
  blocks: any[]
}

export const getBlocksByTemplateStepId =
  "get-blocks-by-template"

const normalizeRecord = (
  record: Record<string, any>
): FlatBlockRecord => {
  return {
    id: record.id,
    template_id: record.template_id,
    type: record.type,
    parent_id: record.parent_id ?? null,
    position: Number(record.position ?? 0),
    metadata: record.metadata ?? null,
  }
}

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

    const records =
      await mpnBuilderService.listMpnBuilderTemplateBlocks({
        template_id: input.template_id,
      })
    const blocks = records.map((record: any) =>
      normalizeRecord(record)
    )
    const tree = buildTree(blocks)

    return new StepResponse({
      blocks: tree,
    })
  }
)
