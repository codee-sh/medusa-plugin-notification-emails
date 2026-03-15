import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { getTemplateDetailsWorkflow } from "../../../../../../workflows/mpn-builder/get-template-details"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const { id } = req.params as { id?: string }

  if (!id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Template id is required"
    )
  }

  const { result } = await getTemplateDetailsWorkflow(
    req.scope
  ).run({
    input: { template_id: id },
  })

  res.json({ template: result.template })
}
