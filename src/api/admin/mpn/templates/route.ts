import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { z } from "zod"
import { toKebabCase } from "../../../../utils/string-helpers"
import {
  CreateTemplateWorkflowInput,
  createTemplateWorkflow,
  DeleteTemplateWorkflowInput,
  deleteTemplateWorkflow,
  EditTemplateWorkflowInput,
  editTemplateWorkflow,
} from "../../../../workflows/mpn-builder"
import { MPN_BUILDER_MODULE } from "../../../../modules/mpn-builder"
import MpnBuilderService from "../../../../modules/mpn-builder/service"
import { getTemplatesDbWorkflow } from "../../../../workflows/mpn-builder/get-templates-db"

export const PostTemplateSchema = z.object({
  id: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().transform((val) => toKebabCase(val)),
      label: z.string(),
      description: z.string(),
      channel: z.string(),
      locale: z.string(),
      subject: z.string().nullable().optional(),
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

  const { id, type } = req.query
  const filters: any = {}

  if (id) {
    filters.id = {
      $eq: id,
    }
  }

  const { result: templatesResult } = await getTemplatesDbWorkflow(req.scope).run({
    input: {
      type: type ?? "",
    },
  })

  console.log("templatesResult", JSON.stringify(templatesResult, null, 2))

  res.json({
    templates: templatesResult?.templates
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
