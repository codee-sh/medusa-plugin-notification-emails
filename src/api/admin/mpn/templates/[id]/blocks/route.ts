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
  const { id, template_id } = req.query
  const filters: any = {}

  if (id) {
    filters.id = {
      $eq: id,
    }
  }

  if (template_id) {
    filters.template_id = {
      $eq: template_id,
    }
  }

  console.log("filters", filters)

  const {
    data: blocks,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "mpn_builder_template_block",
    filters: filters,
    ...req.queryConfig,
  })

  res.json({
    blocks: blocks,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
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
