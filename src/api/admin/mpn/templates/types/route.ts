import {
    MedusaStoreRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { getTemplateTypesWorkflow } from "../../../../../workflows/mpn-builder/get-templates-types"
  
  export async function GET(
    req: MedusaStoreRequest,
    res: MedusaResponse
  ) {
    const { result: templateTypesResult } = await getTemplateTypesWorkflow(req.scope).run({
      input: {},
    })
  
    res.json({
      list: templateTypesResult?.list
    })
  }
  