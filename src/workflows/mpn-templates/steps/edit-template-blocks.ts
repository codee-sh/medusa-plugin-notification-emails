import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/services/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
// import { AutomationAction } from "../../../modules/mpn-automation/types/interfaces"

type EditTemplateBlocksStepInput = {
  template_id: string
  blocks: any[]
}

const configWithUndefined = (config: any) => {
  return config
    ? Object.entries(config).reduce(
        (acc, [key, value]) => {
          if (value === "") {
            acc[key] = undefined
          } else if (
            value !== null &&
            value !== undefined
          ) {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>
      )
    : null
}

export const editTemplateBlocksStep = createStep(
  "edit-template-blocks",
  async (
    { template_id, blocks }: EditTemplateBlocksStepInput,
    { container }
  ) => {
    const MpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)

    // Get existing blocks for this template
    const existingBlocks =
      await MpnBuilderService.listMpnBuilderTemplateBlocks({
        template_id: template_id,
      })

    const existingBlockIds = existingBlocks.map(
      (block: any) => block.id
    )
    const incomingBlockIds = blocks
      .filter((block) => block.id)
      .map((block) => block.id)

    // Find blocks to delete (existing but not in new data)
    const blocksToDelete = existingBlockIds.filter(
      (id: string) => !incomingBlockIds.includes(id)
    )

    // Delete actions that are no longer in the data
    if (blocksToDelete.length > 0) {
      await MpnBuilderService.deleteMpnBuilderTemplateBlocks(
        blocksToDelete
      )
    }

    // Update or create actions
    const updatedBlocks = await Promise.all(
      blocks.map(async (block) => {
        if (block?.id && !block.virtual) {
          // Check if block exists
          const existingBlock = existingBlocks.find(
            (b: any) => b.id === block.id
          )
          if (!existingBlock) {
            throw new Error(
              `Block with id ${block.id} does not exist`
            )
          }

          const updatedBlock =
            await MpnBuilderService.updateMpnBuilderTemplateBlocks(
              [
                {
                  id: block.id,
                  template_id: template_id,
                  parent_id: block.parent_id,
                  position: block.position,
                  metadata: configWithUndefined(
                    block.metadata
                  ),
                },
              ]
            )

          return updatedBlock[0]
        } else {
          const blockData = {
            template_id: template_id,
            type: block.type,
            position: block.position,
            metadata: configWithUndefined(block.metadata),
          }
          
          const newBlock =
            await MpnBuilderService.createMpnBuilderTemplateBlocks(
              [blockData]
            )

          return newBlock[0]
        }
      })
    )

    return new StepResponse(updatedBlocks, updatedBlocks)
  }
)
