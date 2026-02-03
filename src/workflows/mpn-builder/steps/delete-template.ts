  import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"

type DeleteTemplateStepInput = {
  id: string
}

export const deleteTemplateStep = createStep(
  "delete-template",
  async (
    { id }: DeleteTemplateStepInput,
    { container }
  ) => {
    const mpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)

    // Delete the trigger (cascade delete will handle related rules, states, and actions)
    await mpnBuilderService.deleteMpnBuilderTemplates([
      id,
    ])

    return new StepResponse(
      { id, deleted: true },
      { id, deleted: true }
    )
  }
)
