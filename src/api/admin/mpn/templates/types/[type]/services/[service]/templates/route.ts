import {
    MedusaStoreRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { getTemplatesByTypeServiceWorkflow } from "../../../../../../../../../workflows/mpn-builder/get-templates-by-type-service"
  
  export async function GET(
    req: MedusaStoreRequest,
    res: MedusaResponse
  ) {
    const params = req.params
    const { type, service } = params

    const { result: templatesResult } = await getTemplatesByTypeServiceWorkflow(req.scope).run({
      input: {
        service_id: service as string,
        type_id: type as string,
      },
    })

    res.json({
      list: templatesResult?.templates
    })
  }
  