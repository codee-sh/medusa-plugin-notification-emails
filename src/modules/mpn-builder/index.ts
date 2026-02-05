import { Module } from "@medusajs/framework/utils"
import MpnBuilderService from "./service"

export const MPN_BUILDER_MODULE = "mpnBuilder"

export default Module(MPN_BUILDER_MODULE, {
  service: MpnBuilderService,
})
