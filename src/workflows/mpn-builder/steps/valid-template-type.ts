import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { TEMPLATE_TYPES } from "../../../modules/mpn-builder/types"

export interface ValidTemplateTypeStepInput {
  template_id?: string | null
}

export interface ValidTemplateTypeStepOutput {
  template_type: "system" | "external" | "db"
  isSystemTemplate: boolean
  isExternalTemplate: boolean
  isRegistryTemplate: boolean
}

export const validTemplateTypeStepId = "valid-template-type"

/**
 * Step that resolves template type (system, external, db) from template_id prefix.
 * - system_* -> system
 * - external_* -> external
 * - other -> db
 */
export const validTemplateTypeStep = createStep(
  validTemplateTypeStepId,
  (
    input: ValidTemplateTypeStepInput
  ): StepResponse<ValidTemplateTypeStepOutput> => {
    const templateId = input.template_id
    const isSystemTemplate = Boolean(
      templateId?.startsWith(TEMPLATE_TYPES.SYSTEM_TEMPLATE)
    )
    const isExternalTemplate = Boolean(
      templateId?.startsWith(
        TEMPLATE_TYPES.EXTERNAL_TEMPLATE
      )
    )
    const isRegistryTemplate =
      isSystemTemplate || isExternalTemplate

    const template_type: ValidTemplateTypeStepOutput["template_type"] =
      isSystemTemplate
        ? "system"
        : isExternalTemplate
          ? "external"
          : "db"

    return new StepResponse({
      template_type,
      isSystemTemplate,
      isExternalTemplate,
      isRegistryTemplate,
    })
  }
)
