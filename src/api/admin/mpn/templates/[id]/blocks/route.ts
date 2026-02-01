import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { z } from "zod"
import { editTemplateBlocksWorkflow } from "../../../../../../workflows/mpn-templates/edit-template-blocks"
import { MPN_BUILDER_MODULE } from "../../../../../../modules/mpn-builder"
import { MpnBuilderService } from "../../../../../../modules/mpn-builder/services"

export const PostTemplateBlocksSchema = z.object({
  template_id: z.string(),
  blocks: z.array(
    z.object({
      id: z.string().optional(),
      type: z.string().optional(),
      position: z.number().optional(),
      metadata: z.record(z.any()).nullable().optional(),
    })
  ),
})

type PostTemplateBlocksSchema = z.infer<
  typeof PostTemplateBlocksSchema
>

export async function POST(
  req: MedusaStoreRequest<PostTemplateBlocksSchema>,
  res: MedusaResponse
) {
  if (req.body?.template_id) {
    const { result } = await editTemplateBlocksWorkflow(
      req.scope
    ).run({
      input: {
        templateId: req.body.template_id,
        blocks: req.body.blocks || [],
      },
    })

    res.json({
      blocks: result.blocks,
    })
  } else {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "template_id is required"
    )
  }
}

type Block = {
  id: string
  template_id: string
  parent_id: string | null
  type?: string | null
  position?: number | null
  metadata?: Record<string, any> | null
}

type BlockNode = Block & { children: BlockNode[] }

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

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )
  const mpnBuilderService = req.scope.resolve(MPN_BUILDER_MODULE) as MpnBuilderService
  const { template_id } = req.query
  const filters: any = {}

  const isSystemTemplate = typeof template_id === "string" && template_id.startsWith("system_")

  if (!isSystemTemplate) {
    if (template_id) {
      filters.template_id = {
        $eq: template_id,
      }
    }

    const {
      data: blocks,
      metadata: { count, take, skip } = {},
    } = await query.graph({
      entity: "mpn_builder_template_block",
      filters: filters,
      ...req.queryConfig,
    })

    const tree = buildTree(blocks as Block[])

    res.json({
      blocks: blocks,
      tree: tree,
      count: count || 0,
      limit: take || 15,
      offset: skip || 0,
    })    
  } else {
    const templateSystemId = template_id.replace("system_", "")
    const emailTemplateService = mpnBuilderService.getTemplateService("email")?.templateService
    const systemTemplate = emailTemplateService?.getSystemTemplates().find((template: any) => template.name === templateSystemId)
    console.log("systemTemplatesSingle", systemTemplate)

    res.json({
      blocks: [],
      tree: [],
    })
  }
}

// export const DeleteTemplateSchema = z.object({
//   id: z.string(),
// })

// type DeleteTemplateSchema = z.infer<
//   typeof DeleteTemplateSchema
// >

// export async function DELETE(
//   req: MedusaStoreRequest<DeleteTemplateSchema>,
//   res: MedusaResponse
// ) {
//   const { result } = await deleteTemplateWorkflow(
//     req.scope
//   ).run({
//     input: {
//       id: req.body.id as string,
//     } as DeleteTemplateWorkflowInput,
//   })

//   res.json({
//     result: result,
//   })
// }
