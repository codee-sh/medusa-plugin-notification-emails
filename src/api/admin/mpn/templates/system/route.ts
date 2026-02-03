import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { getTemplatesSystemWorkflow } from "../../../../../workflows/mpn-builder/get-templates-system"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const { type } = req.query

  const { result: templatesResult } = await getTemplatesSystemWorkflow(req.scope).run({
    input: {
      type: type ?? "",
    },
  })

  res.json({
    templates: templatesResult?.templates
  })
}
