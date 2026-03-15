import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { z } from "zod"
import { buildTree } from "../../../../../../utils"
import { editTemplateBlocksWorkflow } from "../../../../../../workflows/mpn-builder/edit-template-blocks"
import { validTemplateTypeWorkflow } from "../../../../../../workflows/mpn-builder/valid-template-type"

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

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )
  const { template_id } = req.query

  const { result: { isRegistryTemplate } } =
    await validTemplateTypeWorkflow(req.scope).run({
      input: {
        template_id: template_id as string,
      },
    })

  if (isRegistryTemplate) {
    res.json({
      blocks: [],
      tree: [],
      count: 0,
      limit: 15,
      offset: 0,
    })
    return
  }

  const filters: any = {}
  if (template_id) {
    filters.template_id = { $eq: template_id }
  }

  const {
    data: blocks,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "mpn_builder_template_block",
    filters,
    ...req.queryConfig,
  })

  const tree = buildTree(blocks || [])

  res.json({
    blocks: blocks || [],
    tree,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}