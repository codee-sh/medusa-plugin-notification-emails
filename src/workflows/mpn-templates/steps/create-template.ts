import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/services/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import { Template } from "../../../modules/mpn-builder/types/interfaces"

type CreateTemplateStepInput = {
  items: Template[]
}

export const createTemplateStep = createStep(
  "create-template",
  async (
    { items }: CreateTemplateStepInput,
    { container }
  ) => {
    const mpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)

    const template =
      await mpnBuilderService.createMpnBuilderTemplates(
        items.map((item) => ({
          name: item.name,
          description: item.description,
          label: item.label,
          channel: item.channel,
          locale: item.locale,
          is_active: item.is_active,
          blocks: item.blocks,
        }))
      )

    return new StepResponse(template, template)
  }
)
