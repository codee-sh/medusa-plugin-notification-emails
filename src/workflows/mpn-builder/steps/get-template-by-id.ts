import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export interface GetTemplateByIdStepInput {
  template_id: string
}

export interface GetTemplateByIdStepOutput {
  template: any
}

export const getTemplateByIdStepId = "get-template-by-id"

/**
 * This step retrieves a template by its ID.
 *
 * @example
 * const data = getTemplateByIdStep({
 *   template_id: "template_123"
 * })
 */
export const getTemplateByIdStep = createStep(
  getTemplateByIdStepId,
  async (
    input: GetTemplateByIdStepInput,
    { container }
  ): Promise<StepResponse<GetTemplateByIdStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    if (!input.template_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Template ID is required"
      )
    }

    const { data: templates } = await query.graph({
      entity: "mpn_builder_template",
      fields: [
        "id",
        "name",
        "label",
        "description",
        "channel",
        "locale",
        "subject",
        "is_active",
        "created_at",
        "updated_at",
      ],
      filters: {
        id: {
          $eq: input.template_id,
        },
      },
    })

    if (!templates || templates.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Template with id: ${input.template_id} was not found`
      )
    }

    return new StepResponse({
      template: templates[0],
    })
  }
)
