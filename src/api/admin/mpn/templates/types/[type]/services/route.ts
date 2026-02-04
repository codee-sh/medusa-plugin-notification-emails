import {
    MedusaStoreRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { getTemplateServicesWorkflow } from "../../../../../../../workflows/mpn-builder/get-templates-services"
  
  export async function GET(
    req: MedusaStoreRequest,
    res: MedusaResponse
  ) {
    const { type } = req.query
  
    const { result: templateServicesResult } = await getTemplateServicesWorkflow(req.scope).run({
      input: {
        type: type as string,
      },
    })
  
    res.json({
      list: templateServicesResult?.list
    })
  }
  