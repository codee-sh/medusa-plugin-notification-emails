import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  createStep,
} from "@medusajs/framework/workflows-sdk"

export interface GetTemplateStepInput {
  template_id?: string
  channel?: string
  name?: string
  locale?: string
  active?: boolean
  fields?: string[]
}

export interface GetTemplateStepOutput {
  templates: any[]
}

export const getTemplateStepId = "get-template"

/**
 * This step retrieves a template by its ID.
 *
 * @example
 * const data = getTemplateByIdStep({
 *   channel: "email"
 *   name: "welcome"
 *   locale: "en"
 *   active: true
 * })
 */
export const getTemplateStep = createStep(
  getTemplateStepId,
  async (
    input: GetTemplateStepInput,
    { container }
  ): Promise<StepResponse<GetTemplateStepOutput>> => {
    const query = container.resolve(
      ContainerRegistrationKeys.QUERY
    )

    const filters: any = {}

    if (input.template_id) {
      filters.id = {
        $eq: input.template_id,
      }
    }

    if (input.channel) {
      filters.channel = {
        $eq: input.channel,
      }
    }

    if (input.name) {
      filters.name = {
        $eq: input.name,
      }
    }

    if (input.locale) {
      filters.locale = {
        $eq: input.locale,
      }
    }

    if (input.active) {
      filters.is_active = {
        $eq: input.active,
      }
    }

    const fields = [
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
      ...(input.fields || []),
    ]

    const { data: templates } = await query.graph({
      entity: "mpn_builder_template",
      fields: fields,
      filters,
    })

    console.log("filters", filters)
    console.log("templates", templates)

    if (!templates || templates.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Template with filters: ${JSON.stringify(filters)} was not found`
      )
    }

    return new StepResponse({
      templates: templates,
    })
  }
)
