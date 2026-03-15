import { FormBlockDefinition } from "../../../../modules/mpn-builder/types"

type BlockUiState = {
  definition?: FormBlockDefinition
  isRepeater: boolean
  canHaveChildren: boolean
}

export function resolveBlockDefinition(
  blocks: FormBlockDefinition[] = [],
  runtimeType?: string
): FormBlockDefinition | undefined {
  return blocks.find(
    (block) => block.runtimeType === runtimeType
  )
}

export function resolveBlockUiState(
  blocks: FormBlockDefinition[] = [],
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
