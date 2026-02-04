import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MpnBuilderService from "../../../modules/mpn-builder/service"
import { MPN_BUILDER_MODULE } from "../../../modules/mpn-builder"
import { Template } from "../../../modules/mpn-builder/types/interfaces"
import { toKebabCase } from "../../../utils/string-helpers"

type EditTemplateStepInput = {
  items: Template[]
}

/**
 * Updates existing notification templates.
 *
 * @example
 * const data = editTemplateStep({
 *   items: [{ id: "template_123", name: "updated", ... }]
 * })
 */
export const editTemplateStep = createStep(
  "edit-template",
  async (
    { items }: EditTemplateStepInput,
    { container }
  ) => {
    const mpnBuilderService: MpnBuilderService =
      container.resolve(MPN_BUILDER_MODULE)

    const template =
      await mpnBuilderService.updateMpnBuilderTemplates(
        items.map((item) => ({
          id: item.id,
          name: toKebabCase(item.name),
          description: item.description,
          label: item.label,
          channel: item.channel,
          locale: item.locale,
          subject: item.subject ?? null,
          is_active: item.is_active
        }))
      )

    return new StepResponse(template, template)
  }
)
