import { BlockDefinition } from "../../../../fields"

type BlockUiState = {
  definition?: BlockDefinition
  isRepeater: boolean
  canHaveChildren: boolean
}

export function resolveBlockDefinition(
  blocks: BlockDefinition[] = [],
  runtimeType?: string
): BlockDefinition | undefined {
  return blocks.find(
    (block) => block.runtimeType === runtimeType
  )
}

export function resolveBlockUiState(
  blocks: BlockDefinition[] = [],
  runtimeType?: string
): BlockUiState {
  const definition = resolveBlockDefinition(
    blocks,
    runtimeType
  )

  return {
    definition,
    isRepeater: definition?.type === "repeater",
    canHaveChildren: Boolean(definition?.hasChildren),
  }
}
