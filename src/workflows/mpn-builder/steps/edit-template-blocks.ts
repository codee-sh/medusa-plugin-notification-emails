import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import { BlockType } from "../../../modules/mpn-builder/types"
import {
  compactObject,
  collectTreeIds,
} from "../../../utils"

type EditTemplateBlocksStepInput = {
  template_id: string
  blocks: BlockType[]
}

/**
 * Updates template blocks for a notification template.
 *
 * @example
 * const data = editTemplateBlocksStep({
 *   template_id: "template_123",
 *   blocks: [{ type: "text", content: "Hello" }]
 * })
 */
export const editTemplateBlocksStep = createStep(
  "edit-template-blocks",
  async (
    { template_id, blocks }: EditTemplateBlocksStepInput,
    { container }
  ) => {
    const mpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)
    const existingBlocks =
      await mpnBuilderService.listMpnBuilderTemplateBlocks({
        template_id,
      })
    const existingIds = new Set(
      existingBlocks.map((block: any) => block.id)
    )
    const incomingIds = new Set(collectTreeIds(blocks))
    const deletedIds = existingBlocks
      .map((item: any) => item.id)
      .filter((id: string) => !incomingIds.has(id))

    if (deletedIds.length > 0) {
      await mpnBuilderService.deleteMpnBuilderTemplateBlocks(
        deletedIds
      )
    }

    const upsertNode = async (
      block: BlockType,
      params: {
        parentId: string | null
        position: number
      }
    ): Promise<string> => {
      const payload = {
        template_id,
        type: block.type,
        parent_id: params.parentId,
        position: params.position,
        metadata: compactObject(block.metadata),
      }

      let persistedId = block.id || ""

      if (block.id && existingIds.has(block.id)) {
        const [updated] =
          await mpnBuilderService.updateMpnBuilderTemplateBlocks(
            [
              {
                id: block.id,
                ...payload,
              },
            ]
          )
        persistedId = updated.id
      } else {
        const [created] =
          await mpnBuilderService.createMpnBuilderTemplateBlocks(
            [payload]
          )
        persistedId = created.id
      }

      const children = block.children || []
      await Promise.all(
        children.map((child, index) => {
          return upsertNode(child, {
            parentId: persistedId,
            position: index,
          })
        })
      )

      return persistedId
    }

    await Promise.all(
      blocks.map((block, index) =>
        upsertNode(block, {
          parentId: null,
          position: index,
        })
      )
    )

    return new StepResponse(blocks, blocks)
  }
)
