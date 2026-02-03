import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import flatMapDeep from "lodash/flatMapDeep"
import { BlockType } from "../../../modules/mpn-builder/types/types"

type EditTemplateBlocksStepInput = {
  template_id: string
  blocks: BlockType[]
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

/**
 * Edit template blocks step input
 * 
 * @param template_id - The template id
 * @param blocks - The blocks to edit
 * @returns The updated blocks
 */
export const editTemplateBlocksStep = createStep(
  "edit-template-blocks",
  async (
    { template_id, blocks }: EditTemplateBlocksStepInput,
    { container }
  ) => {
    const MpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)

    // Flatten the blocks and children
    const flatBlocks = flatMapDeep(blocks, (node: any) => [
      node,
      ...(node.children || []),
    ])
  
    // Get existing blocks for this template
    const existingBlocks =
      await MpnBuilderService.listMpnBuilderTemplateBlocks({
        template_id: template_id,
      })

    // Get the existing block ids
    const existingBlockIds = existingBlocks.map(
      (block: any) => block.id
    )

    // Get the incoming block ids
    const incomingBlockIds = flatBlocks
      .filter((block: any) => block.id)
      .map((block: any) => block.id)

    // Find blocks to delete (existing but not in incoming data)
    const blocksToDelete = existingBlockIds.filter(
      (id: string) => !incomingBlockIds.includes(id)
    )

    // Delete actions that are no longer in the incoming data
    if (blocksToDelete.length > 0) {
      await MpnBuilderService.deleteMpnBuilderTemplateBlocks(
        blocksToDelete
      )
    }

    /**
     * Create a new block
     * @param block - The block to create
     * @returns The created block
     */
    const createBlock = async (block: BlockType): Promise<BlockType> => {
      const blockData = {
        template_id: template_id,
        type: block.type,
        position: block.position,
        metadata: configWithUndefined(block.metadata),
        parent_id: block.parent_id,
      }
      
      const newBlock =
        await MpnBuilderService.createMpnBuilderTemplateBlocks(
          [blockData]
        )

      return newBlock[0] as BlockType
    }

    /**
     * Update a block
     * @param block - The block to update
     * @returns The updated block
     */
    const updateBlock = async (block: BlockType): Promise<BlockType> => {
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

      return updatedBlock[0] as BlockType
    }

    /**
     * Mutate a block
     * @param block - The block to mutate
     * @returns The mutated block
     */
    const mutateBlock = async (block: BlockType): Promise<BlockType> => {
      if (block?.id && !block.virtual) {
        return await updateBlock(block) as BlockType
      } else {
        return await createBlock(block) as BlockType
      }
    }

    // Update or create blocks
    const updatedBlocks = await Promise.all(
      blocks.map(async (block) => {
        const children = block.children

        if (children && children.length > 0) {
          let block_id: string | null = null
          let savedBlock: any

          savedBlock = await mutateBlock(block)
          block_id = savedBlock.id

          const updatedChildrenBlocks = await Promise.all(
            children.map(async (child: any) => {
              return await mutateBlock({
                ...child,
                parent_id: block_id,
              })
            })
          )

          return updatedChildrenBlocks
        } else {
          return await mutateBlock(block)
        }
      })
    )

    return new StepResponse(updatedBlocks, updatedBlocks)
  }
)
