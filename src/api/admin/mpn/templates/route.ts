import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { z } from "zod"
import {
  CreateTemplateWorkflowInput,
  createTemplateWorkflow,
  DeleteTemplateWorkflowInput,
  deleteTemplateWorkflow,
  EditTemplateWorkflowInput,
  editTemplateWorkflow,
} from "../../../../workflows/mpn-builder"
import { MPN_BUILDER_MODULE } from "../../../../modules/mpn-builder"
import { MpnBuilderService } from "../../../../modules/mpn-builder/services"

export const PostTemplateSchema = z.object({
  id: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      label: z.string(),
      description: z.string(),
      channel: z.string(),
      locale: z.string(),
      is_active: z.boolean(),
    })
  ),
})

type PostAutomationSchema = z.infer<
  typeof PostTemplateSchema
>

export async function POST(
  req: MedusaStoreRequest<PostAutomationSchema>,
  res: MedusaResponse
) {
  if (req.body?.id) {
    const { result: template } =
      await editTemplateWorkflow(req.scope).run({
        input: req.body as EditTemplateWorkflowInput,
      })

    res.json({
      template: template,
    })
  } else {
    const { result: template } =
      await createTemplateWorkflow(req.scope).run({
        input: req.body as CreateTemplateWorkflowInput,
      })

    res.json({
      template: template,
    })
  }
}

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )

  const mpnBuilderService = req.scope.resolve(MPN_BUILDER_MODULE) as MpnBuilderService

  const { id } = req.query
  const filters: any = {}

  if (id) {
    filters.id = {
      $eq: id,
    }
  }

  const {
    data: templates,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "mpn_builder_template",
    filters: filters,
    ...req.queryConfig,
  })

  const emailTemplateService = mpnBuilderService.getTemplateService("email")?.templateService
  const systemTemplates = emailTemplateService?.getSystemTemplates()
  console.log("systemTemplates", systemTemplates)

  res.json({
    templates: templates,
    systemTemplates: systemTemplates,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}

export const DeleteTemplateSchema = z.object({
  id: z.string(),
})

type DeleteTemplateSchema = z.infer<
  typeof DeleteTemplateSchema
>

export async function DELETE(
  req: MedusaStoreRequest<DeleteTemplateSchema>,
  res: MedusaResponse
) {
  const { result } = await deleteTemplateWorkflow(
    req.scope
  ).run({
    input: {
      id: req.body.id as string,
    } as DeleteTemplateWorkflowInput,
  })

  res.json({
    result: result,
  })
}
