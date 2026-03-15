import {
  MedusaStoreRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MPN_BUILDER_MODULE } from "../../../../../modules/mpn-builder"
import MpnBuilderService from "../../../../../modules/mpn-builder/service"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const builderService = req.scope.resolve(
    MPN_BUILDER_MODULE
  ) as MpnBuilderService

  const list = builderService.listAvailableContexts()

  res.json({
    list,
  })
}
