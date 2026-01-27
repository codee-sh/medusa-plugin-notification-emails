import {
  MedusaService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  MpnBuilderTemplate,
  MpnBuilderTemplateBlock,
} from "../models"
import {
  ModuleOptions,
} from "../types"
import { Logger } from "@medusajs/framework/types"

type InjectedDependencies = {
  logger: Logger
}

class MpnBuilderService extends MedusaService({
  MpnBuilderTemplate,
  MpnBuilderTemplateBlock,
}) {
  private options_: ModuleOptions
  private logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options?: ModuleOptions
  ) {
    super(...arguments)

    this.logger_ = logger
    this.options_ = options || {}
  }
}

export default MpnBuilderService
