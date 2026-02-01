import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"

type Block = {
  id: string
  template_id: string
  parent_id: string | null
  type?: string | null
  position?: number | null
  metadata?: Record<string, any> | null
}

type BlockNode = Block & { children: BlockNode[] }

export interface GetBlocksByTemplateStepInput {
  template_id: string
}

export interface GetBlocksByTemplateStepOutput {
  blocks: any[]
}

export const getBlocksByTemplateStepId = "get-blocks-by-template"

function buildTree(items: Block[]): BlockNode[] {
  const byId = new Map<string, BlockNode>()
  const roots: BlockNode[] = []

  // 1) utwórz "node" dla każdego rekordu (bez relacji)
  for (const b of items) {
    byId.set(b.id, { ...b, children: [] })
  }

  // 2) podepnij do rodzica albo wrzuć do rootów
  for (const b of items) {
    const node = byId.get(b.id)!
    const pid = b.parent_id

    if (pid && byId.has(pid)) {
      byId.get(pid)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  // 3) sortowanie rekurencyjne po position (opcjonalne)
  const sortRec = (arr: BlockNode[]) => {
    arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    for (const n of arr) sortRec(n.children)
  }
  sortRec(roots)

  return roots
}

/**
 * This step retrieves an order by its ID with related items, customer, addresses, and payment collections.
 *
 * @example
 * const data = getOrderByIdStep({
 *   order_id: "order_123"
 * })
 */
export const getBlocksByTemplateStep = createStep(
  getBlocksByTemplateStepId,
  async (
    input: GetBlocksByTemplateStepInput,
    { container }
  ): Promise<StepResponse<GetBlocksByTemplateStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    if (!input.template_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Template ID is required"
      )
    }

    const { data: blocks } = await query.graph({
      entity: "mpn_builder_template_block",
      fields: ["id", "type", "parent_id", "position", "metadata"],
      filters: {
        template_id: {
          $in: [input.template_id],
        },
      },
    })

    const tree = buildTree(blocks as Block[])

    return new StepResponse({
      blocks: tree
    })
  }
)

